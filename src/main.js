import SortView from './view/sort.js';
import FooterStatisticView from './view/footer-statistic.js';
import HeaderProfileView from './view/header-profile.js';
import NavigationView from './view/main-navigation.js';
import { generateMovie } from './mock/movie.js';
import { render } from './utils/render.js';
import {
  RenderPosition,
  CardCount,
} from './const.js';
import MovieList from './presenter/movie-list.js';


const movies = new Array(CardCount.GENERAL).fill().map(generateMovie);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const MoviePresenter = new MovieList(siteMainElement, siteFooterElement);

render(siteHeaderElement, new HeaderProfileView(movies), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationView(movies), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);

MoviePresenter.init(movies);

render(siteFooterElement, new FooterStatisticView(movies.length), RenderPosition.BEFOREEND);
