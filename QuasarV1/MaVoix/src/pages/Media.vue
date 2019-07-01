<template>
  <div class="bg-white" style="display:flex;flex-direction:column;width:100%;height:100%">

    <div style="flex:0 0 50px">
      <q-toolbar>
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
    </div>

    <div style="flex:0 0 50px">
      <div style="margin-left:10%;width:80%">
        <span>Search images</span>
        <q-input v-model="filter" @keyup.enter="filterItems" />
      </div>
    </div>

    <div style="flex:1">
      <q-infinite-scroll @load="loadMore" ref="infiniteScroll">
        <div v-for="(item, index) in items" class="caption" :key="index" style="display:inline-block;padding:10px">
          <q-card inline style="width: 200px" class="bg-white">
            <q-img style="padding:20px" :src="item.url" />
            <q-card-section>
              {{item.name}}
              <!-- <q-rating slot="subtitle" :max="5"></q-rating> -->
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-btn flat icon="add" @click="addImage(index)"></q-btn>
              <q-btn flat icon="info"></q-btn>
              <q-btn flat icon="share"></q-btn>
              <q-btn flat icon="visibility"></q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <q-spinner-dots slot="message" :size="40"></q-spinner-dots>
      </q-infinite-scroll>
    </div>

  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'Media',
  data () {
    return {
      items: [],
      terms: '',
      filter: ''
    }
  },
  methods: {
    loadMore: function (index, done) {
      console.log('Calling loadMore', index)
      this.$axios.get(`https://mavoix-connect.herokuapp.com/files?q=${this.filter}&_page=${index}`)
        .then((res) => {
          if (res.data.length < 10) {
            this.$refs.infiniteScroll.stop()
          }
          console.log('Loading', res.data)
          const newItems = res.data.map((ob) => {
            const imgPath = ob.links.download
            const imgName = ob.filename
            return { url: imgPath, name: imgName }
          })
          this.items = this.items.concat(newItems)
          done()
        })
        .catch((e) => done(true))
    },
    filterItems: function () {
      console.log('Filtering', this.filter)
      this.items.length = 0
      this.$refs.infiniteScroll.reset()
      this.$refs.infiniteScroll.resume()
      this.$refs.infiniteScroll.trigger()
    },
    addImage: function (index) {
      this.$emit('close', { result: 'select', image: this.items[index] })
    },
    close: function () {
      this.$emit('close', { result: 'cancel' })
    }
  }
}

</script>
