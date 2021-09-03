import MovieCardView from '../view/movie-card.js';
import {
  getTodayDate
} from '../utils/movie.js';
import {
  render,
  replace,
  remove
} from '../utils/render.js';
import {
  RenderPosition,
  UpdateType,
  UserAction
} from '../const.js';

export default class Movie {
  constructor(listComponent, changeData, popupPresenter) {
    this._listComponent = listComponent;
    this._changeData = changeData;
    this._popupPresenter = popupPresenter;
    this._movieCardComponent = null;


    this._listContainerElement = this._listComponent.getListContainer();

    this._handleMovieCardClick = this._handleMovieCardClick.bind(this);

    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleAddToFavoritesClick = this._handleAddToFavoritesClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);

  }

  init(movie) {
    this._movie = movie;

    const prevMovieCardComponent = this._movieCardComponent;

    this._movieCardComponent = new MovieCardView(this._movie);

    this._movieCardComponent.setOpenPupupClickHandler(this._handleMovieCardClick);
    this._movieCardComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._movieCardComponent.setAddToFavoritesHandler(this._handleAddToFavoritesClick);
    this._movieCardComponent.setAlreadyWatchedHandler(this._handleAlreadyWatchedClick);

    if (prevMovieCardComponent === null) {
      render(this._listContainerElement, this._movieCardComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._listComponent.getElement().contains(prevMovieCardComponent.getElement())) {
      replace(this._movieCardComponent, prevMovieCardComponent);
    }
    remove(prevMovieCardComponent);
  }

  destroy() {
    remove(this._movieCardComponent);
  }

  _handleMovieCardClick() {
    this._popupPresenter.resetPopup();
    this._popupPresenter.showNewPopup(this._movie);
  }

  _handleAddToWatchlistClick() {
    const updatedMovie = JSON.parse(JSON.stringify(this._movie));
    updatedMovie.userDetails.watchlist = !this._movie.userDetails.watchlist;
    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, updatedMovie);
  }

  _handleAddToFavoritesClick() {
    const updatedMovie = JSON.parse(JSON.stringify(this._movie));
    updatedMovie.userDetails.favorite = !this._movie.userDetails.favorite;
    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, updatedMovie);
  }

  _handleAlreadyWatchedClick() {
    const updatedMovie = JSON.parse(JSON.stringify(this._movie));
    updatedMovie.userDetails.alreadyWatched = !this._movie.userDetails.alreadyWatched;
    updatedMovie.userDetails.watchingDate = getTodayDate();
    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, updatedMovie);
  }

}
