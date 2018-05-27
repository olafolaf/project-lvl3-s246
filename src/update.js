import axios from 'axios';
import render from './render';
import parseRss from './parser';

const corsProxy = 'https://cors-proxy.htmldriven.com/';
const findNewItems = (obj, items) => obj.items.filter((item2) => {
  const title2 = item2.title;
  return [...items].every((item1) => {
    const title1 = item1.title;
    return title1.textContent !== title2.textContent;
  });
});
const update = (input, state) => {
  state.feeds.forEach(({ adress, items }) => {
    axios.get(`${corsProxy}?url=${adress}`)
      .then((res) => {
        const obj = parseRss(res.data.body);
        const newItems = findNewItems(obj, items);
        if (newItems.length > 0) {
          items.push(...newItems);
          console.log(items);
          render(input, state);
        }
      });
  });
  setTimeout(() => update(input, state), 5000);
};
export default update;
