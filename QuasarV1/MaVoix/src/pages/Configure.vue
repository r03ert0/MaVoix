<template>
  <q-page padding style="background-color:#444">

    <!-- Application-wide configuration -->
    <q-list class="justify-center bg-white q-ma-md q-pa-md">

      Voices
      <div style="max-width:250px">
        <q-select hide-underline v-model="selectedVoice" :options="voices" />
      </div>

      Image size
      <div style="max-width:250px">
        <q-btn-toggle
          v-model="imageSize"
          toggle-color="primary"
          no-caps
          :options="[
            {label: 'Small', value: 0},
            {label: 'Medium', value: 1},
            {label: 'Large', value: 2}
          ]"
        />
      </div>

      <q-btn no-caps icon="save" label="Save" @click="save"/>
      <q-btn no-caps icon="restore" label="Restore" @click="restore"/>

    </q-list>

    <!-- Add new tab -->
    <q-btn no-caps @click="addTab" icon="add" label="Add new tab" class="bg-white" />

    <!-- Tabs -->
    <q-expansion-item
      expand-separator
      v-for="(tab, index) in tabs"
      v-model="tab.isOpen"
      class="q-ma-md"
      :style="{background: tab.tabColor}"
      :key="index"
      :label="`Tab ${index + 1}. ${tab.name}`" >

      <!-- Tab-wide configuration -->
      <template v-slot:header>
        <q-item-section side>
          <div>
            <q-btn flat icon="delete" @click="deleteTab({ tabIndex: index })" />
            <q-chip small class="q-mr-sm">{{tab.name}}</q-chip>
          </div>
        </q-item-section>
        <q-item-section />
      </template>

      <q-btn no-caps icon="edit" label="Edit tab name" class="q-mr-sm bg-white">
        <q-popup-edit v-model="tab.name" title="Update tab name" buttons>
          <q-input v-model="tab.name" />
        </q-popup-edit>
      </q-btn>

      <q-btn no-caps icon="add" @click="addImage({ tabIndex: index })" label="Add image" class="q-mr-sm bg-white" />
      <q-btn no-caps icon="colorize" label="Tab color" class="q-mr-sm bg-white" >
        <q-popup-proxy>
          <q-color
            no-header
            value="tab.tabColor"
            @change="(val) => updateTabColor({ tabIndex: index, tabColor: val })"
          />
        </q-popup-proxy>
      </q-btn>

      <!-- Tab image configuration -->
      <q-list separator class="justify-center bg-white q-ma-sm">
        <q-item dense v-for="(image, index2) in tab.images" :key="index + '-' + index2">
          <q-item-section>
            <q-item-label>
              <q-chip icon="edit" small class="q-mr-sm">
                {{image.name}}
                <q-popup-edit v-model="image.name" buttons>
                  <q-input v-model="image.name" />
                </q-popup-edit>
              </q-chip>
            </q-item-label>
            <q-item-label caption>{{image.url}}</q-item-label>
            <div>
              <q-btn no-caps flat icon="play_arrow" label="Play" class="q-pa-sm"/>
              <q-btn no-caps flat icon="delete" label="Delete" @click="deleteImage({ tabIndex: index, imageIndex: index2 })" class="q-pa-sm" />
              <q-checkbox v-model="image.unavailable" label="Unavailable"></q-checkbox>
              <q-checkbox v-model="image.hidden" label="Hidden"></q-checkbox>
            </div>
          </q-item-section>

          <q-item-section side>
            <q-img :src="image.url" style="width:100px" />
          </q-item-section>
        </q-item>
      </q-list>

    </q-expansion-item>

    <!-- Phrase image configuration -->
    <q-expansion-item
      class="q-ma-md bg-white" >
      <template v-slot:header>
        <q-item-section side>
          <div>
            <q-chip small class="q-mr-sm">Voice bar</q-chip>
          </div>
        </q-item-section>
        <q-item-section />
      </template>
      <!-- Phrase image configuration -->
      <q-list separator class="justify-center bg-white q-ma-sm">
        <q-item dense v-for="(image, index) in phrase" :key="'phrase-' + index">
          <q-item-section>
            <q-item-label>
              <q-chip icon="edit" small class="q-mr-sm">
                {{image.name}}
                <q-popup-edit v-model="image.name" buttons>
                  <q-input v-model="image.name" />
                </q-popup-edit>
              </q-chip>
            </q-item-label>
            <q-item-label caption>{{image.url}}</q-item-label>
            <div>
              <q-btn no-caps flat icon="play_arrow" label="Play" class="q-pa-sm"/>
            </div>
          </q-item-section>

          <q-item-section side>
            <q-img :src="image.url" style="width:100px" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>

    <!-- Image selection modal -->
    <q-dialog v-model="opened">
      <Media v-show="true" @close="close" />
    </q-dialog>

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
      selectedTab: 0,
      imageSize: 1
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

        if (typeof countryData === 'undefined') {
          flag = voice.lang + ' FLAG'
          name = 'UNDEFINED'
        } else {
          flag = countryData.emoji
          name = voice.lang + ' ' + countryData.name
        }
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
      set (voice) {
        console.log('set selected voice to', voice.value)
        this.$store.commit('mavoix/updateSelectedVoice', voice.value)
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
    },
    save () {
      const { id, name, voice, tabs } = JSON.parse(JSON.stringify(this.$store.state.mavoix))
      this.$axios.put(`https://mavoix-connect.herokuapp.com/users/${id}`, { id, name, voice, tabs })
        .then((res) => {
          console.log(res)
          this.$q.notify({ message: 'Successfully saved', color: 'green' })
        })
        .catch((err) => {
          console.log(err)
          this.$q.notify({ message: 'Save failed', color: 'red' })
        })
    },
    restore () {
      console.log('Restore')
      this.$q.notify({ message: 'Not implemented yet', color: 'orange' })
    }
  },
  components: {
    Media
  }
}
</script>

<style>
</style>
