<template>
  <div class="container-fluid map-bg" v-bind:class="mapClass">
    <div class="row">
      <div class="col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-4 inner-container">
        <div class="mapping noselect pointer">
          <h1 id="map">{{ mapName }}</h1>
        </div>
        <div class="player-list">
          <h5 class="heading">
            Lobby
            <span class="pull-right" id="span_player_in_lobby">
              {{ totalPlayerInLobbyText }}
            </span>
          </h5>
          <ul class="list-group" id="ul_lobby_room">
            <li
              class="list-group-item player"
              v-bind:class="lobbyAttrs[index].class"
              v-for="(player, index) in playerInLobby"
              v-on:click.self="movePlayerToPending(player)"
            >
              {{ $store.state.player.list[player].name }}
              <span 
                v-if="$store.state.player.list[player].name === luckyPlayer"
                class="glyphicon glyphicon-star"  
                style="margin-left: 5px; color:orange; text-shadow:none;"
                title="You are lucky player!"
              ></span>
            </li>
          </ul>
          <h5 class="heading">Players

            <span class="pull-right" id="span_player_in_lobby">
              {{ totalPlayerInPendingText }}
            </span>
          </h5>
          <ul class="list-group" id="ul_pending" style="margin-bottom: 0px;">
            <li
              class="list-group-item player"
              v-for="player in playerInPending"
              v-on:click.self="movePlayerToLobby(player)"
              v-touch:press="deletePlayer"
            >{{ $store.state.player.list[player].name }}</li>
          </ul>
          <ul class="list-group">
            <li class="list-group-item add-player" v-on:click.self="openAddPlayer" v-if="! showAddPlayer">
              Add Player ...
            </li>
            <li class="list-group-item add-player-form" v-if="showAddPlayer">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Player Name"
                  v-model="newPlayer"
                  v-on:keydown.enter="addPlayer"
                  ref="addPlayerInput"
                >
                <div class="input-group-btn">
                  <button class="btn btn-default" v-on:click="addPlayer">
                    <span v-if="this.newPlayer">Add</span>
                    <span v-if="!this.newPlayer">Close</span>
                  </button>
                </div>
              </div>
            </li>
          </ul>
          <button
            id="shuffle"
            class="btn btn-primary btn-block btn-lg"
            v-bind:disabled="$store.state.room.lobby.length < 1"
            v-on:click="shuffle"
          >
            Shuffle
          </button>
          <button
            id="swap_to_bot"
            class="btn btn-default btn-block"
            v-bind:disabled="$store.state.player.hasBot === false"
            v-on:click="swapWithBot"
          >
            Swap AI Player
          </button>
          <p class="help-block text-center"><i class="glyphicon glyphicon-info-sign"></i> Press and hold on player name to delete</p>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <button id="reset" class="btn btn-default btn-block" v-on:click="kickAllFromLobby" v-bind:disabled="$store.state.room.lobby.length < 1">Clear Lobby</button>
          </div>
          <div class="col-sm-6">
            <button class="btn btn-default btn-block" v-on:click="shuffleMap">Random Battleground</button>
          </div>
        </div>
      </div> <!-- /.col-sm-8 -->
    </div> <!-- /.row -->
    <div style="width:1px;height: 1px;overflow: hidden;opacity: 0;" id="preloader">
      <span class="glyphicon glyphicon-star"></span>
      <div class="map-bg" v-for="mapClassName in mapPreloader" v-bind:class="mapClassName" ></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { shuffle } from '../libs/thirdParty'
import apiPlayer from '../api/player'
import map from '../data/map'

var data = {
  showAddPlayer: false,
  newPlayer: null,
  lobbyAttrs: [],
  luckyPlayer: null,
  mapPreloader: []
}

