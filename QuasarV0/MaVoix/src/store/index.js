import Vue from 'vue'
import Vuex from 'vuex'

import mavoix from './mavoix'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      mavoix
    }
  })

  // enable HMR
  if (process.env.DEV && module.hot) {
    module.hot.accept(['./mavoix'], () => {
      const newMaVoix = require('./mavoix').default
      Store.hotUpdate({ modules: { mavoix: newMaVoix } })
    })
  }

  return Store
}
