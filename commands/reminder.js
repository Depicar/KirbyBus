const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const key = process.env.KEY;
const userData = require('../userData');


  module.exports = {
    name: 'reminder',
    description: "called every 10 seconds to remind user",
    async execute(message, busStopIds, busLines, tempTime) {

        //find response from db
        var line = await userData.find( 
            {_id: message.author.id} ,
        );

        //make sure data exists
        try {
            line[0].busData;
        }
        catch {
            message.channel.send("Please set a home and bus line.");
            return;
        }
        
        if (line[0].busData === undefined) {
            message.channel.send("Please set a bus line.");
            return;  
        }

        if (line[0].stopData === undefined) {
            message.channel.send("Please set a home.");
            return;  
        }

        let home = line[0].stopData;
        let selectedBus = line[0].busData

        // if (home.length === 0 || selectedBus.length === 0) {
        //     message.channel.send('No set home or set bus line');
        //     return
        // }

        let getPrediction = async () => {
            let response = await axios.get(`https://mbus.ltp.umich.edu/bustime/api/v3/getpredictions?key=${key}&rt=${busLines.get(selectedBus)}&stpid=${busStopIds.get(home)}&format=json`)
            let prediction = response['data']['bustime-response']['prd']

            //for buses not running
            if (prediction === undefined) {
                return -1;
            }

            return prediction[0]['prdctdn'];
        }

        let predictionByMin = await getPrediction();

        //check bus exists (will repeat if none)
        if (predictionByMin === -1) {
            message.channel.send(`There aren't any ${busLines.get(selectedBus)} buses running to your home right now.`);
            return;
        }

        //prevents repeat messages
        if (predictionByMin === tempTime[0]) {
            return;
        }
        
        //next bus message
        if (tempTime[0] === 'DUE') {
            message.channel.send(`The next ${busLines.get(selectedBus)} bus is coming in ${predictionByMin} minutes`);
            tempTime[0] = predictionByMin;
            return;
        }

        tempTime[0] = predictionByMin;


        //current bus time
        if (predictionByMin === '10') {
            message.channel.send(`The ${busLines.get(selectedBus)} bus is coming in 10 minutes`);
            return;
        }

        if (predictionByMin === '5') {
            message.channel.send(`The ${busLines.get(selectedBus)} bus is coming in 5 minutes`);
            return;
        }

        //special case for 'DUE' response
        if (predictionByMin === 'DUE') {
            message.channel.send(`The ${busLines.get(selectedBus)} bus is DUE! RUN!`);
            return;
        }
        
        //for testing
        //message.channel.send(`A ${busLines.get(selectedBus)} bus is coming to you in ${predictionByMin} minutes!`);

        return;
    }

}