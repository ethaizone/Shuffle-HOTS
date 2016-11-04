import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import map from './modules/map'
import room from './modules/room'
import player from './modules/player'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    map,
    room,
    player
  },
  strict: debug
  // plugins: debug ? [createLogger()] : []
})
