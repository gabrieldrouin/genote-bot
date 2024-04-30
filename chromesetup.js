const { exec } = require('child_process');
const axios = require('axios');
const prompt = require("prompt-sync")({ sigint: true });

function getWsEndpoint() {
    return new Promise((resolve, reject) => {
        const res = prompt("Chrome must be restarted before continuing. Do you wish to proceed? (Y/N): ");
        if (res.trim().toLowerCase() !== 'y') {
            console.log("Exiting...");
            process.exit();
        }

        // Close all open instances of Chrome
        const closeChromeCommand = process.platform === 'win32' ? 'taskkill /im chrome.exe /f' : 'pkill chrome';
        exec(closeChromeCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error closing Chrome: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`Error closing Chrome: ${stderr}`);
                reject(stderr);
                return;
            }
            console.log("All Chrome instances closed successfully.");

            // Open a new Chrome instance using Windows' Run prompt
            const openChromeCommand = 'start chrome --remote-debugging-port=9222';
            exec(openChromeCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error opening Chrome: ${error.message}`);
                    reject(error);
                    return;
                }
                if (stderr) {
                    console.error(`Error opening Chrome: ${stderr}`);
                    reject(stderr);
                    return;
                }
                console.log("New Chrome instance opened successfully.");

                // Open the specified URL in a new tab
                exec('start chrome "https://www.usherbrooke.ca/genote/application/etudiant/cours.php"', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error opening URL in Chrome: ${error.message}`);
                        reject(error);
                        return;
                    }
                    if (stderr) {
                        console.error(`Error opening URL in Chrome: ${stderr}`);
                        reject(stderr);
                        return;
                    }
                    console.log("URL opened in Chrome successfully.");

                    prompt("Log into Genote, then press any key to continue.");

                    // Make a GET request to fetch the version information
                    setTimeout(() => {
                        axios.get('http://127.0.0.1:9222/json/version')
                            .then(response => {
                                const wsDbUrl = response.data.webSocketDebuggerUrl;
                                console.log("WebSocket Debugger URL:", wsDbUrl);
                                resolve(wsDbUrl);
                            })
                            .catch(error => {
                                console.error('Error fetching version information:', error);
                                reject(error);
                            });
                    }, 1000);
                });
            });
        });
    });
}

module.exports = {
    getWsEndpoint
};
