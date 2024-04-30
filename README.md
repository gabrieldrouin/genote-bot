<h1 align="center">
    <span>Genote-Bot</span>
</h1>

<blockquote>
<p>:memo: <strong>NOTE</strong>: Developed and tested on Windows 10 only</p>
</blockquote>

---

## 🤖 What is Genote Bot?

Genote Bot is a Discord bot that notifies users whenever a new grade
is published on a student's Genote account.

Genote is Université de Sherbrooke's online plateform for publishing
and accessing students grades.

## 🚀 Getting Started

- Install [Node.js](https://nodejs.org/en/) v20.11.0 or higher
- Open the terminal and run the following commands

```
git clone https://github.com/gabrieldrouin/genote-bot.git
cd genote-bot
npm install
```

- Wait for all the dependencies to be installed
- Rename `config.js.example` to `config.js`
- From [Discord's developer portal](https://nodejs.org/en/)https://discord.com/developers/applications`config.js`, create a new application
- In the left column, select `Bot`, then `Reset Token`
- In `config.js`, insert the new Token in the `discordBotToken` field
- From the developer portal, in the left column, select `OAuth2`
- In the OAuth2 URL Generator section, select `bot`, then below, select `Send Messages` and `Read Message History`
- Navigate to the generated URL below and add the bot to your server
- From Discord, in `User Settings`, select `Advanced` and activate Developer Mode
- From your Discord server, right-click your preferred text channel and select `Copy Channel ID`
- In `config.js`, insert the Channel ID in the `channelID` field
- Save and exit `config.js`
- From the terminal, type `node app.js` to start the bot

Optionally:
- In `config.js`, set `restartChromePrompt` to `false` if your chrome instance has remote debugging on port 9222

