export default (checkUrl, getData) => {
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const submit = document.querySelector('.btn-primary');
  input.addEventListener('input', e => checkUrl(e, submit));
  form.addEventListener('submit', e => getData(e, submit, input));
};
