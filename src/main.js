import FooterStatisticView from './view/footer-statistic.js';
import HeaderProfileView from './view/header-profile.js';
import MoviesModel from './model/movies.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import { generateMovie } from './mock/movie.js';
import { generateComments } from './mock/comment.js';
import { render } from './utils/render.js';
import {
  RenderPosition,
  CardCount
} from './const.js';
import MovieListPresenter from './presenter/movie-list.js';
import FilterNavigationPresenter from './presenter/filter.js';


const movies = new Array(CardCount.GENERAL).fill().map(generateMovie);
const comments = new Array(CardCount.GENERAL).fill().map(generateComments);
movies.forEach((movie) => movie.comments = comments[movie.id].map((comment) => comment.id));

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
moviesModel.movies = movies;
commentsModel.comments = comments;
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');

const moviePresenter = new MovieListPresenter(siteMainElement, siteBodyElement, moviesModel, commentsModel, filterModel);
const filterPresenter = new FilterNavigationPresenter(siteMainElement, filterModel, moviesModel);

render(siteHeaderElement, new HeaderProfileView(movies), RenderPosition.BEFOREEND);

filterPresenter.init();

moviePresenter.init();

render(siteFooterElement, new FooterStatisticView(movies.length), RenderPosition.BEFOREEND);
