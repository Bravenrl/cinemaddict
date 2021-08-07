import { createElement } from '../utils.js';

const createFooterStatisticTemplate = (totalMovies) => (
  `<section class="footer__statistics">
    <p>${totalMovies} movies inside</p>
  </section>`
);

export default class FooterStatistic {
  constructor(totalMovies) {
    this._element = null;
    this._movies = totalMovies;
  }

  getTemplate () {
    return createFooterStatisticTemplate(this._movies);
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

