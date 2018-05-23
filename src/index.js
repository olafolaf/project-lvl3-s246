import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import _ from 'lodash';
import { isURL } from 'validator';

const parser = new DOMParser();
const form = document.querySelector('form');
const input = document.querySelector('input');
const submit = document.querySelector('.btn-primary');
const state = {
  feeds: [],
  articles: [],
};
const listAdded = [];
const createTree = () => {
  const listFeeds = document.querySelector('.list-feeds > ul');
  const listArticles = document.querySelector('.list-articles > ul');
  [...listArticles.childNodes].forEach(child => child.remove());
  [...listFeeds.childNodes].forEach(child => child.remove());
  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    h3.textContent = feed.title.textContent;
    p.textContent = feed.description.textContent;
    li.appendChild(h3);
    li.appendChild(p);
    listFeeds.appendChild(li);
  });
  state.articles.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const title = item.querySelector('title');
    const link = item.querySelector('link').textContent;
    a.textContent = title.textContent;
    a.href = link;
    li.appendChild(a);
    listArticles.appendChild(li);
    input.value = '';
  });
};

const getData = (e) => {
  e.preventDefault();
  submit.setAttribute('disabled', 1);
  const formData = new FormData(e.target);
  const adress = _.fromPairs([...formData]).url;
  axios.get(`https://cors-proxy.htmldriven.com/?url=${adress}`)
    .then((res) => {
      submit.removeAttribute('disabled');
      const span = document.querySelector('#err');
      span.textContent = '';
      const channel = parser.parseFromString(res.data.body, 'application/xml').querySelector('channel');
      const [title, description] = channel.childNodes;
      const items = channel.querySelectorAll('item');
      state.feeds = [...state.feeds, { title, description }];
      state.articles = [...state.articles, ...items];
      listAdded.push(adress);
      createTree();
    })
    .catch(() => {
      const span = document.querySelector('#err');
      span.textContent = 'error';
    });
};

const checkUrl = (e) => {
  const str = e.target.value;
  if ((str && !isURL(str)) || listAdded.includes(str)) {
    e.target.setAttribute('style', 'border-color: red');
    submit.setAttribute('disabled', 1);
  } else {
    e.target.setAttribute('style', 'border-color: #80bdff');
    submit.removeAttribute('disabled');
  }
};
input.addEventListener('input', checkUrl);
form.addEventListener('submit', getData);
