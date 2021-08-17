import Abstract from './absrtact';
import { humanizeMovieTime } from '../utils/movie.js';
import { Emoji } from '../const.js';
import { getCommentDate } from '../utils/movie.js';
import { getReleaseDate } from '../utils/movie.js';


const isActive = (details) => {
  if (details) {return 'film-details__control-button--active';
  } else {return '';}
};

const createGenresTemplate = (genres) => (
  `<tr class="film-details__row">
   <td class="film-details__term">${(genres.length>1)? 'Genres' : 'Genre'}</td>
   <td class="film-details__cell">
        ${genres.map((genre) =>
    `<span class="film-details__genre">${genre}</span>`).join('')}
    </tr>
    `);

const createCommentsTemplate = (comments) => (`
        ${comments.map((comment) =>
    `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src=${Emoji[comment.emotion]} width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${getCommentDate(comment.date)}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>
          `).join('')}
          `);

const createPopupTemplate = (movie) => {
  const {comments, filmInfo,  userDetails} = movie;

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
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
        ${createCommentsTemplate(comments)}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class Popup extends Abstract {
  constructor(movie) {
    super();
    this._movie = movie;
    this._clickCloseButtonHandler = this._clickCloseButtonHandler.bind(this);
    this._clickAddToWatchlistHandler = this._clickAddToWatchlistHandler.bind(this);
    this._clickAlreadyWatchedHandler = this._clickAlreadyWatchedHandler.bind(this);
    this._clickAddToFavoritesHandler = this._clickAddToFavoritesHandler.bind(this);
  }

  _clickCloseButtonHandler(evt) {
    evt.preventDefault();
    this._callback.onCloseButtonClick();
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

  getTemplate () {
    return createPopupTemplate(this._movie);
  }
}
