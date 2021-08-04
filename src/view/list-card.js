import { humanizeMovieTime } from '../utils.js';
import { getYear } from '../utils.js';

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

export const createCardTemplate = (movie) => {
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
