
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

// Replace YOUR_BOT_TOKEN with your actual bot token
const token = 'YOUR TELEGRAM BOT TOKEN HERE',


;

// Create a bot instance
const bot = new TelegramBot(token, {polling: true});

// Set the OpenWeather API URL and API key
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'YOUR OPENWEATHER API KEY HERE'; 
;

// Handle the /weather command
bot.onText(/\/weather/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match.input.split(' ')[1];

  // Send a message to the user to let them know the bot is processing their request
  bot.sendMessage(chatId, 'Fetching weather information for ' + city + '...');

  // Make a request to the OpenWeather API to get the weather for the specified city
  request(weatherApiUrl + '?q=' + city + '&units=metric&appid=' + apiKey, (error, response, body) => {
    if (error) {
      // If there was an error, send a message to the user
      bot.sendMessage(chatId, 'There was an error getting the weather information. Please try again.');
      return;
    }

    // Parse the response body
    const weather = JSON.parse(body);

    // If the city was not found, send a message to the user
    if (weather.cod === '404') {
      bot.sendMessage(chatId, 'The city you entered was not found. Please try again.');
      return;
    }

    // Format the weather information into a message to send to the user
    const message = 'Weather for ' + weather.name + ':\n' +
                    'Temperature: ' + weather.main.temp + '°C\n' +
                    'Conditions: ' + weather.weather[0].description + '\n' +
                    'Humidity: ' + weather.main.humidity + '%';

    // Send the weather information to the user
    bot.sendMessage(chatId, message);
  });
});
