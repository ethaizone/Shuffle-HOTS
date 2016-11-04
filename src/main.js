import Vue from 'vue'
import VueTouch from 'vue-touch'
import App from './components/App'
import store from './store'

Vue.use(VueTouch)

Vue.directive('focus', {
  bind: function () {
    var object = this.el
    Vue.nextTick(() => {
      object.focus()
    })
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  store,
  components: { App }
})
