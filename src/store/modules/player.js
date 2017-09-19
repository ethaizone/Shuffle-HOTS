import * as types from '../mutation-types'

// initial state
const state = {
  list: {},
  hasBot: false,
  botName: '-- AI Elite --'
}

// mutations
const mutations = {
  [types.CREATE_PLAYER] (state, { name }) {
    state.list[name] = {
      name: name,
      data: {
        type: 'human'
      }
    }
  },
  [types.UDPATE_PLAYER] (state, { name, data }) {
    for (var index in state.list) {
      var player = state.list[index]
      if (player.name === name) {
        player.data = data
      }
    }
  },
  [types.DELETE_PLAYER] (state, { name }) {
    for (var index in state.list) {
      var player = state.list[index]
      if (player.name === name) {
        delete state.list[name]
      }
    }
  },
  [types.CREATE_BOT] (state) {
    state.list.bot = {
      name: state.botName,
      data: {
        type: 'bot'
      }
    }
    state.hasBot = true
  },
  [types.DELETE_BOT] (state) {
    delete state.list.bot
    state.hasBot = false
  }
}

export default {
  state,
  mutations
}
