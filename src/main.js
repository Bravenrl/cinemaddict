import ListView from './view/list.js';
import FilmsView from './view/films.js';
import SortView from './view/sort.js';
import FooterStatisticView from './view/footer-statistic.js';
import HeaderProfileView from './view/header-profile.js';
import ListExtraView from './view/list-extra.js';
import NavigationView from './view/main-navigation.js';
import ShowMoreButtonView from './view/show-more-button.js';
import MovieCardView from './view/list-card.js';
import PopupView from './view/popup.js';
import ListContainerView from './view/list-container.js';
import { generateMovie } from './mock/movie.js';
import { RenderPosition, GENERAL_CARD_COUNT, GENERAL_CARD_COUNT_PER_STEP,
  ADDITION_CARD_COUNT, TITLE_MOST_COMMENTED, TITLE_TOP_RATED} from './const.js';
import { compareTotalRating, compareComments, render } from './utils.js';


const movies = new Array(GENERAL_CARD_COUNT).fill().map(generateMovie);
const topRaited = movies.slice().sort(compareTotalRating);
const mostCommented = movies.slice().sort(compareComments);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');


render(siteHeaderElement, new HeaderProfileView(movies).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationView(movies).getElement(), RenderPosition.BEFOREEND);

render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);

const filmsComponent = new FilmsView();
render(siteMainElement, filmsComponent.getElement(), RenderPosition.BEFOREEND);
render(filmsComponent.getElement(), new ListView().getElement(), RenderPosition.AFTERBEGIN);


const generalContainerComponent = new ListContainerView();
render(filmsComponent.getElement(), generalContainerComponent.getElement(), RenderPosition.BEFOREEND);
for (let i = 0; i < Math.min(movies.length, GENERAL_CARD_COUNT_PER_STEP); i++) {
  render(generalContainerComponent.getElement(), new MovieCardView(movies[i]).getElement(), RenderPosition.BEFOREEND);
}

if (movies.length > GENERAL_CARD_COUNT_PER_STEP) {
  let renderedMovieCount = GENERAL_CARD_COUNT_PER_STEP;
  const showMoreButtonComponent = new ShowMoreButtonView();
  render(filmsComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
  showMoreButtonComponent.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMovieCount, renderedMovieCount + GENERAL_CARD_COUNT_PER_STEP)
      .forEach((movie) => render(generalContainerComponent.getElement(), new MovieCardView(movie).getElement(), RenderPosition.BEFOREEND));
    renderedMovieCount += GENERAL_CARD_COUNT_PER_STEP;
    if (renderedMovieCount >= movies.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

const listTopRated = new ListExtraView(TITLE_TOP_RATED);
render(filmsComponent.getElement(), listTopRated.getElement(), RenderPosition.BEFOREEND);
const topContainerComponent = new ListContainerView();
render(listTopRated.getElement(), topContainerComponent.getElement(), RenderPosition.BEFOREEND);
for (let i = 0; i < ADDITION_CARD_COUNT; i++) {
  render(topContainerComponent.getElement(), new MovieCardView(topRaited[i]).getElement(), RenderPosition.BEFOREEND);
}

const listMostCommented = new ListExtraView(TITLE_MOST_COMMENTED);
render(filmsComponent.getElement(), listMostCommented.getElement(), RenderPosition.BEFOREEND);
const mostContainerComponent = new ListContainerView();
render(listMostCommented.getElement(), mostContainerComponent.getElement(), RenderPosition.BEFOREEND);
for (let i = 0; i < ADDITION_CARD_COUNT; i++) {
  render(mostContainerComponent.getElement(), new MovieCardView(mostCommented[i]).getElement(), RenderPosition.BEFOREEND);
}


render(siteFooterElement, new FooterStatisticView(movies.length).getElement(), RenderPosition.BEFOREEND);
render(siteFooterElement, new PopupView(movies[0]).getElement(), RenderPosition.BEFOREEND);
