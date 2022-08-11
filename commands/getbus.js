const Discord = require('discord.js');
const userData = require('../userData');

module.exports = {
    name: 'getbus',
    description: "returns selected bus",
    async execute(message) {

        var line = await userData.find( 
            {_id: message.author.id} ,
        );
                
        try {
            line[0].busData;
        }
        catch {
            message.channel.send("Please set a bus line.");
            return;
        }

        if (line[0].busData === undefined) {
            message.channel.send("Please set a bus line.");
            return;  
        }

        message.channel.send(`Your bus line is currently ${line[0].busData}!`);

        return;

    }
}   