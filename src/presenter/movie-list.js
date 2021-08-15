import ListView from '../view/list.js';
import FilmsView from '../view/films.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import MovieCardView from '../view/movie-card.js';
import PopupView from '../view/popup.js';
import { compareTotalRating, compareComments, isEscEvent } from '../utils/movie.js';
import { render, remove, showPopup, hidePopup } from '../utils/render.js';
import {
  RenderPosition,
  ExtraCardTitle,
  CardCount,
  ListTitle,
  CssClass
} from '../const.js';

export default class MovieList {
  constructor (listContainer, popupContainer) {
    this._movieBoardContainer = listContainer;
    this._popupContainer = popupContainer;
    this._renderedCounter = CardCount.GENERAL_PER_STEP;
    this._movieBoardComponent = new FilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._listComponent = new ListView(ListTitle.ALL_MOVIES, CssClass.HEADING);
    this._listTopRatedComponent = new ListView(ExtraCardTitle.TOP_RATED,'',CssClass.SECTION);
    this._listMostCommentedComponent = new ListView(ExtraCardTitle.MOST_COMMENTED,'',CssClass.SECTION);
    this._lostComponentEmpty = new ListView(ListTitle.EMPTY);
    this._listContainerElement = this._listComponent.getListContainer();
    this._handlerShowMoreButtonClick = this._handlerShowMoreButton.bind(this);
  }

  init(movies) {
    this._movies = movies.slice();
    this._moviesTopRaited = this._movies.slice().sort(compareTotalRating);
    this._moviesMostCommented = this._movies.slice().sort(compareComments);

    render(this._movieBoardContainer, this._movieBoardComponent, RenderPosition.BEFOREEND);
    this._renderList();
    this._renderListTopRaited();
    this._renderListMostComment();
  }

  _renderMovieCard (element, movie) {
    const movieCardComponent = new MovieCardView(movie);
    render(element, movieCardComponent, RenderPosition.BEFOREEND);

    movieCardComponent.setClickHandler(() => {
      const popupComponent = new PopupView(movie);

      const onPopupEscKeydown = (evt) => {
        if (isEscEvent(evt)) {
          evt.preventDefault();
          hidePopup(this._popupContainer, popupComponent);
          document.removeEventListener('keydown', onPopupEscKeydown);
        }
      };

      popupComponent.setClickHandler(() => {
        hidePopup(this._popupContainer, popupComponent);
        document.removeEventListener('keydown', onPopupEscKeydown);
      });

      showPopup(this._popupContainer, popupComponent);
      document.addEventListener('keydown', onPopupEscKeydown);
    });

  }

  _renderCards (container, movies, from, to) {
    movies
      .slice(from, to)
      .forEach((movie) => this._renderMovieCard(container, movie));
  }

  _handlerShowMoreButton () {
    this._renderCards (this._listContainerElement, this._movies, this._renderedCounter, this._renderedCounter+CardCount.GENERAL_PER_STEP);
    this._renderedCounter += CardCount.GENERAL_PER_STEP;
    if (this._renderedCounter >= this._movies.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton () {
    render(this._listComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handlerShowMoreButtonClick);
  }

  _renderListNoMovies () {
    render(this._movieBoardComponent, this._lostComponentEmpty, RenderPosition.AFTERBEGIN);
  }

  _renderList () {
    if (this._movies.length === 0) {
      this._renderListNoMovies();
      return;
    }
    render(this._movieBoardComponent, this._listComponent, RenderPosition.AFTERBEGIN);
    this._renderCards(this._listContainerElement, this._movies, 0, Math.min(this._movies.length, CardCount.GENERAL_PER_STEP));
    if (this._movies.length > CardCount.GENERAL_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderListTopRaited () {
    if (this._moviesTopRaited[0].filmInfo.totalRating !== 0) {
      render(this._movieBoardComponent, this._listTopRatedComponent, RenderPosition.BEFOREEND);
      const extraContainerElement = this._listTopRatedComponent.getListContainer();
      this._renderCards (extraContainerElement, this._moviesTopRaited, 0, Math.min(this._moviesTopRaited.length, CardCount.ADDITION));

    }
  }

  _renderListMostComment () {
    if (this._moviesMostCommented[0].comments.length !== 0) {
      render(this._movieBoardComponent, this._listMostCommentedComponent, RenderPosition.BEFOREEND);
      const extraContainerElement = this._listMostCommentedComponent.getListContainer();
      this._renderCards (extraContainerElement, this._moviesMostCommented, 0, Math.min(this._moviesMostCommented.length, CardCount.ADDITION));
    }
  }

}
