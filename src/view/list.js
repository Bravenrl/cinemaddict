import Abstract from './absrtact';
import {CardTitle, ListEmptyTextType } from '../const';

const createListTemplate = (title, filterType) => (
  `<section class="films-list ${((title === CardTitle.MOST_COMMENTED) || (title === CardTitle.TOP_RATED)) ? 'films-list--extra' : ''}">
        <h2 class="films-list__title ${(title === CardTitle.ALL) ? 'visually-hidden' : ''}">${title=== CardTitle.EMPTY ? ListEmptyTextType[filterType] : title }</h2>
        ${((title !== CardTitle.EMPTY)&&(title !== CardTitle.LOADING)) ? '<div class="films-list__container"></div>' : ''}
    </section>`
);
export default class List extends Abstract{
  constructor (title, filterType) {
    super();
    this._title = title;
    this._filterType = filterType;
  }

  getListContainer () {
    return this.getElement().querySelector('.films-list__container');
  }

  getTemplate () {
    return createListTemplate(this._title, this._filterType);
  }
}

