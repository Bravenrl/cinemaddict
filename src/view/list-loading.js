import { createElement } from '../utils.js';

const createLoadingListTemplate = () => (
  `<section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
  </section>`
);

export default class LoadingList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    createLoadingListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement () {
    this._element = null;
  }
}
