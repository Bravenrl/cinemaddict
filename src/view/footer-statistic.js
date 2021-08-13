import Abstract from './absrtact';

const createFooterStatisticTemplate = (totalMovies) => (
  `<section class="footer__statistics">
    <p>${totalMovies} movies inside</p>
  </section>`
);

export default class FooterStatistic extends Abstract {
  constructor(totalMovies) {
    super();
    this._movies = totalMovies;
  }

  getTemplate () {
    return createFooterStatisticTemplate(this._movies);
  }
}

