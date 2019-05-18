// hash for a string
function hash(str) {
	var i,v0,v1,abc="0123456789" +"abcdefghijklmnopqrstuvwxyz" +"ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	v0=0;
	for(i=0;i<str.length;i++) {
		v1=str.charCodeAt(i);
		v0+=v0+v0^v1;
	}
	var sz=abc.length,v,res="";
	for(i=0;i<5;i++) {
		v1=parseInt(v0/sz);
		v=Math.abs(v0-v1*sz);
		res+=abc[v];
		v0=v1;
	}

	return res;
}

// hash color from a string
function hashColor(name) {
    //if(debug) console.log("> regionHashColor");

	var h=0,h1;
	for(var i=0;i<name.length;i++) {
		h1=name.charCodeAt(i);
		h+=h+h^h1;
	}
    var color = {};

    // add some randomness
    h = Math.sin(h++)*10000;
    h = 0xffffff*(h-Math.floor(h));

    color.red = h&0xff;
    color.green = (h&0xff00)>>8;
    color.blue = (h&0xff0000)>>16;
    
    color.red = parseInt(255*0.6+color.red*0.4);
    color.green = parseInt(255*0.6+color.green*0.4);
    color.blue = parseInt(255*0.6+color.blue*0.4);

	return color;
}