const Discord = require('discord.js');
const userData = require('../userData');

module.exports = {
    name: 'getbus',
    description: "returns selected bus",
    async execute(message) {

        var line = await userData.find( 
            {_id: message.author.id} ,
        );
        
        if (line.length === 0) {
            message.channel.send("Please set a bus line.");
            return;
        }

        message.channel.send(`Your bus line is currently ${line}!`);

        return;

    }
}   