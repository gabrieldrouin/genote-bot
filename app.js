const puppeteer = require('puppeteer');

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

        // Function to compare table contents
        async function compareTableContents() {
            // Navigate to the webpage
            await page.goto(URL, { waitUntil: 'domcontentloaded' });
            console.log('Navigated to:', URL);
        
            // Wait for the page to load completely
            await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust as needed
        
            // Get the HTML content of the entire page
            const htmlContent = await page.content();
        
            // Extract all <table> elements
            tables = htmlContent.match(/<table\b[^>]*>[\s\S]*?<\/table>/gi);
        
            // Log the number of tables found
            console.log('Number of <table> tags:', tables.length);
        
            // Perform comparison logic for tables
            const currentTablesState = removeATags(tables.join(''));
            const previousTablesStateWithoutATags = removeATags(previousTablesState);
        
            if (previousTablesStateWithoutATags === currentTablesState) {
                console.log('No difference');
            } else {
                // Log the HTML content of each table if there are differences
                tables.forEach((table, index) => {
                    console.log("Difference")
                    //console.log(`Table ${index + 1}:\n`, table);
                });
            }
        
            // Update previous state
            previousTablesState = currentTablesState;
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



// http://127.0.0.1:9222/json/version
