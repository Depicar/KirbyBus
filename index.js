const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const token = process.env.TOKEN;
const key = process.env.KEY;

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

const prefix = '';

//command map
const busNames = new Map([
    ["bbaits", 'BB'],
    ["northwood", 'NW'],
  ]);

//ready check
client.once('ready', () => {
    console.log('KirbyBus GOOD');
});

//message comands
client.on('message', async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).split(/ + /);

    //accounts for capital letters in command
    const command = args.shift().toLowerCase();

    if(command === 'ping') {
        message.channel.send('pong!');
    }

    if(command === 'bbaits' || command === 'northwood') {
        let getBuses = async () => {
            let response = await axios.get(`https://mbus.ltp.umich.edu/bustime/api/v3/getvehicles?key=${key}&rt=${busNames.get(command)}&format=json`);

            //find all vehicles
            let vehicles = response['data']['bustime-response']['vehicle'];
            
            //check if there are no buses running
            if (vehicles === undefined) {
                return 1;
            }

            var size = Object.keys(vehicles).length;

            //log all vehicle locations
            let locations = [];
            for (let i = 0; i < size; i++) {
                locations.push([vehicles[i]['lat'], vehicles[i]['lon']]);
            }

            return locations;

        }
        let buses = await getBuses();

        //outside check if any buses are actually running
        if (buses === 1) {
            message.channel.send(`There aren't any ${command} buses running right now.`);
        }
        else {
            message.channel.send(`Your ${command} buses are at locations: `);
            for (let i = 0; i < buses.length; i++) {
                message.channel.send(`${buses[i]}`);
            }
        }
        
        
    }
}
)



client.login(token);