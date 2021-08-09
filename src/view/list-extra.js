import { createElement } from '../utils.js';
const createListExtraTemplate = (title) => (
  `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>
   </section>`
);

export default class ListExtra {
  constructor(title) {
    this._element = null;
    this._title = title;
  }

  getTemplate () {
    return createListExtraTemplate(this._title);
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
