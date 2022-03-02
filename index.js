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

//common stops map 
const busStopIds = new Map([
    ["cctcmuseum", "C251",],
    ["cctcchem", "C250"],
    ["bursleyin", "N407"],
    ["bursleyout", "N408"],
]);

//user current location
var home = 'cctcmuseum';

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

    //specific bus line commands
    if(command === 'bus') {
        client.commands.get('bus').execute(message, args, busStopIds, home);
    }
}
)



client.login(token);