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

//bus lines map (might be able to move to separate file)
const busLines = new Map([
    ["bbaits", 'BB'],
    ["northwood", 'NW'],
  ]);

//common stops map (might be able to move to separate file)
const busStops = new Map([
    ["cctc", [42.278176000001, -83.735083999999]],
    ["bursley", [42.294595999999, -83.72071]],
    ["bursley outbound", [42.294697000001, -83.721364]],
]);

//user current location
var home = 'cctc';


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

    //set home location 
    if(command === 'sethome') {
        //check if valid location, args.length check for when user types just 'sethome'
        if (args.length === 0 || !busStops.has(args[0].toLowerCase())) {
            message.channel.send('Invalid bus stop.');
            return;
        }

        home = args[0].toLowerCase();
        message.channel.send(`Your home has been set to ${home}!`);
        return;
    }


    if(command === 'bus') {
        //check if valid bus line, args.length check for when user types just 'bus'
        if (args.length === 0 || !busLines.has(args[0].toLowerCase())) {
            message.channel.send('Invalid bus line.');
            return;
        }   

        var busLine = args[0].toLowerCase();

        //TODO: implement prediction function
        if (args[1] && args[1] == 'time') {

            return;
        }

        //get bus locations
        let getBuses = async () => {
            let response = await axios.get(`https://mbus.ltp.umich.edu/bustime/api/v3/getvehicles?key=${key}&rt=${busLines.get(busLine)}&format=json`);

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
            message.channel.send(`There aren't any ${busLines.get(busLine)} buses running right now.`);
        }
        else {
            message.channel.send(`Your ${busLines.get(busLine)} buses are at locations: `);
            for (let i = 0; i < buses.length; i++) {
                message.channel.send(`${buses[i]}`);
            }
        }
        
        
    }
}
)



client.login(token);