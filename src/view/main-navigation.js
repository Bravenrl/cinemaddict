
const getHistoryCount = (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched).length;
const getWatchlistCount = (movies) => movies.filter((movie) => movie.userDetails.watchlist).length;
const getFavoritesCount = (movies) => movies.filter((movie) => movie.userDetails.favorite).length;

export const createNavigationTemplate = (movies) => (
  `<nav class="main-navigation">
      <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${getWatchlistCount(movies)}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${getHistoryCount(movies)}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${getFavoritesCount(movies)}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);
