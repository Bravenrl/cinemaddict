import {createProfileTemplate} from './view/header-profile.js';
import {createNavigationTemplate} from './view/main-navigation.js';
import {createSortTemplate} from './view/sort.js';
import {createListTemplate} from './view/list.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createCardTemplate} from './view/list-card.js';
import {createListExtraTemplate} from './view/list-extra.js';
import { createFooterStatisticTemplate } from './view/footer-statistic.js';
import {createPopupTemplate} from './view/popup.js';
import { generateMovie } from './mock/movie.js';
import { compareTotalRating } from './utils.js';
import { compareComments } from './utils.js';


const GENERAL_CARD_COUNT = 20;
const GENERAL_CARD_COUNT_PER_STEP = 5;
const ADDITION_CARD_COUNT = 2;
const TITLE_TOP_RATED = 'Top rated';
const TITLE_MOST_COMMENTED = 'Most commented';

const movies = new Array(GENERAL_CARD_COUNT).fill().map(generateMovie);
const topRaited = movies.slice().sort(compareTotalRating);
const mostCommented = movies.slice().sort(compareComments);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createProfileTemplate(movies), 'beforeend');
render(siteMainElement, createNavigationTemplate(movies), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createListTemplate(), 'beforeend');

const siteFilmsElement = siteMainElement.querySelector('.films');
const generalListContainer = siteFilmsElement.querySelector('.films-list__container');


for (let i = 0; i < Math.min(movies.length, GENERAL_CARD_COUNT_PER_STEP); i++) {
  render(generalListContainer, createCardTemplate(movies[i]), 'beforeend');
}

if (movies.length > GENERAL_CARD_COUNT_PER_STEP) {
  let renderedMovieCount = GENERAL_CARD_COUNT_PER_STEP;

  render(siteFilmsElement, createShowMoreButtonTemplate(), 'beforeend');

  const showMoreButton = siteFilmsElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMovieCount, renderedMovieCount + GENERAL_CARD_COUNT_PER_STEP)
      .forEach((movie) => render(generalListContainer, createCardTemplate(movie), 'beforeend'));

    renderedMovieCount += GENERAL_CARD_COUNT_PER_STEP;

    if (renderedMovieCount >= movies.length) {
      showMoreButton.remove();
    }
  });
}

render(siteFilmsElement, createListExtraTemplate(TITLE_TOP_RATED), 'beforeend');
render(siteFilmsElement, createListExtraTemplate(TITLE_MOST_COMMENTED), 'beforeend');


const extraListContainers = siteFilmsElement.querySelectorAll('.films-list--extra');
extraListContainers.forEach((container) => {
  const cardContainer = container.querySelector('.films-list__container');
  const cardTitle = container.querySelector('.films-list__title');
  for (let i = 0; i < ADDITION_CARD_COUNT; i++) {
    if (cardTitle.textContent==='Top rated') {
      render(cardContainer, createCardTemplate(topRaited[i]), 'beforeend');
    } else {render(cardContainer, createCardTemplate(mostCommented[i]), 'beforeend');}
  }
});


render(siteFooterElement, createFooterStatisticTemplate(movies.length), 'beforeend');
render(siteFooterElement, createPopupTemplate(movies[0]), 'beforeend');


