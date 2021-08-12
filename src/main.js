import ListView from './view/list.js';
import FilmsView from './view/films.js';
import SortView from './view/sort.js';
import FooterStatisticView from './view/footer-statistic.js';
import HeaderProfileView from './view/header-profile.js';
import NavigationView from './view/main-navigation.js';
import ShowMoreButtonView from './view/show-more-button.js';
import MovieCardView from './view/movie-card.js';
import PopupView from './view/popup.js';
import { generateMovie } from './mock/movie.js';
import { compareTotalRating, compareComments, isEscEvent } from './utils/movie.js';
import { render, remove, showPopup, hidePopup } from './utils/render.js';
import {
  RenderPosition,
  ExtraCardTitle,
  CardCount,
  ListTitle,
  CssClass
} from './const.js';

const movies = new Array(CardCount.GENERAL).fill().map(generateMovie);
const topRaited = movies.slice().sort(compareTotalRating);
const mostCommented = movies.slice().sort(compareComments);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');


render(siteHeaderElement, new HeaderProfileView(movies), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationView(movies), RenderPosition.BEFOREEND);

render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);

const filmsComponent = new FilmsView();
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);

const renderMovieCard = (element, movie) => {
  const movieCardComponent = new MovieCardView(movie);
  render(element, movieCardComponent, RenderPosition.BEFOREEND);

  movieCardComponent.setClickHandler(() => {
    const popupComponent = new PopupView(movie);

    const onPopupEscKeydown = (evt) => {
      if (isEscEvent(evt)) {
        evt.preventDefault();
        hidePopup(siteFooterElement, popupComponent);
        document.removeEventListener('keydown', onPopupEscKeydown);
      }
    };

    popupComponent.setClickHandler(() => {
      hidePopup(siteFooterElement, popupComponent);
      document.removeEventListener('keydown', onPopupEscKeydown);
    });

    showPopup(siteFooterElement, popupComponent);
    document.addEventListener('keydown', onPopupEscKeydown);
  });
};

const renderList = (element, allMovies) => {
  const containerElement = element.getListContainer();
  allMovies
    .slice(0, Math.min(allMovies.length, CardCount.GENERAL_PER_STEP))
    .forEach((movie) => renderMovieCard(containerElement, movie));

  if (allMovies.length > CardCount.GENERAL_PER_STEP) {
    let renderedMovieCount = CardCount.GENERAL_PER_STEP;
    const showMoreButtonComponent = new ShowMoreButtonView();
    render(element, showMoreButtonComponent, RenderPosition.BEFOREEND);

    showMoreButtonComponent.setClickHandler(() => {
      allMovies
        .slice(renderedMovieCount, renderedMovieCount + CardCount.GENERAL_PER_STEP)
        .forEach((movie) => renderMovieCard(containerElement, movie));
      renderedMovieCount += CardCount.GENERAL_PER_STEP;
      if (renderedMovieCount >= allMovies.length) {
        remove(showMoreButtonComponent);
      }
    });
  }
};

const renderListExtra = (element, title, extraMovies) => {
  const listTopRated = new ListView(title,'',CssClass.SECTION);
  render(element, listTopRated, RenderPosition.BEFOREEND);
  const extraContainerElement = listTopRated.getListContainer();
  extraMovies
    .slice(0, Math.min(extraMovies.length, CardCount.ADDITION))
    .forEach((extraMovie) => renderMovieCard(extraContainerElement, extraMovie));
};

const renderListComponent = (allMovies) => {
  if (movies.length !== 0) {
    const listComponent = new ListView(ListTitle.ALL_MOVIES, CssClass.HEADING);
    render(filmsComponent, listComponent, RenderPosition.AFTERBEGIN);
    renderList(listComponent, allMovies);
    return;
  }
  render(filmsComponent, new ListView(ListTitle.EMPTY), RenderPosition.AFTERBEGIN);
};

renderListComponent(movies);

if (topRaited[0].filmInfo.totalRating !== 0) {
  renderListExtra(filmsComponent, ExtraCardTitle.TOP_RATED, topRaited);
}

if (mostCommented[0].comments.length !== 0) {
  renderListExtra(filmsComponent, ExtraCardTitle.MOST_COMMENTED, mostCommented);
}


render(siteFooterElement, new FooterStatisticView(movies.length), RenderPosition.BEFOREEND);
