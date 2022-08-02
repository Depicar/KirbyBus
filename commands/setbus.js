const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const key = process.env.KEY;

module.exports = {
    name: 'setbus',
    description: "sets selected bus",
    execute(message, args, busLines) {

        //check if valid location, args.length check for when user types just 'sethome'
        if (args.length === 0 || !busLines.has(args[0].toLowerCase())) {
            message.channel.send('Invalid bus line.');
            return;
        }
        message.channel.send(`Your selected bus has been set to ${args[0].toLowerCase()}!`);
        return args[0].toLowerCase();;

    }
}