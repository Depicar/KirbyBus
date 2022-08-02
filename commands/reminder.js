const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const key = process.env.KEY;

  module.exports = {
    name: 'reminder',
    description: "called every 10 seconds to remind user",
    async execute(message, busStopIds, busLines, home, selectedBus) {
        if (home.length === 0 || selectedBus.length === 0) {
            message.channel.send('No set home or set bus line');
            return
        }

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

        if (predictionByMin === -1) {
            message.channel.send(`There aren't any ${busLines.get(selectedBus)} buses running to your home right now.`);
            return;
        }

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