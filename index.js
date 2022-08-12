const mongoose = require('mongoose');
const userData = require('./userData');
const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const token = process.env.TOKEN;
const key = process.env.KEY;
const pass = process.env.PASS;

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

//command prefix
const prefix = '';

//file reading
const fs = require('fs');
const testSchema = require('./userData');
const { db } = require('./userData');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//bus lines map
const busLines = new Map([
    ["bb", 'BB'],
    ["nw", 'NW'],
    ["cn", 'CN'],
    ["cs", 'CS'],
    ['csx', 'CSX'],
    ['mx', 'MX'],
    ['ne', "NE"],
    ['ws', "WS"],
    ['wx', 'WX']
  ]);

//common stops map 
const busStopIds = new Map([
    //Commuter North (northbound)
    ["crislercenter", "S001"],
    ["transportationgate", "S003"],
    ["facilitiesservices", "S004"],
    ["greene/hoover", "S006"],
    ["intramuralbuildingout", "S007"],
    ["cctcchem", "C250"],
    ["couzenshall", "M305"],
    ["markleyhall", "M313"],
    ["taubmanout", "M315"],
    ["cancercenterout", "M319"],
    ["fullerroard", "M350"],
    ["artarchitecture", "N552"],
    ["cooleylabin", "N404"],
    ["fxbout", "N406"],
    ["fordbuilding", "N432"],
    ["huronhubbardout", "N434"],

    //Northwood
    ["cctcmuseum", "C251"],
    ["hubbardin", "N433"],
    ["bursleyin", "N407"],
    ["bursleyout", "N408"]
]);

//time array for reminder function
var tempTime = ["temp"];


//ready check
client.on('ready', async () => {
    console.log('KirbyBus GOOD');
    await mongoose.connect(pass || '', {
        keepAlive: true,
    })

});

//message comands
client.on('message', async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    
    //takes first message and splits into array
    const args = message.content.slice(prefix.length).split(/ +/);

    //accounts for capital letters in command
    const command = args.shift().toLowerCase();

    //get home location
    if (command === 'gethome') {
        client.commands.get('gethome').execute(message);
    }

    //set home location 
    if(command === 'sethome') {
        client.commands.get('sethome').execute(message, args, busStopIds);
    }

    //get selected bus
    if (command === 'getbus') {
        client.commands.get('getbus').execute(message);
    }

    //set selected bus
    if(command === 'setbus') {
        client.commands.get('setbus').execute(message, args, busLines);
    }

    //specific bus line commands
    if(command === 'bus') {
        client.commands.get('bus').execute(message, args, busStopIds, busLines);
    }

    //start reminders
    if(command === 'startremind') {
        //check bus time every 10 seconds
        timerId = setInterval(function() {client.commands.get('reminder').execute(message, busStopIds, busLines, tempTime) }, 10000);    
    }

    //stop reminders
    if(command === 'stopremind') {
        clearInterval(timerId);
    }

    //test command for mongodb
    // if (command === "lolgoon") {
    //     message.channel.send(`yo you ${message.author.id}`);
    //     setTimeout(async () => {
    //         await userData.findOneAndUpdate( 
    //             {_id: 'goonsa'} ,
    //             {$set: {busData: 'bosing'}},
    //             {upsert: true}
    //         ).exec()}, 1000);

    // }
}
)





client.login(token);