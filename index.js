const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const token = process.env.TOKEN;

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

const prefix = '';


client.once('ready', () => {
    console.log('MuscleKirby GOOD');
});

client.on('message', async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    
    //not sure what this does i found it somewhere
    const args = message.content.slice(prefix.length).split(/ + /);

    //accounts for capital letters in command
    const command = args.shift().toLowerCase();

    if(command === 'lol') {
        message.channel.send('you\'re lol');
    }

    if(command === 'bbaits') {
        let getBus = async () => {
            let response = await axios.get('https://mbus.ltp.umich.edu/bustime/api/v3/getvehicles?key=jbxA7tRCrrgLFKCHiTy3gykMJ&rt=BB&format=json');

            //find all vehicles
            let vehicles = response['data']['bustime-response']['vehicle'];
            var size = Object.keys(vehicles).length;
            //console.log(size);

            //log all vehicle locations
            let location = [[vehicles[0]['lat'], vehicles[0]['lon']]];
            for (let i = 1; i < size; i++) {
                location.push([vehicles[i]['lat'], vehicles[i]['lon']]);
            }

            //console.log(location);
            return location;

        }
        //send message, not sure if await is needed here
        let buses = await getBus();

        //check if any buses are actually running
        if (buses.length === 0) {
            message.channel.send("There aren't any buses running right now.");
        }
        else {
            message.channel.send("Your Bursley Baits buses are at locations: ");
            for (let i = 0; i < buses.length; i++) {
                message.channel.send(`${buses[i]}`);
            }
        }
        
        
    }
//same code as above, trying to figure out how to do it based on whatever the input is so i don't have to copy
    if(command === 'northwood') {
        let getBus = async () => {
            let response = await axios.get('https://mbus.ltp.umich.edu/bustime/api/v3/getvehicles?key=jbxA7tRCrrgLFKCHiTy3gykMJ&rt=NW&format=json');

            //find all vehicles
            let vehicles = response['data']['bustime-response']['vehicle'];
            var size = Object.keys(vehicles).length;
            //console.log(size);

            //log all vehicle locations
            let location = [[vehicles[0]['lat'], vehicles[0]['lon']]];
            for (let i = 1; i < size; i++) {
                location.push([vehicles[i]['lat'], vehicles[i]['lon']]);
            }

            //console.log(location);
            return location;

        }
        //send message, not sure if await is needed here
        let buses = await getBus();

        //check if any buses are actually running
        if (buses.length === 0) {
            message.channel.send("There aren't any buses running right now.");
        }
        else {
            message.channel.send("Your Northwood buses are at locations: ");
            for (let i = 0; i < buses.length; i++) {
                message.channel.send(`${buses[i]}`);
            }
        }
        
    }
}
)



client.login(token);