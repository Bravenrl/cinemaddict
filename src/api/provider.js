import MoviesModel from '../model/movies.js';
import { isOnline, createStoreStructure } from '../utils/common.js';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSyncNeed = false;
    this._syncMovies = new Map();
  }

  get isSyncNeed() {
    return this._isSyncNeed;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptToServer));
          this._store.setItems(items);
          return movies;
        });
    }
    const storeMovies = Object.values(this._store.getItems());
    return Promise.resolve(storeMovies.map(MoviesModel.adaptToClient));
  }

  getComments(movieId) {
    if (isOnline()) {
      return this._api.getComments(movieId);
    }
    return Promise.reject(new Error('Get comments failed'));
  }

  updateMovie(movie) {
    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._store.setItem(updatedMovie.id, MoviesModel.adaptToServer(updatedMovie));
          return updatedMovie;
        });
    }
    this._isSyncNeed = true;
    this._store.setItem(movie.id, MoviesModel.adaptToServer(Object.assign({}, movie)));
    this._syncMovies.set(movie.id, movie);
    return Promise.resolve(movie);
  }

  addComment(movieId, comment) {
    if (isOnline()) {
      return this._api.addComment(movieId, comment)
        .then((response) => {
          this._store.setItem(response.movie.id, MoviesModel.adaptToServer(response.movie));
          return response;
        });
    }
    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(comment) {
    if (isOnline()) {
      return this._api.deleteComment(comment);
    }
    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const moviesToSync = Array.from(this._syncMovies.values());
      return this._api.sync(moviesToSync)
        .then((response) => {
          response.updated.forEach((item) => this._store.setItem(item.id, Object.assign({}, item)));
          this._syncMovies.clear();
        });
    }
    return Promise.reject(new Error('Sync data failed'));
  }
}


