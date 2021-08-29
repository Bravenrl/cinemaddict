import Abstract from './absrtact';

const createListTemplate = (title, headingClass, sectionClass) => (
  `<section class="films-list ${sectionClass}">
        <h2 class="films-list__title ${headingClass}">${title}</h2>
        ${((headingClass === '')&(sectionClass ==='')) ?  '' : '<div class="films-list__container"></div>'}
    </section>`
);
export default class List extends Abstract{
  constructor (title, headingClass='', sectionClass='') {
    super();
    this._title = title;
    this._headingClass = headingClass;
    this._sectionClass = sectionClass;
  }

  getListContainer () {
    return this.getElement().querySelector('.films-list__container');
  }

  getTemplate () {
    return createListTemplate(this._title, this._headingClass, this._sectionClass);
  }
}

