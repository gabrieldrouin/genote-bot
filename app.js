const puppeteer = require('puppeteer');
const readline = require('readline');
const util = require('./util');
const fromChrome = require('./chromesetup');

async function main() {
    const wsEndpoint = await fromChrome.getWsEndpoint();
    const URL = 'https://www.usherbrooke.ca/genote/application/etudiant/cours.php';


    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let inputs = [];


    function handleInput(input) {
        if (input.toUpperCase() === 'Q') {
            rl.close();
            return;
        }
        inputs.push(input);
        rl.question('', handleInput);
    }

    rl.question('Enter classes to scan, then type "Q" to finish: ', handleInput);

    rl.on('close', () => {

        console.log(`Classes to check for: ${inputs.join(', ')}`);

        
        let browser;

        async function checkConnection() {
            try {
                browser = await puppeteer.connect({
                    browserWSEndpoint: wsEndpoint,
                })
                const page = await browser.newPage();
                
                // <tr> tags content
                let previousTrState = [];
                let currentTrState = [];

                async function compareTableContents() {

                    await page.goto(URL, { waitUntil: 'domcontentloaded' });
                    console.log('Navigated to:', URL);

                    console.log("A new Genote tab has opened. Do not close it.");
                
                    await new Promise(resolve => setTimeout(resolve, 2000));
                
                    const htmlContent = await page.content();
                    const trElements = util.getTrElements(htmlContent);

                    inputs.forEach((input, index) => {
                        const trElementsWithKeyword = trElements.filter(tr => tr.includes(input));

                        trElementsWithKeyword.length === 0 ? (
                            console.log(`No <tr> elements containing ${input} found on the page.`)
                        ) : (
                            console.log(`Number of <tr> elements containing ${input}:`, trElementsWithKeyword.length)
                        );

                        currentTrState[index] = trElementsWithKeyword.join('');

                        if (previousTrState[index] === currentTrState[index]) {
                            console.log('No difference');
                        } else {
                            if (previousTrState[index]) {
                                console.log('Difference');
                                // Log the HTML content of each <tr> element with the keyword if there are differences
                                trElementsWithKeyword.forEach((trElement, index) => {
                                    console.log(`Tr Element ${index + 1}:\n`, trElement);
                                });
                            }
                        }
                        previousTrState[index] = currentTrState[index];
                    });
                }
                async function checkForDifferences() {
                    while (true) {
                        await compareTableContents();
                        await new Promise(resolve => setTimeout(resolve, 3000)); 
                    }
                }
                await checkForDifferences();

            } catch (error) {
                console.error('Error:', error);
            } 
        }
        checkConnection();
    });
}

main();


