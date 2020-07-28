var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var creatureLoad = require('./GameLogic/Creatures.json');
var itemlistLoad = require('./GameLogic/ItemList.json');
var fs = require('fs');

const bot = new Discord.Client();
const TOKEN = auth.token;
bot.login(TOKEN);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});


bot.on('message', msg => {
  if(msg.toString().substring(0,1) == '!'){
    var args = msg.toString().substring(1).split(' ');
    var cmd = args[0];
    args = args.splice(1);

    //create new character, args[name]
    if(cmd == 'newCharacter'){
      var newPlayer = {
        id: msg.author.id,
        name: args[0],
        stats:{
          level: '1',
          xp: "0",
          hp: '10',
          att: '2',
          spd: '3',
          def: '5'
        },
        inventory:{
          equipment:{
            helmet: '',
            chest: '',
            legs: '',
            hands: '',
            right: 'fist',
            left: 'fist',
          },
          bag:{}
        },
        activity: {
          "current": "nothing",
          "last": "nothing"
        }
      }
      var data = JSON.stringify(newPlayer);
      fs.writeFileSync("Players/"+msg.author.id+".json", data);
      msg.reply(' welcome, your new character, '+args[0]+', has awaken');
    }

    if(cmd == "myLevel"){
      var playerFile = fs.readFileSync('Players/'+msg.author.id+".json"); //replace with try
      msg.reply(' you are level: '+JSON.parse(playerFile).stats.level);
    }

    if(cmd == "encounter"){
      var playerFile = fs.readFileSync('Players/'+msg.author.id+".json"); //replace with try
      //make sure the player exists, if not message them to create a newcharacter
      var player = JSON.parse(playerFile);

      if(player.activity.current == "nothing"){
        var difficulty = 1; //replace with random later
        var randomCreature = 0; //replace with random later
        var finalCreature = creatureLoad[difficulty][randomCreature];
        var newActivity = { "activity": {
          "current": "encounter",
          "last": player.activity.current,
          "meta": {
            "0": finalCreature
          }
        }};
        player.activity = newActivity;
        player = JSON.stringify(player);
        fs.writeFileSync('Players/'+msg.author.id+".json", player);
        //link images and make the response message fancier
        msg.reply("You have enountered a "+finalCreature.name+"... prepare for battle! (!attack, !eat, !shield, !cancel)") //update this later to be a randomly chosen phrase
      }else{
        msg.reply("it seems you are too preoccupied with: "+player.activity+" to start an encounter right now... use !cancel to cancel your current action.");
      }
    }

    if(cmd == "cancel"){
      var playerFile = fs.readFileSync('Players/'+msg.author.id+".json");
      var player = JSON.parse(playerFile);
      player.activty = {current: "nothing", "last": player.activity};
      player = JSON.stringify(player);
      fs.writeFileSync('Players/'+msg.author.id+".json", player);
      msg.reply("you have cancel your actions.");
    }
  }
  /*  if(msg.content === '!join'){
    var newPlayer = {
      id: msg.author.id,
      name: msg.author.user,
      level: '1',
      stats:{
        hp: '10',
        att: '2',
        spd: '3',
        def: '5'
      },
      inventory:{
        equipment:{
          helmet: '',
          chest: '',
          legs: '',
          hands: '',
          right: 'fist',
          left: 'fist',
        },
        bag:{}
      }
    }
    let data = JSON.stringify(newPlayer)
    msg.reply(' welcome'+msg.author.id);
  }
  if(msg.content === '!level'){
    fs.readFile('Players/'+msg.author.id+".txt", function(err, data){

    });
  }*/
})
