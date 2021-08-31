import MovieCardView from '../view/movie-card.js';
import PopupView from '../view/popup.js';
import {
  isEscEvent
} from '../utils/movie.js';
import {
  render,
  showPopup,
  hidePopup,
  replace,
  remove
} from '../utils/render.js';
import {
  RenderPosition,
  Mode,
  UpdateType,
  UserAction
} from '../const.js';
import {
  allComments
} from '../mock/comment.js';


export default class Movie {
  constructor(listComponent, popupContainer, changeData, changeMode, commentsModel) {
    this._popupContainer = popupContainer;
    this._listComponent = listComponent;
    this._changeMode = changeMode;
    this._changeData = changeData;
    this._mode = Mode.DEFAULT;
    this._commentsModel = commentsModel;
    this._movieCardComponent = null;
    this._popupComponent = null;

    this._listContainerElement = this._listComponent.getListContainer();

    this._handleMovieCardClick = this._handleMovieCardClick.bind(this);
    this._escKeydownHendler = this._escKeydownHendler.bind(this);
    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleAddToFavoritesClick = this._handleAddToFavoritesClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._hadleDeleteCommentClick = this._hadleDeleteCommentClick.bind(this);
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
    if (this._mode === Mode.SHOW) {
      this._initPopup();
    }

    remove(prevMovieCardComponent);
  }

  _getComments() {
    if (this._mode !== Mode.SHOW) {
      this._commentsModel.comments = allComments[this._movie.id];
    }
    this._movieComments = this._commentsModel.comments;
  }

  _initPopup() {
    this._getComments();
    const prevPopupComponent = this._popupComponent;
    this._popupComponent = new PopupView(this._movie, this._movieComments);
    this._popupComponent.setCloseButtonClickHandler(this._handlePopupCloseButtonClick);
    this._popupComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._popupComponent.setAddToFavoritesHandler(this._handleAddToFavoritesClick);
    this._popupComponent.setAlreadyWatchedHandler(this._handleAlreadyWatchedClick);
    this._popupComponent.setCommentDeleteClickHandler(this._hadleDeleteCommentClick);
    if (this._mode === Mode.SHOW) {
      replace(this._popupComponent, prevPopupComponent);
      if (prevPopupComponent) {
        const data = prevPopupComponent.getData();
        this._popupComponent.restore(data);
      }
    }
    if (prevPopupComponent !== null) {
      remove(prevPopupComponent);
    }
  }

  destroy() {
    remove(this._movieCardComponent);
    remove(this._popupComponent);
  }

  resetPopup() {
    if (this._mode !== Mode.DEFAULT) {
      const movieComments = this._commentsModel.comments;
      this._popupComponent.reset(this._movie, movieComments);
      this._hidePopup();
    }
  }

  _hidePopup() {
    hidePopup(this._popupContainer, this._popupComponent);
    document.removeEventListener('keydown', this._escKeydownHendler);
    this._mode = Mode.DEFAULT;
  }

  _showPopup() {
    this._initPopup();
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
    this._popupComponent.reset(this._movie, this._movieComments);
    this._hidePopup();
    this._popupComponent = null;
  }

  _handleAddToWatchlistClick(evt) {
    const updatedMovie = JSON.parse(JSON.stringify(this._movie));
    updatedMovie.userDetails.watchlist = !this._movie.userDetails.watchlist;
    if (evt !== '') {
      this._changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, updatedMovie);
    } else {
      this._changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, updatedMovie);
    }
  }

  _handleAddToFavoritesClick(evt) {
    const updatedMovie = JSON.parse(JSON.stringify(this._movie));
    updatedMovie.userDetails.favorite = !this._movie.userDetails.favorite;
    if (evt !== '') {
      this._changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, updatedMovie);
    } else {
      this._changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, updatedMovie);
    }
  }

  _handleAlreadyWatchedClick(evt) {
    const updatedMovie = JSON.parse(JSON.stringify(this._movie));
    updatedMovie.userDetails.alreadyWatched = !this._movie.userDetails.alreadyWatched;
    if (evt !== '') {
      this._changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, updatedMovie);
    } else {
      this._changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, updatedMovie);
    }
  }

  _handleSaveData() {

  }

  _hadleDeleteCommentClick(updateId) {
    const updatedComment = (this._movieComments).find((comment) => comment.id === `${updateId}`);
    const updatedMovie = this._movie.comments.filter((comment) => comment !== updateId);
    this._movie.comments = updatedMovie;
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      this._movie,
      updatedComment,
    );
  }


  _escKeydownHendler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._popupComponent.reset(this._movie, this._movieComments);
      this._hidePopup();
      this._popupComponent = null;
    }
  }
}
