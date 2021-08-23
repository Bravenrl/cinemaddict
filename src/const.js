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
};

export const CardCount = {
  GENERAL: 20,
  GENERAL_PER_STEP: 5,
  ADDITION: 2,
};

export const ExtraCardTitle = {
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

export const NewComment = {
  isEmoji: false,
  emoji: '',
  comment: '',
};

