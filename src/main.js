import StatisticView from './view/statistic.js';
import FooterStatisticView from './view/footer-statistic.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import CommentsModel from './model/comments.js';
import {
  generateMovie
} from './mock/movie.js';
import {
  allComments
} from './mock/comment.js';
import {
  render,
  remove
} from './utils/render.js';
import {
  RenderPosition,
  CardCount,
  FilterType
} from './const.js';
import MovieListPresenter from './presenter/movie-list.js';
import FilterNavigationPresenter from './presenter/filter.js';
import HeaderBordPresenter from './presenter/header.js';


const movies = new Array(CardCount.GENERAL).fill().map(generateMovie);

movies.forEach((movie) => movie.comments = allComments[movie.id].map((comment) => comment.id));

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
moviesModel.movies = movies;
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');

const moviePresenter = new MovieListPresenter(siteMainElement, siteBodyElement, moviesModel, filterModel, commentsModel);
const headerBordPresenter = new HeaderBordPresenter(siteHeaderElement, moviesModel);

headerBordPresenter.init();

moviePresenter.init();


let statisticsComponent = null;
const handleSiteMenuClick = (target) => {
  if (target === FilterType.STATS) {
    if (statisticsComponent!==null) {
      return;
    }
    statisticsComponent = new StatisticView(moviesModel.movies);
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
filterPresenter.init();
render(siteFooterElement, new FooterStatisticView(movies.length), RenderPosition.BEFOREEND);
