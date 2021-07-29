import {createProfileTemplate} from './view/header-profile.js';
import {createNavigationTemplate} from './view/main-navigation.js';
import {createSortTemplate} from './view/sort.js';
import {createListTemplate} from './view/list.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createCardTemplate} from './view/list-card.js';
import {createListTopTemplate} from './view/list-top-rated.js';
import {createListMostTemplate} from './view/list-most-commented.js';
import {createPopupTemplate} from './view/popup.js';

const GENERAL_CARD_COUNT = 5;
const ADDITION_CARD_COUNT = 2;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createProfileTemplate(), 'beforeend');
render(siteMainElement, createNavigationTemplate(), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createListTemplate(), 'beforeend');

const siteFilmsElement = siteMainElement.querySelector('.films');
const generalListContainer = siteFilmsElement.querySelector('.films-list__container');

render(siteFilmsElement, createShowMoreButtonTemplate(), 'beforeend');

for (let i = 0; i < GENERAL_CARD_COUNT; i++) {
  render(generalListContainer, createCardTemplate(), 'beforeend');
}

render(siteFilmsElement, createListTopTemplate(), 'beforeend');
render(siteFilmsElement, createListMostTemplate(), 'beforeend');

const extraListContainers = siteFilmsElement.querySelectorAll('.films-list--extra');
extraListContainers.forEach((container) => {
  const cardContainer = container.querySelector('.films-list__container');
  for (let i = 0; i < ADDITION_CARD_COUNT; i++) {
    render(cardContainer, createCardTemplate(), 'beforeend');
  }
});

render(siteFooterElement, createPopupTemplate(), 'beforeend');
