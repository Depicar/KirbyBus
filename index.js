const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const token = process.env.TOKEN;
const key = process.env.KEY;

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

//command prefix
const prefix = '';

//file reading
const fs = require('fs');
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

//user current location
var home = '';
//user current selected bus
var selectedBus = '';

//ready check
client.once('ready', () => {
    console.log('KirbyBus GOOD');
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
        message.channel.send(`Your home is currently at ${home}!`);
    }

    //set home location 
    if(command === 'sethome') {
        home = client.commands.get('sethome').execute(message, args, busStopIds);
    }

    if (command === 'getbus') {
        message.channel.send(`Your selected bus is currently ${selectedBus}!`);
    }

    //set selected bus
    if(command === 'setbus') {
        selectedBus = client.commands.get('setbus').execute(message, args, busLines);
    }

    //specific bus line commands
    if(command === 'bus') {
        client.commands.get('bus').execute(message, args, busStopIds, home, selectedBus);
    }

    //start reminders
    if(command === 'startremind') {
        //check bus time every 10 seconds
        timerId = setInterval(function() {client.commands.get('reminder').execute(message, busStopIds, busLines, home, selectedBus) }, 10000);    
    }

    //stop reminders
    if(command === 'stopremind') {
        clearInterval(timerId);
    }
}
)





client.login(token);