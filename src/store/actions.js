import * as types from './mutation-types'

import map from '../data/map'
import WeightedList from '../libs/WeightedList'
import apiPlayer from '../api/player'

export const shuffleMap = ({ commit }) => {
  var mapList = new WeightedList(map)
  var picked = mapList.peek()
  commit(types.CHANGE_MAP, {
    className: picked[0].data.bg_class,
    text: picked[0].key
  })
}

export const addNewPlayer = ({ commit, state }, player) => {
  return new Promise((resolve, reject) => {
    for (var index in state.player.list) {
      let p = state.player.list[index]
      if (p.name === player) {
        return reject()
      }
    }
    commit(types.CREATE_PLAYER, {
      name: player
    })
    commit(types.ADD_PLAYER_TO_ROOM, {
      name: player,
      room: 'pending'
    })

    // save player
    var playerData = []
    for (let index in state.player.list) {
      let p = state.player.list[index]
      if (p.data.type === 'human') {
        playerData.push(p.name)
      }
    }
    apiPlayer.saveData(playerData, () => {}, () => {})

    return resolve()
  })
}

export const deletePlayer = ({ commit, state }, player) => {
  return new Promise((resolve, reject) => {
    for (var index in state.room.lobby) {
      let p = state.player.list[index]
      if (p.name === player) {
        return reject()
      }
    }
    commit(types.REMOVE_PLAYER_FROM_ROOM, {
      name: player,
      room: 'pending'
    })
    commit(types.DELETE_PLAYER, {
      name: player
    })
    return resolve()
  })
}

export const addBotToLobby = ({ commit, state }) => {
  return new Promise((resolve, reject) => {
    if (state.player.hasBot) {
      return reject()
    }
    commit(types.CREATE_BOT)
    commit(types.ADD_PLAYER_TO_ROOM, {
      name: 'bot',
      room: 'lobby'
    })
    return resolve()
  })
}

export const removeBotFromLobby = ({ commit, state }) => {
  return new Promise((resolve, reject) => {
    if (state.player.hasBot === false) {
      return reject()
    }
    commit(types.REMOVE_PLAYER_FROM_ROOM, {
      name: 'bot',
      room: 'lobby'
    })
    commit(types.DELETE_BOT)
    return resolve()
  })
}

export const movePlayerToLobby = ({ commit, state, dispatch }, player) => {
  if (state.player.hasBot && (state.room.lobby.length + 1) % 2 !== 0) {
    dispatch('removeBotFromLobby')
  }
  commit(types.REMOVE_PLAYER_FROM_ROOM, {
    name: player,
    room: 'pending'
  })
  commit(types.ADD_PLAYER_TO_ROOM, {
    name: player,
    room: 'lobby'
  })
}

export const movePlayerToPending = ({ commit, state, dispatch }, player) => {
  if (state.player.hasBot && (state.room.lobby.length + 1) % 2 !== 0) {
    dispatch('removeBotFromLobby')
  }
  commit(types.REMOVE_PLAYER_FROM_ROOM, {
    name: player,
    room: 'lobby'
  })
  if (player === 'bot') {
    commit(types.DELETE_BOT)
  } else {
    commit(types.ADD_PLAYER_TO_ROOM, {
      name: player,
      room: 'pending'
    })
  }
}

export const shuffleInLobby = ({ commit, state, dispatch }, player) => {
  if (state.room.lobby.length % 2 !== 0) {
    if (state.player.hasBot === false) {
      dispatch('addBotToLobby')
    } else {
      dispatch('removeBotFromLobby')
    }
  }
  commit(types.SHUFFLE_PLAYER, {
    room: 'lobby'
  })
}

export const swapPlayer = ({ commit, state, dispatch }, payload) => {
  commit(types.SWAP_PLAYER, payload)
}
