import MovieCard from './movie.js';
import ListView from '../view/list.js';
import FilmsView from '../view/films.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import SortView from '../view/sort.js';
import { compareTotalRating, compareComments, compareDate } from '../utils/movie.js';
import { render, remove } from '../utils/render.js';
import {
  RenderPosition,
  ExtraCardTitle,
  CardCount,
  ListTitle,
  CssClass,
  SortType
} from '../const.js';
import { updateItem } from '../utils/common.js';

export default class MovieList {
  constructor (listContainer, popupContainer) {
    this._movieCardPresenter = new Map ();
    this._movieTopCardPresenter = new Map ();
    this._movieCommentCardPresenter = new Map ();

    this._movieBoardContainer = listContainer;
    this._popupContainer = popupContainer;
    this._renderedCounter = CardCount.GENERAL_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._movieBoardComponent = new FilmsView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._listComponent = new ListView(ListTitle.ALL_MOVIES, CssClass.HEADING);
    this._listTopRatedComponent = new ListView(ExtraCardTitle.TOP_RATED,'',CssClass.SECTION);
    this._listMostCommentedComponent = new ListView(ExtraCardTitle.MOST_COMMENTED,'',CssClass.SECTION);
    this._lostComponentEmpty = new ListView(ListTitle.EMPTY);

    this._handleUpdateCard = this._handleUpdateCard.bind(this);
    this._handleChangeMode = this._handleChangeMode.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortMovies = this._handleSortMovies.bind(this);
  }

  init(movies) {
    this._movies = movies.slice();
    this._sourcedMovies = movies.slice();

    this._renderSort();
    render(this._movieBoardContainer, this._movieBoardComponent, RenderPosition.BEFOREEND);
    this._renderList();
    this._renderListTopRaited();
    this._renderListMostComment();
  }

  _handleUpdateCard (updatedMovie) {
    this._movies = updateItem(this._movies, updatedMovie);
    this._sourcedMovies = updateItem(this._sourcedMovies, updatedMovie);
    if (this._movieCardPresenter.has(updatedMovie.id)) {
      this._movieCardPresenter.get(updatedMovie.id).init(updatedMovie);
    }
    if (this._movieTopCardPresenter.has(updatedMovie.id)) {
      this._movieTopCardPresenter.get(updatedMovie.id).init(updatedMovie);
    }
    if (this._movieCommentCardPresenter.has(updatedMovie.id)) {
      this._movieCommentCardPresenter.get(updatedMovie.id).init(updatedMovie);
    }
  }

  _handleChangeMode() {
    this._movieCardPresenter.forEach((presenter) => presenter.resetPopup());
    this._movieTopCardPresenter.forEach((presenter) => presenter.resetPopup());
    this._movieCommentCardPresenter.forEach((presenter) => presenter.resetPopup());
    document.body.classList.add('hide-overflow');
  }

  _handleShowMoreButtonClick () {
    this._renderCards (this._listComponent, this._movies, this._renderedCounter, this._renderedCounter+CardCount.GENERAL_PER_STEP);
    this._renderedCounter += CardCount.GENERAL_PER_STEP;
    if (this._renderedCounter >= this._movies.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleSortMovies(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortMovies(sortType);
    this._clearList();
    this._renderList();
  }

  _sortMovies(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._movies.sort(compareDate);
        break;
      case SortType.RATING:
        this._movies.sort(compareTotalRating);
        break;
      default:
        this._movies = this._sourcedMovies.slice();
        break;
    }
    this._currentSortType = sortType;
  }

  _renderSort() {
    render(this._movieBoardContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortChangeHandler(this._handleSortMovies);

  }

  _renderMovieCard (container, movie) {
    if (container === this._listComponent) {
      const movieCardPresenter = new MovieCard (container, this._popupContainer, this._handleUpdateCard, this._handleChangeMode);
      movieCardPresenter.init(movie);
      this._movieCardPresenter.set(movie.id, movieCardPresenter);
    }
    if (container === this._listMostCommentedComponent) {
      const movieCommentCardPresenter = new MovieCard (container, this._popupContainer, this._handleUpdateCard, this._handleChangeMode);
      movieCommentCardPresenter.init(movie);
      this._movieCommentCardPresenter.set(movie.id, movieCommentCardPresenter);
    }
    if (container === this._listTopRatedComponent) {
      const movieTopCardPresenter = new MovieCard (container, this._popupContainer, this._handleUpdateCard, this._handleChangeMode);
      movieTopCardPresenter.init(movie);
      this._movieTopCardPresenter.set(movie.id, movieTopCardPresenter);
    }

  }

  _renderCards (container, movies, from, to) {
    movies
      .slice(from, to)
      .forEach((movie) => this._renderMovieCard(container, movie));
  }


  _renderShowMoreButton () {
    render(this._listComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderListNoMovies () {
    render(this._movieBoardComponent, this._lostComponentEmpty, RenderPosition.AFTERBEGIN);
  }

  _clearList() {
    this._movieCardPresenter.forEach((presenter) => presenter.destroy());
    this._movieCardPresenter.clear();
    this._renderedCounter = CardCount.GENERAL_PER_STEP;
    remove(this._showMoreButtonComponent);
    document.body.classList.remove('hide-overflow');
  }

  _renderList () {
    if (this._movies.length === 0) {
      this._renderListNoMovies();
      return;
    }
    render(this._movieBoardComponent, this._listComponent, RenderPosition.AFTERBEGIN);
    this._renderCards(this._listComponent, this._movies, 0, Math.min(this._movies.length, CardCount.GENERAL_PER_STEP));
    if (this._movies.length > CardCount.GENERAL_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderListTopRaited () {
    this._moviesTopRaited = this._movies.slice().sort(compareTotalRating);
    if (this._moviesTopRaited[0].filmInfo.totalRating !== 0) {
      render(this._movieBoardComponent, this._listTopRatedComponent, RenderPosition.BEFOREEND);
      this._renderCards (this._listTopRatedComponent, this._moviesTopRaited, 0, Math.min(this._moviesTopRaited.length, CardCount.ADDITION));
    }
  }

  _renderListMostComment () {
    this._moviesMostCommented = this._movies.slice().sort(compareComments);

    if (this._moviesMostCommented[0].comments.length !== 0) {
      render(this._movieBoardComponent, this._listMostCommentedComponent, RenderPosition.BEFOREEND);
      this._renderCards (this._listMostCommentedComponent, this._moviesMostCommented, 0, Math.min(this._moviesMostCommented.length, CardCount.ADDITION));
    }
  }

}
