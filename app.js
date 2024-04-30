const puppeteer = require('puppeteer');
const readline = require('readline');
const util = require('./util');

let inputs = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

    // Get websocket endpoint at http://127.0.0.1:9222/json/version
    const wsEndpoint = 'ws://127.0.0.1:9222/devtools/browser/5b984610-5b78-415a-9829-e78b863d1a96';
    const URL = 'https://www.usherbrooke.ca/genote/application/etudiant/cours.php';
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


