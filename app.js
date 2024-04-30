const puppeteer = require('puppeteer');
const readline = require('readline');
const util = require('./util');
const fromChrome = require('./chromesetup');

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

            if (prev[index] === curr[index]) {
                console.log('No difference');
            } else {
                if (prev[index]) {
                    console.log('Difference');
                }
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


