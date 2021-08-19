import Abstract from './absrtact';
import { SortType } from '../const';

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type = ${SortType.DEFAULT}>Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type = ${SortType.DATE}>Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type = ${SortType.RATING}>Sort by rating</a></li>
  </ul>`
);

export default class Sort extends Abstract {
  constructor() {
    super();
    this._sortChangeClickHandler = this._sortChangeClickHandler.bind(this);
  }

  getTemplate () {
    return createSortTemplate();
  }

  _sortChangeClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault;
    this._callback.onSortChangeClick(evt.target.dataset.sortType);
  }

  setSortChangeHandler(callback) {
    this._callback.onSortChangeClick = callback;
    this.getElement().addEventListener('click', this._sortChangeClickHandler);
  }
}
