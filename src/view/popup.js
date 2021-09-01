import SmartView from './smart.js';
import {
  humanizeMovieTime
  //isSubmitEvent
} from '../utils/movie.js';
import {
  Emoji,
  NewComment
} from '../const.js';
import {
  getCommentDate
} from '../utils/movie.js';
import {
  getReleaseDate
} from '../utils/movie.js';
import he from 'he';


const isActive = (isDetails) => (isDetails) ? ('film-details__control-button--active') : '';

const createGenresTemplate = (genres) => (
  `<tr class="film-details__row">
    <td class="film-details__term">${(genres.length>1)? 'Genres' : 'Genre'}</td>
    <td class="film-details__cell">
     ${genres.map((genre) =>
    `<span class="film-details__genre">${genre}</span>`).join('')}
    </tr>
    `);

const createEmojiListTemplate = (currentEmoji) => (`
  <div class="film-details__emoji-list">
    ${Object.entries(Emoji).map(([emoji, path]) =>
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${currentEmoji === emoji ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src=${path} width="30" height="30" alt="emoji">
      </label>`).join('')}
  </div>
`);

const createCommentsTemplate = (comments, isComments) => (isComments) ? (`
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
    <ul class="film-details__comments-list">
    ${comments.map((comment) =>
    `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src=${Emoji[comment.emotion]} width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${getCommentDate(comment.date)}</span>
                <button id = "${comment.id}"class="film-details__comment-delete">Delete</button>
              </p>
            </div>
      </li>
    `).join('')}
    </ul>
  `) : '';

const createNewComentEmojiTemplate = (isEmoji, commentEmoji) => (isEmoji) ? (`<img src="images/emoji/${commentEmoji}.png" width="55" height="55" alt="emoji-${commentEmoji}">`) : '';

const createPopupTemplate = (data, movie) => {
  const {
    userDetails,
    comments,
    isComments,
    newComment = '',
  } = data;
  const {
    filmInfo,
  } = movie;

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${filmInfo.poster} alt="">

          <p class="film-details__age">${filmInfo.ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">Alternative: ${filmInfo.title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${getReleaseDate(filmInfo.release.date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${humanizeMovieTime(filmInfo.runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
            </tr>
              ${createGenresTemplate(filmInfo.genre)}
          </table>

          <p class="film-details__film-description">
          ${filmInfo.description.join(' ')}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${isActive(userDetails.watchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${isActive(userDetails.alreadyWatched)}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${isActive(userDetails.favorite)}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">


        ${createCommentsTemplate(comments, isComments)}

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
           ${createNewComentEmojiTemplate(newComment.isEmoji, newComment.emotion)}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newComment.comment}</textarea>
          </label>
          ${createEmojiListTemplate(newComment.emotion)}
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class Popup extends SmartView {
  constructor(movie, comments) {
    super();
    this._movie = movie;
    this._comments = comments;
    this._data = Popup.parseMovieToData(movie, comments);
    this._clickCloseButtonHandler = this._clickCloseButtonHandler.bind(this);
    this._clickAddToWatchlistHandler = this._clickAddToWatchlistHandler.bind(this);
    this._clickAlreadyWatchedHandler = this._clickAlreadyWatchedHandler.bind(this);
    this._clickAddToFavoritesHandler = this._clickAddToFavoritesHandler.bind(this);
    this._emojiToggleHandler = this._emojiToggleHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._clickCommentDeleteHandler = this._clickCommentDeleteHandler.bind(this);
    this._setInnerHandlers();
  }

  _clickCloseButtonHandler(evt) {
    evt.preventDefault();
    this._callback.onCloseButtonClick();
  }

  _clickAddToWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.onAddToWatchlistClick(evt.target.name);
  }

  _clickAlreadyWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.onAlreadyWatchedClick(evt.target.name);
  }

  _clickAddToFavoritesHandler(evt) {
    evt.preventDefault();
    this._callback.onAddToFavoritesClick(evt.target.name);
  }

  _clickCommentDeleteHandler(evt) {
    evt.preventDefault();
    this._callback.onDeleteButtonClick(evt.target.id);
  }

  _emojiToggleHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.updateData({
      newComment: Object.assign({},
        this._data.newComment, {
          isEmoji: this._data.newComment.emotion !== evt.target.value,
          emotion: this._data.newComment.emotion === evt.target.value ? '' : evt.target.value,
        },
      ),
    });
  }


  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newComment: Object.assign({},
        this._data.newComment, {
          comment: evt.target.value,
        },
      ),
    }, true);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.onCloseButtonClick);
    this.setAddToWatchlistClickHandler(this._callback.onAddToWatchlistClick);
    this.setAlreadyWatchedHandler(this._callback.onAlreadyWatchedClick);
    this.setAddToFavoritesHandler(this._callback.onAddToFavoritesClick);
    this.setCommentDeleteClickHandler(this._callback.onDeleteButtonClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emojiToggleHandler);

    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
  }

  setCommentDeleteClickHandler(callback) {
    this._callback.onDeleteButtonClick = callback;
    this.getElement()
      .querySelectorAll('.film-details__comment-delete')
      .forEach((button)=>button.addEventListener('click', this._clickCommentDeleteHandler));
  }

  setCloseButtonClickHandler(callback) {
    this._callback.onCloseButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._clickCloseButtonHandler);
  }

  setAddToWatchlistClickHandler(callback) {
    this._callback.onAddToWatchlistClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('click', this._clickAddToWatchlistHandler);
  }

  setAlreadyWatchedHandler(callback) {
    this._callback.onAlreadyWatchedClick = callback;
    this.getElement().querySelector('#watched').addEventListener('click', this._clickAlreadyWatchedHandler);
  }

  setAddToFavoritesHandler(callback) {
    this._callback.onAddToFavoritesClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('click', this._clickAddToFavoritesHandler);
  }

  static parseMovieToData(movie, comments) {
    const data = Object.assign({}, {
      comments: comments,
      userDetails: movie.userDetails,
      isComments: (comments.length !== 0),
      newComment: NewComment,
    });

    return data;
  }

  static parseDataToMovie(data) {
    data = JSON.parse(JSON.stringify(data));
    delete data.isComments;
    return data;
  }

  reset(movie, comments) {
    this.updateData(Popup.parseMovieToData(movie, comments));
  }

  getTemplate() {
    return createPopupTemplate(this._data, this._movie);
  }

  getData() {
    return this._data;
  }

  getLocalComment() {
    return this._data.newComment;
  }

  restore(prevData) {
    this.updateData({
      newComment: Object.assign({},
        this._data.newComment,
        prevData.newComment,
      ),
    });
  }
}
