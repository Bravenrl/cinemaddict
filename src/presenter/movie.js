import MovieCardView from '../view/movie-card.js';
import PopupView from '../view/popup.js';
import { isEscEvent } from '../utils/movie.js';
import { render, showPopup, hidePopup } from '../utils/render.js';
import { RenderPosition } from '../const.js';

export default class Movie {
  constructor (listComponent, popupContainer) {
    this._popupContainer = popupContainer;
    this._listContainerElement = listComponent.getListContainer();
    this._movieCardComponent = null;
    this._popupComponent = null;
    this._handleMovieCardClick = this._handleMovieCardClick.bind(this);
    this._escKeydownHendler = this._escKeydownHendler.bind(this);
    this._handlePopupClick = this._handlePopupClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._movieCardComponent = new MovieCardView(this._movie);
    this._movieCardComponent.setClickHandler(this._handleMovieCardClick);
    render(this._listContainerElement, this._movieCardComponent, RenderPosition.BEFOREEND);
  }

  _handleMovieCardClick() {
    this._popupComponent = new PopupView(this._movie);
    this._popupComponent.setClickHandler(this._handlePopupClick);
    showPopup(this._popupContainer, this._popupComponent);
    document.addEventListener('keydown', this._escKeydownHendler);
  }

  _handlePopupClick() {
    hidePopup(this._popupContainer, this._popupComponent);
    document.removeEventListener('keydown', this._escKeydownHendler);
  }

  _escKeydownHendler (evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      hidePopup(this._popupContainer, this._popupComponent);
      document.removeEventListener('keydown', this._escKeydownHendler);
    }
  }
}


