

function get(url) {
    const pr = new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText);
            } else {
                reject({status: this.status, statusText: xhr.statusText});
            }
        };
        xhr.open('GET', url);
        xhr.send();
    });

    return pr;
}

new Vue({
    el: '#q-app',
    data: {
        items: [],
        terms: ''
    },
    methods: {
        loadMore: function (index, done) {
            console.log("Calling loadMore", index);

            const batch_size = 10;
            const arr = [];
            for(let i = 0; i < batch_size; i++) {
                arr.push(get(`http://localhost:3000/files?_start=${index*batch_size+i}&_end=${index*batch_size+i+1}`));
            }
            Promise.all(arr).then((values)=>{
                this.items = this.items.concat(values.map((o)=>{
                    const ob = JSON.parse(o)[0];
                    const img_path = ob.links.download;
                    const img_name = ob.filename;
                    return {url: img_path, name: img_name};
                }));
                done();
            })
            .catch((e) => console.log(e));
        },
        search: function (terms, done) {
            get(`http://localhost:3000/files?q=${terms}`)
            .then((res)=> {
                const ob = JSON.parse(res);
                this.items.length = 0;
                this.items = this.items.concat(
                    ob.map((o)=>{
                        return {
                            url: o.links.download,
                            name: o.filename
                        }
                    })
                );
                done(JSON.parse(res).map((o)=>{return {
                    label: o.filename,
                    value: JSON.stringify(o)
                }}));
            })
            .catch((e)=>done());
        },
        selected: function (item, keyboard) {
            console.log("keyboard", keyboard);
            console.log("item", item.label, item.value);
            const ob = JSON.parse(item.value);
            const img_path = ob.links.download;
            const img_name = ob.filename;
            this.items = [{url: img_path, name: img_name}];
        }
    }
})