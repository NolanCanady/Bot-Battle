var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var creatureLoad = require('./GameLogic/Creatures.json');
var itemlistLoad = require('./GameLogic/ItemList.json');
var masterEmbed = require('./GameLogic/MessageEmbeds/masterembed.js');
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
          "current": "",
          "last": ""
        }
      }
      var data = JSON.stringify(newPlayer);
      fs.writeFileSync("Players/"+msg.author.id+".json", data);
      msg.reply(' welcome, your new character, '+args[0]+', has awaken');
    }

    if(cmd == "characterInfo"){
      var playerFile = fs.readFileSync('Players/'+msg.author.id+".json"); //replace with try
      msg.reply(self(msg.author.id));
    }

    if(cmd == "encounter"){
      var playerFile = fs.readFileSync('Players/'+msg.author.id+".json"); //replace with try
      //make sure the player exists, if not message them to create a newcharacter
      var player = JSON.parse(playerFile);

      if(player.activity.current == ""){
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
        //msg.reply("You have enountered a "+finalCreature.name+"... prepare for battle! (!attack, !eat, !shield, !cancel)") //update this later to be a randomly chosen phrase
        msg.reply("Prepare for your encounter...");
        msg.reply(monster(finalCreature));
      }else{
        msg.reply("it seems you are too preoccupied with: "+player.activity.current+" to start an encounter right now... use !cancel to cancel your current action.");
      }
    }

    if(cmd == "cancel"){
      var playerFile = fs.readFileSync('Players/'+msg.author.id+".json");
      var player = JSON.parse(playerFile);
      player.activity.last = player.activity.current;
      player.activity.current = "";
      fs.writeFileSync('Players/'+msg.author.id+".json",JSON.stringify(player));
      msg.reply("you have cancel your actions.");
    }
  }
})

const monster = function(creature){
  if(creature != null){
    const msg = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(creature.name)
      .setImage(creature.image)
      .addFields(
        { name: 'hp', value: creature.stats.hp, inline: true},
        { name: 'att', value: creature.stats.att, inline: true},
        { name: 'def', value: creature.stats.def, inline: true},
        { name: 'spd', value: creature.stats.spd, inline: true}
      )
      .setFooter('Available actions: !attack - !shield - !item - !run');
    return msg;
  }else{
    return;
  }
}

const self = function(id){
  var player = fs.readFileSync('Players/'+id+".json");
  player = JSON.parse(player);

  const msg = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(player.name)
    .addFields(
      { name: 'hp', value: player.stats.hp, inline: true},
      { name: 'xp', value: player.stats.xp, inline:true},
      { name: '\u200B', value: '\u200B'},
      { name: 'att', value: player.stats.att, inline: true},
      { name: 'def', value: player.stats.def, inline: true},
      { name: 'spd', value: player.stats.spd, inline: true},
    )
    .setFooter('Status: stable - Actions: !inventory !rest !heal !item');
    return msg;
}
