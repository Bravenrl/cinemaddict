import Abstract from './absrtact';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButton extends Abstract {
  constructor () {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.onButtonClick();
  }

  setClickHandler(callback) {
    this._callback.onButtonClick = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  getTemplate () {
    return createShowMoreButtonTemplate();
  }
}
