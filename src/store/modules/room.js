import * as types from '../mutation-types'
import { shuffle, swapArrayElements } from '../../libs/thirdParty'

// initial state
const state = {
  lobby: [],
  pending: []
}

// mutations
const mutations = {
  [types.ADD_PLAYER_TO_ROOM] (state, { room, name }) {
    state[room].push(name)
  },
  [types.REMOVE_PLAYER_FROM_ROOM] (state, { room, name }) {
    for (var index in state[room]) {
      var player = state[room][index]
      if (player === name) {
        state[room].splice(index, 1)
      }
    }
  },
  [types.SHUFFLE_PLAYER] (state, { room }) {
    shuffle(state[room])
    state[room] = state[room].filter(() => true)
  },
  [types.SWAP_PLAYER] (state, { room, player1, player2 }) {
    var player1Index
    var player2Index
    for (let index in state[room]) {
      if (state[room][index] === player1) {
        player1Index = index
      }
      if (state[room][index] === player2) {
        player2Index = index
      }
    }
    console.log(player1Index, player2Index, player1, player2)
    swapArrayElements(state[room], player1Index, player2Index)
    state[room] = state[room].filter(() => true)
  }

}

export default {
  state,
  mutations
}
