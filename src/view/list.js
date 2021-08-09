import { createElement } from '../utils.js';

const createListTemplate = (title, headingClass, sectionClass) => (
  `<section class="films-list ${sectionClass}">
        <h2 class="films-list__title ${headingClass}">${title}</h2>
        <div class="films-list__container">
        </div>
    </section>`
);
export default class List {
  constructor (title, headingClass='', sectionClass='') {
    this._element = null;
    this._title = title;
    this._headingClass = headingClass;
    this._sectionClass = sectionClass;
  }

  getTemplate () {
    return createListTemplate(this._title, this._headingClass, this._sectionClass);
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

