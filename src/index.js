import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import _ from 'lodash';
import { isURL } from 'validator';

const parser = new DOMParser();
const listFeeds = document.querySelector('.list-feeds > ul');
const listArticles = document.querySelector('.list-articles > ul');
const form = document.querySelector('form');
const input = document.querySelector('input');
const state = {
  valid: false,
  listAdded: [],
};
const handler = (e) => {
  e.preventDefault();
  if (state.valid) {
    const formData = new FormData(e.target);
    const adress = _.fromPairs([...formData]).url;
    axios.get(`https://cors-proxy.htmldriven.com/?url=${adress}`)
      .then((res) => {
        const channel = parser.parseFromString(res.data.body, 'application/xml').querySelector('channel');
        const title = channel.querySelector('title');
        const description = channel.querySelector('description');
        const items = channel.querySelectorAll('item');
        const li = document.createElement('li');
        const h3 = document.createElement('h3');
        const p = document.createElement('p');
        h3.textContent = title.textContent;
        p.textContent = description.textContent;
        li.appendChild(h3);
        li.appendChild(p);
        listFeeds.appendChild(li);
        items.forEach((item) => {
          const li2 = document.createElement('li');
          const a = document.createElement('a');
          const link = item.querySelector('link').textContent;
          a.textContent = item.getElementsByTagName('title')[0].textContent;
          a.href = link;
          li2.appendChild(a);
          listArticles.appendChild(li2);
        });
        state.listAdded.push(adress);
        input.value = '';
      });
  }
};
const handler2 = (e) => {
  const str = e.target.value;
  if ((str && !isURL(str)) || state.listAdded.includes(str)) {
    e.target.setAttribute('style', 'border-color: red');
    state.valid = false;
  } else {
    e.target.setAttribute('style', 'border-color: #80bdff');
    state.valid = true;
  }
};
input.addEventListener('input', handler2);
form.addEventListener('submit', handler);
