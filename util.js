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

module.exports = {
  getTrElements
}