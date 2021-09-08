import AbstractObserver from '../utils/abstract-observer.js';

export default class Movies extends AbstractObserver {
  constructor() {
    super();
    this._movies = [];
  }

  getMovies() {
    return this._movies;
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();

    this._notify(updateType);
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(movie) {
    const filmInfo = Object.assign(
      {},
      movie['film_info'],
      {
        totalRating: movie['film_info']['total_rating'],
        release: {
          date: movie['film_info']['release']['date'],
          releaseCountry: movie['film_info']['release']['release_country'],
        },
        ageRating: movie['film_info']['age_rating'],
        alternativeTitle: movie['film_info']['alternative_title'],
      },
    );
    delete filmInfo['total_rating'];
    delete filmInfo['age_rating'];
    delete filmInfo['alternative_title'];

    const userDetails = Object.assign(
      {},
      movie['user_details'],
      {
        alreadyWatched: movie['user_details']['already_watched'],
        watchingDate: movie['user_details']['watching_date'],
      },
    );
    delete userDetails['already_watched'];
    delete userDetails['watching_date'];

    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        filmInfo: filmInfo,
        userDetails: userDetails,
      },
    );
    delete adaptedMovie['film_info'];
    delete adaptedMovie['user_details'];
    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const filmInfo = Object.assign(
      {},
      movie.filmInfo,
      {
        'total_rating': movie.filmInfo.totalRating,
        release: {
          date: movie.filmInfo.release.date,
          'release_country': movie.filmInfo.release.releaseCountry,
        },
        'age_rating': movie.filmInfo.ageRating,
        'alternative_title': movie.filmInfo.alternativeTitle,
      },
    );
    delete filmInfo.totalRating;
    delete filmInfo.ageRating;
    delete filmInfo.alternativeTitle;

    const userDetails = Object.assign(
      {},
      movie.userDetails,
      {
        'already_watched': movie.userDetails.alreadyWatched,
        'watching_date': movie.userDetails.watchingDate,
      },
    );
    delete userDetails.alreadyWatched;
    delete userDetails.watchingDate;

    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        'film_info': filmInfo,
        'user_details': userDetails,
      },
    );
    delete adaptedMovie.filmInfo;
    delete adaptedMovie.userDetails;
    return adaptedMovie;
  }

}
