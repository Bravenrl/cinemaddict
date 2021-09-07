import PopupView from '../view/popup.js';
import {
  isEscEvent,
  getTodayDate,
  isSubmitEvent
} from '../utils/movie.js';
import {
  showPopup,
  hidePopup,
  replace,
  remove
} from '../utils/render.js';
import {
  Mode,
  UpdateType,
  UserAction
} from '../const.js';
import {
  allComments
} from '../mock/comment.js';
import { nanoid } from 'nanoid';

export default class Popup {
  constructor(popupContainer, changeData, commentsModel) {
    this._popupContainer = popupContainer;
    this._changeData = changeData;
    this._mode = Mode.DEFAULT;
    this._commentsModel = commentsModel;
    this._popupComponent = null;

    this._escKeydownHendler = this._escKeydownHendler.bind(this);
    this._submitKeydownHendler = this._submitKeydownHendler.bind(this);
    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleAddToFavoritesClick = this._handleAddToFavoritesClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._hadleDeleteCommentClick = this._hadleDeleteCommentClick.bind(this);
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
    if (this._popupComponent !== null) {
      remove(this._popupComponent);
    }
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
    document.removeEventListener('keydown', this._submitKeydownHendler);
    this._mode = Mode.DEFAULT;
  }

  showNewPopup(movie) {
    this._movie = movie;
    this._initPopup();
    this._mode = Mode.SHOW;
    showPopup(this._popupContainer, this._popupComponent);
    document.addEventListener('keydown', this._escKeydownHendler);
    document.addEventListener('keydown', this._submitKeydownHendler);
  }

  _handlePopupCloseButtonClick() {
    this._popupComponent.reset(this._movie, this._movieComments);
    this._hidePopup();
    this._popupComponent = null;
  }

  _handleAddToWatchlistClick() {
    const updatedMovie = JSON.parse(JSON.stringify(this._movie));
    updatedMovie.userDetails.watchlist = !this._movie.userDetails.watchlist;
    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.POPUP, updatedMovie, '', this._cardTitle);
  }

  _handleAddToFavoritesClick() {
    const updatedMovie = JSON.parse(JSON.stringify(this._movie));
    updatedMovie.userDetails.favorite = !this._movie.userDetails.favorite;
    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.POPUP, updatedMovie, '', this._cardTitle);
  }

  _handleAlreadyWatchedClick() {
    const updatedMovie = JSON.parse(JSON.stringify(this._movie));
    updatedMovie.userDetails.alreadyWatched = !this._movie.userDetails.alreadyWatched;
    updatedMovie.userDetails.watchingDate = (updatedMovie.userDetails.alreadyWatched) ? getTodayDate() : null;
    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.POPUP, updatedMovie, '', this._cardTitle);
  }

  _hadleDeleteCommentClick(updateId) {
    const updatedComment = (this._movieComments).find((comment) => comment.id === `${updateId}`);
    const updatedMovie = this._movie.comments.filter((comment) => comment !== updateId);
    this._movie.comments = updatedMovie;
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH_POPUP,
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

  _submitKeydownHendler(evt) {
    if (isSubmitEvent(evt)) {
      evt.preventDefault();
      const localComment = this._popupComponent.getLocalComment();
      if ((localComment.comment === '') || (localComment.emotion ==='')) {
        return;
      }
      delete localComment.isEmoji;
      const commentId = nanoid();
      this._movie.comments.unshift(commentId);
      this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH_POPUP,
        this._movie,
        Object.assign({},
          localComment,
          {id: commentId,
            date: getTodayDate(),
          },
        ),
      );
      this._popupComponent.reset(this._movie, this._movieComments);
    }
  }
}
