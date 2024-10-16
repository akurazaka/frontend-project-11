export default (rssData) => {
  const domParser = new DOMParser();
  const parsedDocument = domParser.parseFromString(rssData, 'application/xml');
  const parserError = parsedDocument.querySelector('parsererror');

  if (parserError) {
    const error = new Error('errors.withoutRss');
    error.details = parserError.textContent;
    throw error;
  }

  const channelTitle = parsedDocument.querySelector('title').textContent;
  const channelDescription = parsedDocument.querySelector('description').textContent;
  const channel = { title: channelTitle, description: channelDescription };

  const itemElements = parsedDocument.querySelectorAll('item');

  const items = Array.from(itemElements).map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    return { postTitle, postDescription, link };
  });

  return { channel, items };
};
