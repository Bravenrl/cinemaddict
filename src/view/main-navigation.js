import { FilterType } from '../const';
import Abstract from './absrtact';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (`<a href="#${type}" class="main-navigation__item
            ${currentFilterType === type ? 'main-navigation__item--active' : ''}" data-filter-type = "${type}">
            ${name}
            ${count !== 0 ? `<span class="main-navigation__item-count">${count}</span>` : ''}</a>`);
};


const createNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');
  return (`<nav class="main-navigation">
              <div class="main-navigation__items">
              ${filterItemsTemplate}
              </div>
              <a href="#stats" class="main-navigation__additional">Stats</a>
              </nav>`
  );
};

export default class Navigation extends Abstract {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
    this._showStatsHandler = this._showStatsHandler.bind(this);
    this._statsButton = this.getElement().querySelector('.main-navigation__additional');
  }

  getTemplate () {
    return createNavigationTemplate(this._filters, this._currentFilter);
  }

  _filterTypeClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }


  _showStatsHandler(evt) {
    evt.preventDefault();
    const filter = this.getElement().querySelector('.main-navigation__item--active');
    if ((filter)&&(evt.target.text === FilterType.STATS)) {
      filter.classList.remove('main-navigation__item--active');
      this._statsButton.classList.add('main-navigation__additional--active');
    }
    this._callback.showStats(evt.target.text);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement()
      .querySelector('.main-navigation__items')
      .addEventListener('click', this._filterTypeClickHandler);
  }

  setShowStatsHandler(callback) {
    this._callback.showStats = callback;
    this.getElement().addEventListener('click', this._showStatsHandler);
  }
}
