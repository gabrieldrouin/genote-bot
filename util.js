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

module.exports = {
  getClasses
}