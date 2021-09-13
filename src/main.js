import StatisticView from './view/statistic.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import CommentsModel from './model/comments.js';
import {
  render,
  remove
} from './utils/render.js';
import {
  RenderPosition,
  FilterType,
  AUTHORIZATION,
  END_POINT,
  UpdateType,
  STORE_NAME
} from './const.js';
import MovieListPresenter from './presenter/movie-list.js';
import FilterNavigationPresenter from './presenter/filter.js';
import HeaderBordPresenter from './presenter/header-footer';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';


const moviesApi = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(moviesApi, store);
const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');

const moviePresenter = new MovieListPresenter(siteMainElement, siteBodyElement, moviesModel, filterModel, commentsModel, apiWithProvider);
const headerFooterPresenter = new HeaderBordPresenter(siteHeaderElement, siteFooterElement, moviesModel);

let statisticsComponent = null;
const handleSiteMenuClick = (target) => {
  if (target === FilterType.STATS) {
    if (statisticsComponent!==null) {
      return;
    }
    statisticsComponent = new StatisticView(moviesModel.getMovies());
    moviePresenter.destroy();
    render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
    return;
  }
  moviePresenter.init();
  if (statisticsComponent!==null) {
    remove(statisticsComponent);
  }
  statisticsComponent=null;
};
const filterPresenter = new FilterNavigationPresenter(siteMainElement, filterModel, moviesModel, handleSiteMenuClick);

headerFooterPresenter.init();
filterPresenter.init();
moviePresenter.init();

apiWithProvider.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
