const Discord = require('discord.js');
const userData = require('../userData');

module.exports = {
    name: 'setbus',
    description: "sets selected bus",
    async execute(message, args, busLines) {

        //check if valid location, args.length check for when user types just 'sethome'
        if (args.length === 0 || !busLines.has(args[0].toLowerCase())) {
            message.channel.send('Invalid bus line.');
            return;
        }
        message.channel.send(`Your selected bus has been set to ${args[0].toLowerCase()}!`);

        await userData.findOneAndUpdate( 
                {_id: message.author.id} ,
                {$set: {busData: args[0].toLowerCase()}},
                {upsert: true}
            ).exec();

        return;

    }
}