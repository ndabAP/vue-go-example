import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: []
  },

  mutations: {
    SET_DATA (state, {points, multiplier}) {
      state.data = Array.from({length: points}, () => Math.floor((Math.random() * multiplier) / Math.random()))
    }
  }
})
