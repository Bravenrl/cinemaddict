export const Emoji = {
  smile: './images/emoji/smile.png',
  sleeping: './images/emoji/sleeping.png',
  puke: './images/emoji/puke.png',
  angry: './images/emoji/angry.png',
};

export const ProfileRank = {
  novice: {from: 1,
    to: 10,
  },
  fan: {from: 11,
    to: 20,
  },
  movieBuff: {from: 21,
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
  ALL: 'All movies',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED : 'Most commented',
};

export const ListTitle = {
  ALL_MOVIES: 'All movies. Upcoming',
  EMPTY: 'There are no movies in our database',
  LOADING: 'Loading...',
};

export const CssClass = {
  SECTION: 'films-list--extra',
  HEADING: 'visually-hidden',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  SHOW: 'SHOW',
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
  POPUP: 'POPUP',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorites',
};

export const ListEmptyTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITE]: 'There are no favorite movies now',
};


