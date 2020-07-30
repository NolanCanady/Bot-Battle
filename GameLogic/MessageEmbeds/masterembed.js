var Discord = require('discord.js');

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
