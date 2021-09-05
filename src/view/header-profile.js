import Abstract from './absrtact.js';
import { getRating } from '../utils/stats.js';

const createProfileTemplate = (movies) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getRating(movies)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class HeaderProfile extends Abstract {
  constructor(movies) {
    super();
    this._movies = movies;
  }

  getTemplate () {
    return createProfileTemplate(this._movies);
  }
}
