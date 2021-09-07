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
  Structure,
  UpdateType
} from './const.js';
import MovieListPresenter from './presenter/movie-list.js';
import FilterNavigationPresenter from './presenter/filter.js';
import HeaderBordPresenter from './presenter/header-footer';
import Api from './api.js';


const moviesApi = new Api(END_POINT, AUTHORIZATION, Structure.MOVIES, MoviesModel);
const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');

const moviePresenter = new MovieListPresenter(siteMainElement, siteBodyElement, moviesModel, filterModel, commentsModel);
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

moviesApi.getData()
  .then((data) => {
    moviesModel.setMovies(UpdateType.INIT, data);
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
  });