export default {
  data () {
    return data
  },
  name: 'app',
  created () {
    var self = this
    apiPlayer.loadData((players) => {
      for (let index in players) {
        self.$store.dispatch('addNewPlayer', players[index])
      }
    }, () => {})

    for (let index in map) {
      this.mapPreloader.push(map[index][2].bg_class)
    }
  },
  computed: {
    totalPlayerInLobbyText () {
      return this.playerInLobby.length + ' ' + (
        this.playerInLobby.length > 1 ? 'Players' : 'Player'
      )
    },
    totalPlayerInPendingText () {
      return this.playerInPending.length + ' ' + (
        this.playerInPending.length > 1 ? 'Players' : 'Player'
      )
    },
    mapClass () {
      return this.$store.state.map.class
    },
    mapName () {
      return this.$store.state.map.text
    },
    ...mapGetters([
      'playerInPending',
      'playerInLobby'
      // ...
    ])
  },
  methods: {
    openAddPlayer () {
      this.showAddPlayer = true
      var self = this
      Vue.nextTick(function () {
        self.$refs.addPlayerInput.focus()
      })
    },
    preFillLobbyAttrs () {
      var forecastPlayer = this.playerInLobby.length + 1
      for (let index = this.lobbyAttrs.length; index < forecastPlayer; index++) {
        this.lobbyAttrs[index] = {
          class: ''
        }
      }
    },
    shuffleMap () {
      this.$store.dispatch('shuffleMap')
    },
    movePlayerToLobby (player) {
      this.preFillLobbyAttrs()
      this.$store.dispatch('movePlayerToLobby', player)
      this.updateLobbyAttr(false)
    },
    movePlayerToPending (player) {
      this.$store.dispatch('movePlayerToPending', player)
      this.updateLobbyAttr(false)
    },
    kickAllFromLobby (player) {
      while (this.$store.state.room.lobby.length) {
        let index = this.$store.state.room.lobby.length - 1
        this.$store.dispatch('movePlayerToPending', this.playerInLobby[index])
      }
      this.updateLobbyAttr(false)
    },
    addPlayer () {
      if (!this.newPlayer) {
        this.showAddPlayer = false
        return
      }

      // protect name for bot
      if (this.newPlayer === 'bot' || this.newPlayer === this.$store.state.player.botName) {
        window.alert('This name reserve for bot. Please use another name.')
        this.newPlayer = ''
        this.openAddPlayer()
        return
      }

      this.$store.dispatch('addNewPlayer', this.newPlayer).then(() => {
        this.showAddPlayer = false
      }).catch(() => {
        window.alert('This player is exists. Please add another name')
      })
      this.newPlayer = ''
    },
    deletePlayer (event) {
      if (window.confirm('Do you want to delete "' + event.target.innerText + '"? ')) {
        this.$store.dispatch('deletePlayer', event.target.innerText)
      }
    },
    updateLobbyAttr (shuffled) {
      if (shuffled === true) {
        let teamLottery = [0, 1]
        shuffle(teamLottery)

        for (let index in this.playerInLobby) {
          if (index < (this.playerInLobby.length / 2)) {
            if (teamLottery[0] === 1) {
              this.lobbyAttrs[index].class = 'team_red'
            } else {
              this.lobbyAttrs[index].class = 'team_blue'
            }
          } else {
            if (teamLottery[0] === 1) {
              this.lobbyAttrs[index].class = 'team_blue'
            } else {
              this.lobbyAttrs[index].class = 'team_red'
            }
          }
        }
      } else {
        for (let index in this.playerInLobby) {
          this.lobbyAttrs[index].class = ''
        }
        this.luckyPlayer = null
      }

      this.lobbyAttrs = this.lobbyAttrs.filter(() => true)
    },
    shuffle () {
      if (this.$store.state.player.hasBot === false && this.playerInLobby.length % 2 !== 0) {
        this.preFillLobbyAttrs()
      }
      this.$store.dispatch('shuffleInLobby')
      this.updateLobbyAttr(true)
      this.shuffleMap()
    },
    swapWithBot () {
      this.luckyPlayer = null

      // Find team that bot belong to....
      var botTeam
      for (let index in this.playerInLobby) {
        if (this.playerInLobby[index] === 'bot') {
          botTeam = (this.playerInLobby.length / 2 > index) ? 'A' : 'B'
        }
      }

      var currentMember = []
      for (let index in this.playerInLobby) {
        currentMember.push(this.playerInLobby[index])
      }

      // get half player
      var migrate
      if (botTeam === 'A') {
        migrate = currentMember.splice(currentMember.length / 2, currentMember.length / 2)
      } else {
        migrate = currentMember.splice(0, currentMember.length / 2)
      }

      // shuffle them and pick one to act as replacement of bot
      shuffle(migrate)
      var hostHuman = migrate.splice(0, 1)
      this.luckyPlayer = hostHuman[0]
      this.$store.dispatch('swapPlayer', {
        room: 'lobby',
        player1: 'bot',
        player2: this.luckyPlayer
      })
    }
  }
}
</script>

<style>
</style>
