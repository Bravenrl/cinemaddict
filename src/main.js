import ListView from './view/list.js';
import FilmsView from './view/films.js';
import SortView from './view/sort.js';
import FooterStatisticView from './view/footer-statistic.js';
import HeaderProfileView from './view/header-profile.js';
import NavigationView from './view/main-navigation.js';
import ShowMoreButtonView from './view/show-more-button.js';
import MovieCardView from './view/list-card.js';
import PopupView from './view/popup.js';
import {
  generateMovie
} from './mock/movie.js';
import {
  RenderPosition,
  ExtraCardTitle,
  CardCount,
  ListTitle,
  CssClass
} from './const.js';
import {
  compareTotalRating,
  compareComments,
  render
} from './utils.js';


const movies = new Array(CardCount.GENERAL).fill().map(generateMovie);
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

const renderMovieCard = (element, movie) => {
  const movieCardComponent = new MovieCardView(movie);
  const popupComponent = new PopupView(movie);
  render(element, movieCardComponent.getElement(), RenderPosition.BEFOREEND);

  const showPopup = () => {
    const popup = siteFooterElement.querySelector('.film-details');
    if (siteFooterElement.contains(popup)) {
      popup.remove();
      siteFooterElement.appendChild(popupComponent.getElement());
      return;
    }
    document.body.classList.add('hide-overflow');
    siteFooterElement.appendChild(popupComponent.getElement());
  };
  const hidePopup = () => {
    document.body.classList.remove('hide-overflow');
    siteFooterElement.removeChild(popupComponent.getElement());
  };

  movieCardComponent.getElement().querySelector('.film-card__poster').
    addEventListener('click', showPopup);
  movieCardComponent.getElement().querySelector('.film-card__title').
    addEventListener('click', showPopup);
  movieCardComponent.getElement().querySelector('.film-card__comments').
    addEventListener('click', showPopup);
  popupComponent.getElement().querySelector('.film-details__close-btn').
    addEventListener('click', hidePopup);
};

const renderList = (element, allMovies) => {
  const containerElement = element.querySelector('.films-list__container');
  allMovies
    .slice(0, Math.min(allMovies.length, CardCount.GENERAL_PER_STEP))
    .forEach((movie) => renderMovieCard(containerElement, movie));

  if (allMovies.length > CardCount.GENERAL_PER_STEP) {
    let renderedMovieCount = CardCount.GENERAL_PER_STEP;
    const showMoreButtonComponent = new ShowMoreButtonView();
    render(element, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    showMoreButtonComponent.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();
      allMovies
        .slice(renderedMovieCount, renderedMovieCount + CardCount.GENERAL_PER_STEP)
        .forEach((movie) => render(containerElement, new MovieCardView(movie).getElement(), RenderPosition.BEFOREEND));
      renderedMovieCount += CardCount.GENERAL_PER_STEP;
      if (renderedMovieCount >= allMovies.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }
};

const renderListExtra = (element, title, extraMovies) => {
  const listTopRated = new ListView(title,'',CssClass.SECTION);
  render(element, listTopRated.getElement(), RenderPosition.BEFOREEND);
  const extraContainerElement = listTopRated.getElement().querySelector('.films-list__container');
  extraMovies
    .slice(0, Math.min(extraMovies.length, CardCount.ADDITION))
    .forEach((extraMovie) => renderMovieCard(extraContainerElement, extraMovie));
};

const renderListComponent = (allMovies) => {
  if (movies.length !== 0) {
    const listComponent = new ListView(ListTitle.ALL_MOVIES, CssClass.HEADING);
    render(filmsComponent.getElement(), listComponent.getElement(), RenderPosition.AFTERBEGIN);
    renderList(listComponent.getElement(), allMovies);
    return;
  }
  render(filmsComponent.getElement(), new ListView(ListTitle.EMPTY).getElement(), RenderPosition.AFTERBEGIN);
};

renderListComponent(movies);

if (topRaited[0].filmInfo.totalRating !== 0) {
  renderListExtra(filmsComponent.getElement(), ExtraCardTitle.TOP_RATED, topRaited);
}

if (mostCommented[0].comments.length !== 0) {
  renderListExtra(filmsComponent.getElement(), ExtraCardTitle.MOST_COMMENTED, mostCommented);
}


render(siteFooterElement, new FooterStatisticView(movies.length).getElement(), RenderPosition.BEFOREEND);
