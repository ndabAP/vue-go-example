import Vue from 'vue'
import VueResource from 'vue-resource'
import store from './store/index'
import App from './App'
import router from './router'
import 'hack'

Vue.use(VueResource)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
