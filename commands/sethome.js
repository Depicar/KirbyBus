const Discord = require('discord.js');
const userData = require('../userData');

module.exports = {
    name: 'sethome',
    description: "sets home location",
    async execute(message, args, busStopIds) {

        //check if valid location, args.length check for when user types just 'sethome'
        if (args.length === 0 || !busStopIds.has(args[0].toLowerCase())) {
            message.channel.send('Invalid bus stop.');
            return;
        }
        message.channel.send(`Your home has been set to ${args[0].toLowerCase()}!`);

        await userData.findOneAndUpdate( 
            {_id: message.author.id} ,
            {$set: {stopData: args[0].toLowerCase()}},
            {upsert: true}
        ).exec();

        return;

    }
}