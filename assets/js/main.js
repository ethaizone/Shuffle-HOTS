window.$ = require("./../vendors/jquery/jquery-1.11.3.min");
var {
  WeightedList,
  shuffle,
  bake_cookie,
  read_cookie,
  delete_cookie,
  swapArrayElements
} = require("./libs/third_party");
// This line require jQuery so....
var listenHoldAndClick = require("./libs/listen_hold_and_click")($);
var maps = require("./data/maps");
var store = require("./libs/localStorage");
store.key = "shuffle_hots";

$(window).load(function(){

  // la blaaaa

  var all_players = [
      'Player 1',
      'Player 2'
  ];

  var lastClassMapBG;

  var lobby_room = [];
  var pending = [];

  // var bot = "-- AI Elite --";

var bot = {
  name: "-- AI Elite --",
  isBot: function(player) {
    if (player.indexOf(this.name) == -1) {
      return false;
    }
    return true;
  },

};

  function resetPlayer() {
    $("#map").text("Welcome to the Nexus");
    lobby_room = [];
    pending = all_players.slice();
    renderPlayers();
  }

  function saveData() {
    var save_pending = [];
    $.each(pending, function( index, value ) {
      if (!bot.isBot(value)) {
        save_pending.push(value);
      }
    });
    var save_lobby_room = [];
    $.each(lobby_room, function( index, value ) {
      if (!bot.isBot(value)) {
        save_lobby_room.push(value);
      }
    });
    // console.log(save_pending, save_lobby_room);
    bake_cookie('dont_delete_hots_pending', save_pending);
    bake_cookie('dont_delete_hots_lobby_room', save_lobby_room);
  }

  function restoreData() {
    save_pending = read_cookie('dont_delete_hots_pending');
    save_lobby_room = read_cookie('dont_delete_hots_lobby_room');
    if($.isArray(save_pending) && $.isArray(save_lobby_room)) {
      all_players = [];
      pending = [];
      $.each(save_pending, function( index, value ) {
        if (!bot.isBot(value)) {
          pending.push(value);
          all_players.push(value);
        }
      });

      lobby_room = [];
      $.each(save_lobby_room, function( index, value ) {
        if (!bot.isBot(value)) {
          lobby_room.push(value);
          all_players.push(value);
        }
      });
      renderPlayers();
      return true;
    }
    return false;
  }

  function renderPlayers(luckyPlayer, isAddNewPlayer) {

    var li_empty = $('<li class="list-group-item player-empty"/>').text('Empty');

    $("#ul_pending").empty();
    $.each(pending, function( index, value ) {
      var item = $('<li class="list-group-item player"/>').text(value);
      if (value == luckyPlayer)
      {
        var $star = $('<span class="glyphicon glyphicon-star" aria-hidden="true" style="margin-left: 5px; color:orange; text-shadow:none;"></span>');

        item.append($star);
        item.attr('title', 'You are lucky player!');
      }
      $("#ul_pending").append(item);
    });
    if (pending.length < 1) {
      $("#ul_pending").append(li_empty);
    }

    $("#ul_lobby_room").empty();
    $.each(lobby_room, function( index, value ) {
      var item = $('<li class="list-group-item player"/>').text(value);
      if (value == luckyPlayer)
      {
        var $star = $('<span class="glyphicon glyphicon-star" aria-hidden="true" style="margin-left: 5px; color:orange; text-shadow:none;"></span>');

        item.append($star);
        item.attr('title', 'You are lucky player!');
      }
      $("#ul_lobby_room").append(item);
    });
    if (lobby_room.length < 1) {
      $("#ul_lobby_room").append(li_empty);
      $('#shuffle').attr("disabled", true);
    } else {
      $('#shuffle').attr("disabled", false);
    }

    // create text tell players in lobby
    var player_in_lobby = lobby_room.length+" ";
    if (lobby_room.length > 1) {
      player_in_lobby = player_in_lobby+" Players";
    } else {
      player_in_lobby = player_in_lobby+" Player";
    }

    $("#span_player_in_lobby").text(player_in_lobby);

    if (! isAddNewPlayer)
    {
      // reset form add player
      $(".add-player-form").addClass("hide").prev().removeClass('hide');
    }
    saveData();
  }

  function teamHighlight() {
    var team_lottery = [0, 1];
    shuffle(team_lottery);

    $("#ul_lobby_room .player").each(function( index, item ) {
      var $item = $(item);
      if (index < (lobby_room.length/2)) {
        if (team_lottery[0] == 1) {
          $item.addClass("team_red");
        } else {
          $item.addClass("team_blue");
        }
      } else {
        if (team_lottery[0] == 1) {
          $item.addClass("team_blue");
        } else {
          $item.addClass("team_red");
        }

      }

    });
  }

  function randomMap() {
    var mapList = new WeightedList(maps);
    var picked = mapList.peek();
    console.log(picked);
    $("#map").text(picked[0].key);
    if (lastClassMapBG)
    {
      $("#map_background").removeClass(lastClassMapBG);
    }
    lastClassMapBG = picked[0].data.bg_class;
    $("#map_background").addClass(lastClassMapBG);
  }

  if (! restoreData()) {
    resetPlayer();
  }

  listenHoldAndClick("#ul_lobby_room", ".player", function($this, isHold){
    var change = false;
    var player = $this.text();
    if (isHold) {
      if (confirm("คุณต้องการลบ '"+player+"' หรือไม่?")){
        lobby_room.remove(player);
        change = true;
      }
    } else {
      lobby_room.remove(player);
      if(! bot.isBot(player)) {
        pending.push(player);
      }
      change = true;
    }

    if (change)
    {
      renderPlayers();
      // console.log('render!');
    }
  });

  // function bot.isBot(player) {
  //   if (player.indexOf(bot) == -1) {
  //     return false;
  //   }
  //   return true;
  // }

  function addNewPlayer(player)
  {
    if(! bot.isBot(player)) {
      pending.push(player);
      all_players.push(player);
      return true;
    }
    return false;
  }

  $("#btn_add_player").on('click', function(){
    var $input = $("#input_new_player");
    var player = $input.val();
    if (! player || player.length == 0) {
      alert("กรุณาใส่ชื่อผู้เล่นด้วย");
      return;
    }
    var exists = false;
    $.each(all_players, function(i, v) {
      if (player == v) {
        exists = true;
      }
    });
    if (exists && !bot.isBot(player)) {
      alert("ชื่อผู้เล่นนี้มีอยู่แล้ว");
      return;
    }
    if (!addNewPlayer(player)) {
      alert("คุณไม่สามารถเพิ่มบอทเป็นผู้เล่นได้");
    }
    renderPlayers('', true);
    $input.val("");
  });

  $("#input_new_player").on('keydown', function(e){
    if (e.keyCode == 13) {
      $("#btn_add_player").trigger('click');
      $("#input_new_player").focus();
    }
  });


  listenHoldAndClick("#ul_pending", '.player', function($this, isHold){
    var change = false;
    var player = $this.text();
    if (isHold) {
      if (confirm("คุณต้องการลบ '"+player+"' หรือไม่?")){
        pending.remove(player);
        change = true;
      }
    } else {
      if (lobby_room.length >= 10) {
        alert("คุณไม่สามารถเพิ่มผู้เล่นได้มากกว่านี้");
        return;
      }
      pending.remove(player);
      lobby_room.push(player);
      change = true;
    }

    if (change)
    {
      renderPlayers();
      // console.log('render!');
    }
  });

  $("#random_map").on('click', function(){
    randomMap();
  });

  $("#reset").on('click', function(){
    resetPlayer();
    $('#swap_to_bot').attr('disabled', true);
  });

  $("#shuffle").on('click',function(){
    if (lobby_room.length%2 != 0) {
      var hasBot = false;
      $.each(lobby_room, function( index, player ) {
        if (player == bot.name) {
          lobby_room.remove(player);
          hasBot = true;
        }
      });

      if (hasBot == false) {
        var notice = "พวกเรามีคนเล่นทั้งหมดจำนวน "
            +lobby_room.length
            +" คน\n"
            +"ถ้าสุ่มแล้วจะมีบอทแถมมาด้วยนะ จะสุ่มต่อไหม?";
        if(! confirm(notice)) {
          alert("เอาใครสักคนออกให้ลงเลขคู่เถอะ");
          return;
        }
      }
    }
    shuffle(lobby_room);
    if (lobby_room.length%2 != 0) {
      lobby_room.push(bot.name);
      $('#swap_to_bot').attr('disabled', false);
    }
    renderPlayers();

    teamHighlight();
    randomMap();

  });

  $("#swap_to_bot").on('click', function(e){
    // check bot number bot must have 1 so I will alert error
    var botTotal = 0;
    $.each(lobby_room, function( index, value ) {
      if (value == bot.name) {
        botTotal++;
      }
    });
    if (botTotal > 1) {
      alert("มีบอทมากกว่า 1 ตัว ไม่สามารถสลับทีมได้ กรุณาเอาบอทออกให้เหลือ 1 ด้วย");
      return false;
    }

    if (botTotal < 1) {
      // lobby_room.push(bot.name);
      // shuffle(lobby_room);
      // renderPlayers();
      alert("ต้องมีบอท 1 ตัว ไม่สามารถสลับทีมได้");
      return false;
    }

    if (lobby_room.length%2 != 0) {
      alert("สมาชิกทีมไม่เท่ากัน ไม่สามารถสลับทีมได้");
      return false;
    }

    // find which team that bot is in.
    var botTeam;
    $.each(lobby_room, function( index, value ) {
      if (value == bot.name) {
        if (lobby_room.length/2 > index)
        {
          botTeam = 'A';
        }
        else
        {
          botTeam = 'B';
        }
      }
    });
    // get team member that don't be with bot and remove 1 member out for act as host same as bot
    var lucky;
    var currentMember = [];
    $.each(lobby_room, function( index, value ) {
      currentMember.push(value);
    });
    var migrate;
    if (botTeam == 'A')
    {
      migrate = currentMember.splice(currentMember.length/2, currentMember.length/2);
    }
    else
    {
      migrate = currentMember.splice(0, currentMember.length/2);
    }
    shuffle(migrate);
    hostHuman = migrate.splice(0, 1);

    // swap member of two team
    $.each(migrate, function( order, value ) {
      var foundMigrate;
      $.each(lobby_room, function(i, v ) {
        if (v == value) {
          foundMigrate = i;
        }
      });
      var foundReplacement;
      $.each(lobby_room, function(i, v ) {
        var start;
        if (botTeam == 'A')
        {
          start = 0;
        }
        else
        {
          start = lobby_room.length/2;
        }
        // console.log('start', start, botTeam);
        if (i < start)
        {
          return;
        }

        if (v == bot.name) {
          order = order+1;
          return;
        }
        if ((i-start) == order) {
          foundReplacement = i;
          return;
        }
      });
      console.log(foundMigrate, foundReplacement);
      swapArrayElements(lobby_room, foundMigrate, foundReplacement);
    });
    renderPlayers(hostHuman[0]);
    teamHighlight();
    randomMap();
    // console.log(migrate);
  });
  setTimeout(function(){
    var preloader = $("#preloader");
    $.each(maps, function(i, v) {
      var div = $("<div class='map-bg "+v[2].bg_class+"'></div>");
      preloader.append(div);
    });
    preloader.show();
  }, 300);

});

