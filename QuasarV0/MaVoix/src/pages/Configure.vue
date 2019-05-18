<template>
  <q-page padding class="bg-dark">

    <!-- Application-wide configuration -->
    <q-list class="justify-center bg-white q-ma-md q-pa-md">
      <q-list-header>
        General Configuration
      </q-list-header>
      Voice
      <q-btn flat no-caps>
        <q-select hide-underline v-model="selectedVoice" :options="voices"
        />
      </q-btn>
      Image size
      <q-btn-group>
        <q-btn label="Small" />
        <q-btn label="Medium" />
        <q-btn label="Large" />
      </q-btn-group>
    </q-list>

    <!-- Add new tab -->
    <q-btn no-caps @click="addTab" icon="add" label="Add new tab" class="bg-white" />

    <!-- Tabs -->
    <q-collapsible
      v-for="(tab, index) in tabs"
      v-model="tab.isOpen"
      class="q-ma-md"
      :style="{background: tab.tabColor}"
      :key="index"
      :label="`Tab ${index + 1}. ${tab.name}`" >

      <!-- Tab-wide configuration -->
      <template slot="header">
        <q-item-side left>
          <q-btn flat icon="delete" @click="deleteTab({ tabIndex: index })" />
        </q-item-side>
        <q-chip icon="edit" small class="q-mr-sm">
          {{tab.name}}
          <q-popup-edit v-model="tab.name" title="Update tab name" buttons>
            <q-input v-model="tab.name" />
          </q-popup-edit>
        </q-chip>
        <q-item-main />
      </template>
      <q-btn no-caps icon="add" @click="addImage({ tabIndex: index })" label="Add image" class="q-mr-sm" />
      <q-btn no-caps>
        <q-color
          modal
          hide-underline
          display-value="Tab color"
          value="tab.tabColor"
          format-model="hex"
          @change="(val) => updateTabColor({ tabIndex: index, tabColor: val })"
        />
      </q-btn>

      <!-- Tab image configuration -->
      <q-list separator class="justify-center bg-white q-ma-sm">
        <q-item dense v-for="(image, index2) in tab.images" :key="index + '-' + index2">
          <q-item-side>
            <q-btn flat icon="delete" @click="deleteImage({ tabIndex: index, imageIndex: index2 })" class="q-pa-sm" />
            <q-btn flat icon="play_arrow"  class="q-pa-sm"/>
          </q-item-side>

          <q-item-main>
            <q-item-tile label>
              <q-chip icon="edit" small class="q-mr-sm">
                {{image.name}}
                <q-popup-edit v-model="image.name" buttons>
                  <q-input v-model="image.name" />
                </q-popup-edit>
              </q-chip>
            </q-item-tile>
            <q-item-tile sublabel>{{image.url}}</q-item-tile>
            <q-item-tile>
              <q-checkbox v-model="image.unavailable" label="Unavailable"></q-checkbox>
              <q-checkbox v-model="image.hidden" label="Hidden"></q-checkbox>
            </q-item-tile>
          </q-item-main>
          <q-item-side right :image="image.url" />
        </q-item>
      </q-list>

    </q-collapsible>

    <!-- Phrase image configuration -->
    <q-collapsible class="q-ma-md bg-white">
      <!-- Header -->
      <template slot="header">
        <q-chip small class="q-mr-sm">
          Phrase
        </q-chip>
        <q-item-main />
      </template>

      <!-- Phrase image configuration -->
      <q-list separator class="justify-center bg-white q-ma-sm">
        <q-item dense v-for="(image, index) in phrase" :key="'phrase-' + index">
          <q-item-side>
            <q-btn flat icon="play_arrow"  class="q-pa-sm"/>
          </q-item-side>

          <q-item-main>
            <q-item-tile label>
              <q-chip icon="edit" small class="q-mr-sm">
                {{image.name}}
                <q-popup-edit v-model="image.name" buttons>
                  <q-input v-model="image.name" />
                </q-popup-edit>
              </q-chip>
            </q-item-tile>
            <q-item-tile sublabel>{{image.url}}</q-item-tile>
          </q-item-main>

          <q-item-side right :image="image.url" />
        </q-item>
      </q-list>
    </q-collapsible>

    <!-- Image selection modal -->
    <q-modal v-model="opened">
      <Media v-show="true" @close="close" />
    </q-modal>

  </q-page>
</template>

<script>
import Media from 'pages/Media.vue'
import { colors } from 'quasar'

export default {
  name: 'Configure',
  data () {
    return {
      opened: false,
      selectedTab: 0
    }
  },
  computed: {
    tabs () {
      return this.$store.state.mavoix.tabs
    },
    phrase () {
      return this.$store.state.mavoix.phrase
    },
    tabColor: {
      get () {
        return this.$store.state.mavoix.tabColor
      },
      set (value) {
        this.$store.commit('mavoix/updateTabColor', value)
      }
    },
    voices () {
      return this.$store.state.mavoix.voices.map((voice) => {
        const country = voice.lang.split('-')[1]
        let countryData = this.$countryFlagEmoji.data[country]
        let flag, name
        console.log(countryData)
        if (typeof countryData === 'undefined') {
          flag = voice.lang + ' FLAG'
          name = 'UNDEFINED'
        } else {
          flag = countryData.emoji
          name = voice.lang + ' ' + countryData.name
        }
        console.log(flag)
        return {
          label: `${flag} ${voice.name} (${name})`,
          value: voice.name
        }
      })
    },
    selectedVoice: {
      get () {
        return this.$store.state.mavoix.selectedVoice
      },
      set (value) {
        console.log('set selected voice to', value)
        this.$store.commit('mavoix/updateSelectedVoice', value)
      }
    }
  },
  mounted () {
    console.log('configure')
    console.log('store tabs:', this.$store.state.mavoix.tabs)
  },
  methods: {
    addTab () {
      console.log('add tab')
      const color = colors.rgbToHex(colors.hsvToRgb({
        h: 360 * Math.random(),
        s: 40,
        v: 80,
        a: 100
      }))

      this.$store.state.mavoix.tabs.push({
        name: 'Untitled',
        tabColor: color,
        images: []
      })
    },
    deleteTab ({ tabIndex }) {
      this.$store.state.mavoix.tabs.splice(tabIndex, 1)
    },
    addImage ({ tabIndex }) {
      this.opened = true
      this.selectedTab = tabIndex
    },
    deleteImage ({ tabIndex, imageIndex }) {
      this.$store.state.mavoix.tabs[tabIndex].images.splice(imageIndex, 1)
    },
    close (msg) {
      switch (msg.result) {
        case 'cancel':
          break
        case 'select':
          const image = msg.image
          image.name = image.url.split('/').pop().split('.')[0]
          image.unavailable = false
          image.hidden = false
          this.$store.state.mavoix.tabs[this.selectedTab].images.push(image)
          break
      }
      this.opened = false
      console.log(msg)
    },
    updateTabColor ({ tabIndex, tabColor }) {
      console.log('update tab color', tabColor, ', tab index', tabIndex)
      this.$store.commit('mavoix/updateTabColor', { tabIndex, tabColor })
    }
  },
  components: {
    Media
  }
}
</script>

<style>
</style>
