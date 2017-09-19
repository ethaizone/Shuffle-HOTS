import * as types from '../mutation-types'

// initial state
const state = {
  class: null,
  text: null
}

// mutations
const mutations = {
  [types.CHANGE_MAP] (state, { className, text }) {
    state.class = className
    state.text = text
  }
}

export default {
  state,
  mutations
}
