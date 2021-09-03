import { FilterType } from '../const.js';


export const filter = {
  [FilterType.ALL]: (movies) => movies.slice(),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.FAVORITE]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
};


