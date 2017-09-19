import Vue from 'vue'
import VueTouch from 'vue-touch'
import App from './components/App'
import store from './store'

Vue.use(VueTouch)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  store,
  components: { App }
})
