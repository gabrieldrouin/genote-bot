const discordBot = require('./discordsetup');

function removeATags(html) {
  if (html) {
      const regex = /<a\b[^>]*>[\s\S]*?<\/a>/gi;
      return html.replace(regex, '');
  }
}

function getTrElements(htmlContent) {
  try {
    const contentWithoutATags = removeATags(htmlContent);
    const trElements = contentWithoutATags.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi);
    if (trElements === null) {
      throw new Error("Not logged into Genote");
    }
    return trElements;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function getClasses(page, URL) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  console.log('Navigated to:', URL);
  await new Promise(resolve => setTimeout(resolve, 2000));
  const htmlContent = await page.content();
  return getTrElements(htmlContent).sort();
}

function getClassName(element) {
  const match = element.match(/[A-Z]{3}\d{3}/);
  return match ? match[0] : null;
}

async function cleanup() {
  console.log("Notifying bot before exit...");
  await discordBot.sendMessage("Bot stopped.");
};

function getDate() {
  const date = new Date();
  const options = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  };
  return date.toLocaleString('en-US', options);
}

function getTime() {
  const date = new Date();
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  return date.toLocaleString('en-US', options);
}

module.exports = {
  getClasses, getClassName, getDate, getTime, cleanup
}