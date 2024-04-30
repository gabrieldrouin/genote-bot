const puppeteer = require('puppeteer');
const util = require('./util');
const fromChrome = require('./chromesetup');
const discordBot = require('./discordsetup');
const { URL, refreshTime } = require('./config');

(async () => {
    const wsEndpoint = await fromChrome.getWsEndpoint();
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsEndpoint,
    })
    const page = await browser.newPage();
    let prev = [];
    let curr = [];

    console.log("A new Genote tab will open. Do not close it.");
    discordBot.sendMessage("Bot started.");

    try {
        async function compareTableContents() {
            const elements = await util.getClasses(page, URL);
            elements.forEach((element, index) => {
                curr[index] = element;
                const className = util.getClassName(element);

                if (!className) return;
                if (prev[index] === curr[index]) {
                    console.log(`No difference: ${className}`);
                } else if (prev[index]) {
                    console.log(`Difference: ${className}`);
                    discordBot.sendMessage(`New grade published for class: ${className}`);
                }
                prev[index] = curr[index];
            });
        }

        async function checkForDifferences() {
            while (true) {
                await compareTableContents();
                await new Promise(resolve => setTimeout(resolve, refreshTime)); 
            }
        }

        await checkForDifferences();
    } finally {
        console.log("Notifying bot before exit...");
        discordBot.sendMessage("Bot stopped.");
    }
})();

