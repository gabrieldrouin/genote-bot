const Discord = require('discord.js');
const { discordBotToken, channelId } = require('./config');

const client = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.GuildMessages
]})
client.login(discordBotToken);

async function sendMessage(element) {
  const channel = await client.channels.fetch(channelId);
  await channel.send(`Nouvelle note publiée pour le cours ${element}.`);
}

module.exports = {
  sendMessage
}
