export const AUTHORIZATION = 'Basic QnJhdmVuOjEyMzQ1';
export const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
export const SHAKE_ANIMATION_TIMEOUT = 600;
const STORE_PREFIX = 'cinemaddict';
const STORE_VER = 'v15';
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export const Emoji = {
  smile: './images/emoji/smile.png',
  sleeping: './images/emoji/sleeping.png',
  puke: './images/emoji/puke.png',
  angry: './images/emoji/angry.png',
};

export const ProfileRank = {
  novice: {
    rank: 'novice',
    from: 1,
    to: 10,
  },
  fan: {
    rank: 'fan',
    from: 11,
    to: 20,
  },
  movieBuff: {
    rank: 'movieBuff',
    from: 21,
    to: Infinity,
  },
};

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  BEFOREBEGIN: 'beforebegin',
};

export const CardCount = {
  GENERAL: 20,
  GENERAL_PER_STEP: 5,
  ADDITION: 2,
};

export const CardTitle = {
  ALL: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED : 'Most commented',
  LOADING: 'Loading...',
  EMPTY: 'Empty',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  SHOW: 'SHOW',
  INIT: 'INIT',
};

export const SortType = {
  DEFAULT: 'default',
  RATING: 'rank',
  DATE: 'date',
};

export const SortText = {
  DEFAULT: 'Sort by default',
  RATING: 'Sort by rating',
  DATE: 'Sort by date',
};

export const NewComment = {
  isEmoji: false,
  emotion: '',
  comment: '',
};

export const UserAction = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  PATCH_POPUP: 'PATCH_POPUP',
  MINOR: 'MINOR',
  MINOR_POPUP: 'MINOR_POPUP',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  INIT_POPUP: 'INIT_POPUP',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorites',
  STATS: 'Stats',
};

export const ListEmptyTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITE]: 'There are no favorite movies now',
};

export const DurationType = {
  HOURS: 'hours',
  MINUTES: 'minutes',
};

export const DateType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  LOAD_ERR: 'LOAD_ERR',
};


