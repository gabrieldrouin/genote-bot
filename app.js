const puppeteer = require('puppeteer');
const readline = require('readline');
let input;

// Create an interface to read input from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user for input
rl.question('Enter which class to scan for: ', (input) => {
    // Print the input back to the console
    console.log(`You entered: ${input}`);

    // Close the interface
    rl.close();


    // WebSocket endpoint of the Chrome instance
    const wsEndpoint = 'ws://127.0.0.1:9222/devtools/browser/0ade2b44-5b68-41e7-8cd4-43ef185dfa5e';

    // URL to monitor
    const URL = 'https://www.usherbrooke.ca/genote/application/etudiant/cours.php';

    // Declare the browser variable outside of the function
    let browser;

    // Variable to store the previous state of tables
    let previousTablesState;

    // Function to check for connection and log if successful
    async function checkConnection() {
        try {
            // Connect to the existing Chrome instance
            browser = await puppeteer.connect({
                browserWSEndpoint: wsEndpoint,
            });
            console.log('Connected to existing Chrome instance.');

            // Create a new page
            const page = await browser.newPage();
            console.log('New page created.');

            let tables;

            let previousTrState;

            // Function to compare table contents
            async function compareTableContents() {
                // Navigate to the webpage
                await page.goto(URL, { waitUntil: 'domcontentloaded' });
                console.log('Navigated to:', URL);
            
                // Wait for the page to load completely
                await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust as needed
            
                // Get the HTML content of the entire page
                const htmlContent = await page.content();
            
                // Remove <a> tags from HTML content
                const contentWithoutATags = removeATags(htmlContent);
            
                // Extract <tr> elements
                const trElements = contentWithoutATags.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi);
            
                // Filter <tr> elements containing the specified keyword
                const trElementsWithKeyword = trElements.filter(tr => tr.includes(input));
            
                // Check if any <tr> elements with the keyword are found
                if (trElementsWithKeyword.length === 0) {
                    console.log(`No <tr> elements containing ${input} found on the page.`);
                    return;
                }
            
                // Log the number of <tr> elements with the keyword
                console.log(`Number of <tr> elements containing ${input}:`, trElementsWithKeyword.length);
            
                // Perform comparison logic for <tr> elements with the keyword
                const currentTrState = trElementsWithKeyword.join('');
                if (previousTrState === currentTrState) {
                    console.log('No difference');
                } else {
                    if (previousTrState) {
                        console.log('Difference');
                        // Log the HTML content of each <tr> element with the keyword if there are differences
                        trElementsWithKeyword.forEach((trElement, index) => {
                            console.log(`Tr Element ${index + 1}:\n`, trElement);
                        });
                    }
                }
            
                // Update previous state
                previousTrState = currentTrState;
            }
            
            
            // Function to remove <a> tags from HTML content
            function removeATags(html) {
                if (html) {
                const regex = /<a\b[^>]*>[\s\S]*?<\/a>/gi;
                const val = html.replace(regex, '');
                //console.log(val);
                return html.replace(regex, '');
            }
            }
            
            // Function to continuously check for differences
            async function checkForDifferences() {
                while (true) {
                    await compareTableContents();
                    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds before checking again
                }
            }

            // Start checking for differences
            await checkForDifferences();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            // Close the browser instance if it's defined
            if (browser) {
                // await browser.close();
            }
        }
    }

    // Check the connection
    checkConnection();

});

// http://127.0.0.1:9222/json/version
