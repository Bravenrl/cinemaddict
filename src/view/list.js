import { createElement } from '../utils.js';

const createListTemplate = (title) => (
  `<section class="films-list">
        <h2 class="films-list__title visually-hidden">${title}</h2>
    </section>`
);

export default class List {
  constructor (title) {
    this._element = null;
    this._title = title;
  }

  getTemplate () {
    return createListTemplate(this._title);
  }

  getElement () {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement () {
    this._element = null;
  }
}

