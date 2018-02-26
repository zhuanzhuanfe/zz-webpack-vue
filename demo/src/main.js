import Vue from 'vue'
import App from './App'

import router from './router'

import store from './store'


// 业务代码
window.vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
