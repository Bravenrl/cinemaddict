import FooterStatisticView from './view/footer-statistic.js';
import HeaderProfileView from './view/header-profile.js';
import NavigationView from './view/main-navigation.js';
import MoviesModel from './model/movie.js';
import CommentsModel from './model/comments.js';
import { generateMovie } from './mock/movie.js';
import { generateComments } from './mock/comment.js';
import { render } from './utils/render.js';
import {
  RenderPosition,
  CardCount
} from './const.js';
import MovieList from './presenter/movie-list.js';


const movies = new Array(CardCount.GENERAL).fill().map(generateMovie);
const comments = new Array(CardCount.GENERAL).fill().map(generateComments);
movies.forEach((movie) => movie.comments = comments[movie.id].map((comment) => comment.id));

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
moviesModel.movies = movies;
commentsModel.comments = comments;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');

const MoviePresenter = new MovieList(siteMainElement, siteBodyElement, moviesModel, commentsModel);

render(siteHeaderElement, new HeaderProfileView(movies), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationView(movies), RenderPosition.BEFOREEND);

MoviePresenter.init();

render(siteFooterElement, new FooterStatisticView(movies.length), RenderPosition.BEFOREEND);
