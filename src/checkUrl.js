import { isURL } from 'validator';

const isUrlValid = (url, addedFeedsList) => (isURL(url) && !addedFeedsList.includes(url));

export default (e, submit, state) => {
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