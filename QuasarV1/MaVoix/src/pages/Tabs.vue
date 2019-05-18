<template>
  <q-page style="display:flex;background-color:#444">

    <div style="flex:1;display:flex;flex-direction:column">

      <!-- Tabs -->
      <div style="flex:0 0">
        <q-tabs
          align="left"
          indicator-color="transparent"
          swipeable
          v-model="selectedTab">
          <template v-for="(tab, index) in tabs">
            <q-tab
              :style="{background: tab.tabColor}"
              :count="countItems(index)"
              :name="'tab-' + index"
              :label="tab.name"
              :key="index"
              icon="message"
              @select="selectTab(index)"
            />
          </template>
        </q-tabs>
      </div>

      <!-- Tab Contents -->
      <q-tab-panels v-model="selectedTab" style="flex:1">
        <q-tab-panel
          v-for="(tab, index2) in tabs"
          :style="{ background: tab.tabColor }"
          :name="'tab-' + index2"
          :key="'tab-' + index2">
          <q-scroll-area style="height:100%">
            <div class="q-pa-md row items-start q-gutter-md" >
              <template v-for="(image, index) in tab.images">
                <q-card
                  v-if="image.hidden === false"
                  class="q-ma-sm bg-white"
                  style="width: 150px"
                  @dragstart.native="drag(index2, index, $event)"
                  :draggable="image.unavailable?false:true"
                  :disabled="image.unavailable?true:false"
                  :key="selectedTabIndex + '-' + index" >
                  <q-img
                    style="padding:2px;user-drag: none"
                    :src="image.url" >
                    <template v-if="image.unavailable">
                      <div style="position:absolute;top:5%;left:5%;display:inline-block;width:90%;height:90%;background:red;border-radius:100%">
                      </div>
                    </template>
                  </q-img>
                  <q-card-section>
                      {{image.name}}
                  </q-card-section>
                </q-card>
              </template>
            </div>
          </q-scroll-area>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Voice Bar -->
      <div style="flex:0 220px">
        <div style="min-height:220px"
          :class="{ 'bg-secondary': isDraggingOver, 'bg-dark': !isDraggingOver }"
          @drop="drop($event)"
          @dragover="dragOver($event)"
          @dragleave="dragLeave($event)" >

          <div style="position:absolute;right:0;display:inline-block;width:100px;padding:10px;">
            <q-btn @click="play()" round class="row q-ma-sm bg-white float-right" icon="play_arrow" size="24px" />
            <q-btn @click="clear()" round class="row q-ma-sm bg-white float-right" icon="delete" size="24px" />
          </div>

          <div class="q-pa-md row items-start q-gutter-md">
            <template v-for="(image, index) in phrase">
              <q-card
                draggable
                class="q-ma-sm bg-white"
                style="width: 150px"
                :style="image.style"
                :key="index"
                @dragstart.native="drag(index, $event)" >
                  <q-img
                    style="padding:2px;user-drag:none"
                    :src="image.url" >
                  </q-img>
                  <q-card-section>
                      {{image.name}}
                  </q-card-section>
              </q-card>
            </template>
          </div>
        </div>
      </div>

    </div>

  </q-page>
</template>

<script>
export default {
  name: 'Tabs',
  data () {
    return {
      isDraggingOver: false,
      draggingTabIndex: 0,
      draggingImageIndex: 0,
      selectedTabIndex: 0
    }
  },
  computed: {
    tabs () {
      return this.$store.state.mavoix.tabs
    },
    phrase () {
      return this.$store.state.mavoix.phrase
    },
    selectedTab: {
      get () {
        return this.$store.state.mavoix.selectedTab
      },
      set (value) {
        this.$store.commit('mavoix/updateSelectedTab', value)
      }
    }
  },
  mounted () {
    this.$axios.get('http://localhost:3000/users?name=Luz')
      .then((res) => {
        const sub = res.data[0]
        this.name = sub.name
        this.language = sub.language
      })
  },
  methods: {
    countItems (index) {
      return this.tabs[index].images.length
    },
    drag (tabIndex, imageIndex, ev) {
      this.draggingTabIndex = tabIndex
      this.draggingImageIndex = imageIndex
    },
    dragOver (ev) {
      ev.preventDefault()
      this.isDraggingOver = true
    },
    dragLeave (ev) {
      ev.preventDefault()
      this.isDraggingOver = false
    },
    drop (ev) {
      ev.preventDefault()
      const tabIndex = this.draggingTabIndex
      const imageIndex = this.draggingImageIndex
      let img = this.tabs[tabIndex].images[imageIndex]
      img.origin = { tabIndex: tabIndex, imageIndex: imageIndex }
      img.style = 'transform: scale(1)'
      this.phrase.push(img)
      this.tabs[tabIndex].images.splice(imageIndex, 1)
      this.isDraggingOver = false

      // $.ajax({
      //   url:dbroot,
      //   type:"POST",
      //   data:{
      //     "action":"save",
      //     "origin":JSON.stringify("myvoice-dev"),
      //     "key":"action",
      //     "value":JSON.stringify(action)
      //   },
      //   success: function(data) {
      //     console.log("< interactSave: logged action "+action);
      //   },
      //   error: function(jqXHR, textStatus, errorThrown) {
      //     console.log("< interactSave: ERROR: "+textStatus+" "+errorThrown);
      //   }
      // });
    },
    play () {
      const selectedVoice = this.$store.state.mavoix.selectedVoice
      const phrase = this.phrase
      const amelie = this.$store.state.mavoix.voices.filter((v) => { return v.name === selectedVoice })[0]
      const f = function (val) {
        const tmp = phrase[val]
        tmp.style = 'transform: scale(1.1)'
        phrase.splice(val, 1, tmp)

        const utterance = new SpeechSynthesisUtterance(phrase[val].name)
        utterance.voice = amelie
        window.speechSynthesis.speak(utterance)
        val++
        setTimeout(() => {
          const tmp2 = phrase[val - 1]
          tmp2.style = 'transform: scale(1)'
          phrase.splice(val - 1, 1, tmp2)
          if (val < phrase.length) { f(val) }
        }, 500)
      }
      f(0)
    },
    clear () {
      for (let i = this.phrase.length - 1; i >= 0; i--) {
        const { tabIndex, imageIndex } = this.phrase[i].origin
        delete this.phrase[i].origin
        this.tabs[tabIndex].images.splice(imageIndex, 0, this.phrase[i])
      }
      this.phrase.length = 0
    },
    selectTab (index) {
      this.selectedTabIndex = index
    }
  }
}
</script>

<style>
</style>
