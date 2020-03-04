import Vue from 'vue'
import VueResource from 'vue-resource'
import 'hack'

import store from './store/index'
import App from './App'

Vue.use(VueResource)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
