const Discord = require('discord.js');
const userData = require('../userData');

module.exports = {
    name: 'gethome',
    description: "returns home location",
    async execute(message) {

        var line = await userData.find( 
            {_id: message.author.id} ,
        );
        
        //add error message when none
        if (line.length === 0) {
            message.channel.send("Please set a home.");
            return;
        }
        message.channel.send(`Your home is currently at ${line}!`);
        
        return;

    }
}   