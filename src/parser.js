export default (feed) => {
  const parser = new DOMParser();
  const channel = parser.parseFromString(feed, 'application/xml').querySelector('channel');
  const items = [...channel.querySelectorAll('item')].map((item) => {
    const [title, link, description] = item.childNodes;
    return { title, link: link.textContent, description };
  });
  const [title, description] = channel.childNodes;
  return { title, description, items };
};