import Abstract from './absrtact';
import { SortType, SortText } from '../const';

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type = ${SortType.DEFAULT}>${SortText.DEFAULT}</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type = ${SortType.DATE}>${SortText.DATE}</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type = ${SortType.RATING}>${SortText.RATING}</a></li>
  </ul>`
);

export default class Sort extends Abstract {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortChangeClickHandler = this._sortChangeClickHandler.bind(this);
  }

  getTemplate () {
    return createSortTemplate(this._currentSortType);
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
