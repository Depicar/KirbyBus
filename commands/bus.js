const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const key = process.env.KEY;

//bus lines map (might be able to move to separate file)
const busLines = new Map([
    ["bbaits", 'BB'],
    ["northwood", 'NW'],
    ["commuternorth", 'CN'],
  ]);

module.exports = {
    name: 'bus',
    description: "finds bus locations/predicts bus time based on home",
    async execute(message, args, busStopIds, location) {

        //check if valid bus line, args.length check for when user types just 'bus'
        if (args.length === 0 || !busLines.has(args[0].toLowerCase())) {
            message.channel.send('Invalid bus line.');
            return;
        }   

        var inputBusLine = args[0].toLowerCase();

        //predicts how long it takes for closest bus to get to home
        if (args[1] && args[1].toLowerCase() === 'time') {

            let getPrediction = async () => {
                let response = await axios.get(`https://mbus.ltp.umich.edu/bustime/api/v3/getpredictions?key=${key}&rt=${busLines.get(inputBusLine)}&stpid=${busStopIds.get(location)}&format=json`)
                let prediction = response['data']['bustime-response']['prd']

                //for buses not running
                if (prediction === undefined) {
                    return -1;
                }

                return prediction[0]['prdctdn'];
            }

            let predictionByMin = await getPrediction();

            //outside check for buses not running
            if (predictionByMin === -1) {
                message.channel.send(`There aren't any ${busLines.get(inputBusLine)} buses running right now.`);
                return;
            }
            
            //special case for 'DUE' response
            if (predictionByMin === 'DUE') {
                message.channel.send(`The ${busLines.get(inputBusLine)} bus is DUE! RUN!`);
                return;
            }

            message.channel.send(`A ${busLines.get(inputBusLine)} bus is coming to you in ${predictionByMin} minutes!`);

            return;
        }

        //get bus locations
        let getBuses = async () => {
            let response = await axios.get(`https://mbus.ltp.umich.edu/bustime/api/v3/getvehicles?key=${key}&rt=${busLines.get(inputBusLine)}&format=json`);

            //find all vehicles
            let vehicles = response['data']['bustime-response']['vehicle'];
            
            //check if there are no buses running
            if (vehicles === undefined) {
                return -1;
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
        if (buses === -1) {
            message.channel.send(`There aren't any ${busLines.get(inputBusLine)} buses running right now.`);
        }
        else {
            message.channel.send(`Your ${busLines.get(inputBusLine)} buses are at locations: `);
            for (let i = 0; i < buses.length; i++) {
                message.channel.send(`${buses[i]}`);
            }
        }
    }
}