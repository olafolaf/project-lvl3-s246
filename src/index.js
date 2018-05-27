import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import checkUrl from './checkUrl';
import getData from './getData';
import update from './update';

const state = {
  feeds: [],
  addedFeedsList: [],
  valid: false,
};
const form = document.querySelector('form');
const input = document.querySelector('input');
const submit = document.querySelector('.btn-primary');
input.addEventListener('input', e => checkUrl(e, submit, state));
form.addEventListener('submit', e => getData(e, submit, input, state));
update(input, state);
