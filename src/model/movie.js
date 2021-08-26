import AbstractObserver from '../utils/abstract-observer.js';

export default class Movies extends AbstractObserver {
  constructor() {
    super();
    this._movies = [];
  }

  get movies() {
    return this._movies;
  }

  set movies(movies) {
    this._movies = movies.slice();
  }

}
