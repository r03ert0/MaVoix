<template>
  <q-layout view="hHh lpR fFf" style="background-color:#444">

    <!-- Header -->
    <q-header class="no-shadow">
      <q-toolbar style="background-color:#444">

        <!-- Header Buttons -->
        <q-btn flat label="Tabs" to="tabs" />
        <q-btn flat label="Configure" to="configure" />

        <!-- Header Title -->
        <q-toolbar-title>
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>

        <!-- Header Login -->
        <template v-if="userName">
          <img :src="avatarURL" width=32px class="q-mr-sm"/>
            {{userName}}
            (<a href class="text-white" @click="logout()">logout</a>)
        </template>
        <template v-else>
          <q-btn
            flat
            label="Login with GitHub"
            @click="auth('github')"
          />
        </template>

      </q-toolbar>
    </q-header>

    <!-- Content (Tabs, Configuration) -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { openURL, colors } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      userName: '',
      avatarURL: ''
    }
  },
  computed: {
    tabs () {
      return this.$store.state.tabs
    },
    phrase () {
      return this.$store.state.phrase
    }
  },
  mounted () {
    this.$axios.get('http://localhost:3000/users?name=Luz')
      .then((res) => {
        const sub = res.data[0]
        for (const tab of sub.tabs) {
          tab.tabColor = colors.rgbToHex(colors.hsvToRgb({
            h: 360 * Math.random(),
            s: 40,
            v: 80,
            a: 100
          }))
          tab.isOpen = false
          for (const image of tab.images) {
            image.unavailable = false
            image.hidden = false
          }
        }
        this.$store.commit('mavoix/updateTabs', sub.tabs)
        this.$store.commit('mavoix/updateName', sub.name)
        this.$store.commit('mavoix/updateVoice', sub.voice)
        this.$store.commit('mavoix/updateId', sub.id)
      })

    this.$hello.on('auth.login', (auth) => {
      this.$hello('github').api('me')
        .then((res) => {
          console.log('Result:', res)
          this.userName = res.name
          this.avatarURL = res.avatar_url
          this.blog = res.blog
        })
    })

    const speech = window.speechSynthesis
    speech.onvoiceschanged = () => {
      this.$store.commit('mavoix/updateVoices', speech.getVoices())
    }

    // this.getProfile()
  },
  methods: {
    openURL,
    auth (network) {
      this.$hello(network).login()
        .then((res) => {
          console.log('Back from login:', res)
        }, (e) => {
          console.log('error', e)
        })
    },
    logout () {
      this.$hello('github').logout()
        .then(() => {
          console.log('Signed out')
          this.userName = ''
          this.avatarURL = ''
        }, (e) => {
          console.log('Signed out error:', e.error.message)
        })
    },
    getProfile () {
      this.$hello('github').api('me')
        .then((res) => {
          this.userName = res.name
          this.avatarURL = res.avatar_url
        }, (err) => {
          console.log('Failed to get profile info:', err)
        })
    }
  }
}
</script>

<style>
</style>
