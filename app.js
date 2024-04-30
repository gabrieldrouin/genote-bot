const puppeteer = require('puppeteer');
const util = require('./util');
const fromChrome = require('./chromesetup');
const discordBot = require('./discordsetup');

async function main() {
    const wsEndpoint = await fromChrome.getWsEndpoint();
    const URL = 'https://www.usherbrooke.ca/genote/application/etudiant/cours.php';
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsEndpoint,
    })
    const page = await browser.newPage();
    let prev = [];
    let curr = [];

    console.log("A new Genote tab will open. Do not close it.");

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
                discordBot.sendMessage(className);
            }
            prev[index] = curr[index];
        });
    }
    async function checkForDifferences() {
        while (true) {
            await compareTableContents();
            await new Promise(resolve => setTimeout(resolve, 3000)); 
        }
    }
    await checkForDifferences();
}
main();


