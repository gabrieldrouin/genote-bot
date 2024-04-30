const discordBot = require('./discordsetup');

function removeATags(html) {
  if (html) {
      const regex = /<a\b[^>]*>[\s\S]*?<\/a>/gi;
      return html.replace(regex, '');
  }
}

function getTrElements(htmlContent) {
  const contentWithoutATags = removeATags(htmlContent);
  const trElements = contentWithoutATags.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi);
  return trElements;
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

module.exports = {
  getClasses, getClassName, cleanup
}