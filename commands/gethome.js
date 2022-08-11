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
        try {
            line[0].stopData;
        }
        catch {
            message.channel.send("Please set a home.");
            return;
        }

        if (line[0].stopData === undefined) {
            message.channel.send("Please set a home.");
            return;  
        }
        
        message.channel.send(`Your home is currently at ${line[0].stopData}!`);
        
        return;

    }
}   