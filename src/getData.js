import axios from 'axios';
import _ from 'lodash';
import parseRss from './parser';
import render from './render';

const corsProxy = 'https://cors-proxy.htmldriven.com/';

export default (e, submit, input, state) => {
  e.preventDefault();
  submit.setAttribute('disabled', 1);
  const formData = new FormData(e.target);
  const adress = _.fromPairs([...formData]).url;
  axios.get(`${corsProxy}?url=${adress}`)
    .then((res) => {
      submit.removeAttribute('disabled');
      const span = document.querySelector('#err');
      span.textContent = '';
      const obj = parseRss(res.data.body);
      obj.adress = adress;
      state.feeds.push(obj);
      state.addedFeedsList.push(adress);
      render(input, state);
    })
    .catch((err) => {
      console.log(err);
      const span = document.querySelector('#err');
      span.textContent = 'error';
    });
};
