const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const key = process.env.KEY;

module.exports = {
    name: 'sethome',
    description: "sets home location",
    execute(message, args, busStopIds) {

        //check if valid location, args.length check for when user types just 'sethome'
        if (args.length === 0 || !busStopIds.has(args[0].toLowerCase())) {
            message.channel.send('Invalid bus stop.');
            return;
        }
        message.channel.send(`Your home has been set to ${args[0].toLowerCase()}!`);
        return args[0].toLowerCase();;

    }
}