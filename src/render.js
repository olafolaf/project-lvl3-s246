import $ from 'jquery';

const showModal = (description) => {
  const modalBody = document.querySelector('.modal-body > p');
  modalBody.textContent = description.textContent;
  $('.modal').modal('show');
};

export default (input, state) => {
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
