import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import _ from 'lodash';
import { isURL } from 'validator';
import $ from 'jquery';
import run from './run';
import update from './update';

const parser = new DOMParser();
const corsProxy = 'https://cors-proxy.htmldriven.com/';
const state = {
  feeds: [],
  addedFeedsList: [],
  valid: false,
};

const extractData = (feed) => {
  const channel = parser.parseFromString(feed, 'application/xml').querySelector('channel');
  const items = [...channel.querySelectorAll('item')].map((item) => {
    const [title, link, description] = item.childNodes;
    return { title, link: link.textContent, description };
  });
  const [title, description] = channel.childNodes;
  return { title, description, items };
};
const showModal = (description) => {
  const modalBody = document.querySelector('.modal-body > p');
  modalBody.textContent = description.textContent;
  $('.modal').modal('show');
};
const displayData = (input) => {
  const listFeeds = document.querySelector('.list-feeds > ul');
  const listArticles = document.querySelector('.list-articles > ul');
  [...listArticles.childNodes].forEach(child => child.remove()); // !!!!
  [...listFeeds.childNodes].forEach(child => child.remove());// !!!!
  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    h3.textContent = feed.title.textContent;
    p.textContent = feed.description.textContent;
    li.appendChild(h3);
    li.appendChild(p);
    listFeeds.appendChild(li);
    feed.items.forEach((item) => {
      const li2 = document.createElement('li');
      const a = document.createElement('a');
      const { title, link, description } = item;
      const button = document.createElement('input');
      button.setAttribute('class', 'btn btn-primary');
      button.setAttribute('type', 'submit');
      button.setAttribute('value', 'description');
      button.addEventListener('click', () => showModal(description));
      a.textContent = title.textContent;
      a.href = link;
      li2.appendChild(a);
      li2.appendChild(button);
      listArticles.appendChild(li2);
      if (input) {
        input.value = '';
      }
    });
  });
};

const getData = (e, submit, input) => {
  e.preventDefault();
  submit.setAttribute('disabled', 1);
  const formData = new FormData(e.target);
  const adress = _.fromPairs([...formData]).url;
  axios.get(`${corsProxy}?url=${adress}`)
    .then((res) => {
      submit.removeAttribute('disabled');
      const span = document.querySelector('#err');
      span.textContent = '';
      const obj = extractData(res.data.body);
      obj.adress = adress;
      state.feeds.push(obj);
      state.addedFeedsList.push(adress);
      displayData(input);
    })
    .catch(() => {
      const span = document.querySelector('#err');
      span.textContent = 'error';
    });
};

const isUrlValid = (url, addedFeedsList) => (isURL(url) && !addedFeedsList.includes(url));

const checkUrl = (e, submit) => {
  const str = e.target.value;
  if (!isUrlValid(str, state.addedFeedsList)) {
    e.target.setAttribute('style', 'border-color: red');
    submit.setAttribute('disabled', 1);
    state.valid = false;
  } else {
    e.target.setAttribute('style', 'border-color: #80bdff');
    submit.removeAttribute('disabled');
    state.valid = true;
  }
};

run(checkUrl, getData);

update(state, extractData, displayData, corsProxy, axios);
