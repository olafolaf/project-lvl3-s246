const update = (state, extractData, displayData, corsProxy, axios, input) => {
  state.feeds.forEach(({ adress, items }) => {
    axios.get(`${corsProxy}?url=${adress}`)
      .then((res) => {
        const obj = extractData(res.data.body);
        const newItems = obj.items.filter((item2) => {
          const title2 = item2.title;
          return [...items].every((item1) => {
            const title1 = item1.title;
            return title1.textContent !== title2.textContent;
          });
        });
        if (newItems.length > 0) {
          items.push(...newItems);
          console.log(items);
          displayData();
        }
      });
  });
  setTimeout(() => update(state, extractData, displayData, corsProxy, axios), 5000);
};
export default update;
