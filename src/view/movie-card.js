import Abstract from './absrtact';
import { humanizeMovieTime, getYear } from '../utils/movie.js';

const isActive = (details) => {
  if (details) {return 'film-card__controls-item--active';
  } else {return '';}
};

const getDescription = (descriptions) => {
  const fullDescription = descriptions.join(' ');
  if (fullDescription.length > 140) {return `${fullDescription.slice(0,139)}...`;
  }
  return fullDescription;
};

const createCardTemplate = (movie) => {
  const {comments, filmInfo,  userDetails} = movie;

  return `<article class="film-card">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${getYear(filmInfo.release.date)}</span>
      <span class="film-card__duration">${humanizeMovieTime(filmInfo.runtime)}</span>
      <span class="film-card__genre">${filmInfo.genre[0]}</span>
    </p>
    <img src=${filmInfo.poster} alt="" class="film-card__poster">
    <p class="film-card__description">${getDescription(filmInfo.description)}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${isActive(userDetails.watchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${isActive(userDetails.alreadyWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${isActive(userDetails.favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class MovieCard extends Abstract {
  constructor(movie) {
    super();
    this._movie = movie;
    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
    this._clickAddToWatchlistHandler = this._clickAddToWatchlistHandler.bind(this);
    this._clickAlreadyWatchedHandler = this._clickAlreadyWatchedHandler.bind(this);
    this._clickAddToFavoritesHandler = this._clickAddToFavoritesHandler.bind(this);
  }

  _openPopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.onCardClick();
  }

  _clickAddToWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.onAddToWatchlistClick();
  }

  _clickAlreadyWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.onAlreadyWatchedClick();
  }

  _clickAddToFavoritesHandler(evt) {
    evt.preventDefault();
    this._callback.onAddToFavoritesClick();
  }


  setOpenPupupClickHandler(callback) {
    this._callback.onCardClick = callback;
    this. getElement().querySelector('.film-card__title').addEventListener('click', this._openPopupClickHandler);
    this. getElement().querySelector('.film-card__poster').addEventListener('click', this._openPopupClickHandler);
    this. getElement().querySelector('.film-card__comments').addEventListener('click', this._openPopupClickHandler);
  }

  setAddToWatchlistClickHandler(callback) {
    this._callback.onAddToWatchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._clickAddToWatchlistHandler);
  }

  setAlreadyWatchedHandler(callback) {
    this._callback.onAlreadyWatchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._clickAlreadyWatchedHandler);
  }

  setAddToFavoritesHandler(callback) {
    this._callback.onAddToFavoritesClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._clickAddToFavoritesHandler);
  }

  getTemplate () {
    return createCardTemplate(this._movie);
  }
}

