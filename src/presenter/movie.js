import MovieCardView from '../view/movie-card.js';
import PopupView from '../view/popup.js';
import { isEscEvent } from '../utils/movie.js';
import { render, showPopup, hidePopup, replace, remove } from '../utils/render.js';
import { RenderPosition, Mode } from '../const.js';

export default class Movie {
  constructor (listComponent, popupContainer, updateMovie, changeMode) {
    this._popupContainer = popupContainer;
    this._listComponent = listComponent;
    this._changeMode = changeMode;
    this._updateMovie = updateMovie;
    this._mode = Mode.DEFAULT;

    this._movieCardComponent = null;
    this._popupComponent = null;

    this._listContainerElement = this._listComponent.getListContainer();

    this._handleMovieCardClick = this._handleMovieCardClick.bind(this);
    this._escKeydownHendler = this._escKeydownHendler.bind(this);
    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleAddToFavoritesClick = this._handleAddToFavoritesClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
  }

  init(movie) {
    this._movie = movie;

    const prevMovieCardComponent = this._movieCardComponent;
    const prevPopupComponent = this._popupComponent;

    this._movieCardComponent = new MovieCardView(this._movie);
    this._popupComponent = new PopupView(this._movie);

    this._movieCardComponent.setOpenPupupClickHandler(this._handleMovieCardClick);
    this._movieCardComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._movieCardComponent.setAddToFavoritesHandler(this._handleAddToFavoritesClick);
    this._movieCardComponent.setAlreadyWatchedHandler(this._handleAlreadyWatchedClick);
    this._popupComponent.setCloseButtonClickHandler(this._handlePopupCloseButtonClick);
    this._popupComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._popupComponent.setAddToFavoritesHandler(this._handleAddToFavoritesClick);
    this._popupComponent.setAlreadyWatchedHandler(this._handleAlreadyWatchedClick);

    if (prevMovieCardComponent === null) {
      render(this._listContainerElement, this._movieCardComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._listComponent.getElement().contains(prevMovieCardComponent.getElement())) {
      replace(this._movieCardComponent, prevMovieCardComponent);
    }
    if (this._mode === Mode.SHOW) {
      replace(this._popupComponent, prevPopupComponent);
    }
    remove(prevMovieCardComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove (this._movieCardComponent);
    remove (this._popupComponent);
  }

  resetPopup() {
    if (this._mode !== Mode.DEFAULT) {
      this._hidePopup();
    }
  }

  _hidePopup() {
    hidePopup(this._popupContainer, this._popupComponent);
    document.removeEventListener('keydown', this._escKeydownHendler);
    this._mode = Mode.DEFAULT;
  }

  _showPopup() {
    showPopup(this._popupContainer, this._popupComponent);
    document.addEventListener('keydown', this._escKeydownHendler);
    this._changeMode();
    this._mode = Mode.SHOW;
  }

  _handleMovieCardClick() {
    if (this._mode !== Mode.SHOW) {
      this._showPopup();
    }
  }

  _handlePopupCloseButtonClick() {
    this._hidePopup();
  }

  _handleAddToWatchlistClick() {
    const updatedMovie = JSON.parse(JSON.stringify(this._movie));
    updatedMovie.userDetails.watchlist = !this._movie.userDetails.watchlist;
    this._updateMovie(updatedMovie);
  }

  _handleAddToFavoritesClick() {
    const updatedMovie = JSON.parse(JSON.stringify(this._movie));
    updatedMovie.userDetails.favorite = !this._movie.userDetails.favorite;
    this._updateMovie(updatedMovie);
  }

  _handleAlreadyWatchedClick() {
    const updatedMovie = JSON.parse(JSON.stringify(this._movie));
    updatedMovie.userDetails.alreadyWatched = !this._movie.userDetails.alreadyWatched;
    this._updateMovie(updatedMovie);
  }

  _escKeydownHendler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._hidePopup();
    }
  }
}


