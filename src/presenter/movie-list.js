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
  SortType,
  UpdateType,
  UserAction
} from '../const.js';


export default class MovieList {
  constructor (listContainer, popupContainer, moviesModel, commentsModel) {
    this._movieCardPresenter = new Map ();
    this._movieTopCardPresenter = new Map ();
    this._movieCommentCardPresenter = new Map ();

    this._commentsModel = commentsModel;
    this._moviesModel = moviesModel;
    this._movieBoardContainer = listContainer;
    this._popupContainer = popupContainer;
    this._renderedMovieCount = CardCount.GENERAL_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._movieBoardComponent = new FilmsView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._listComponent = new ListView(ListTitle.ALL_MOVIES, CssClass.HEADING);
    this._listTopRatedComponent = new ListView(ExtraCardTitle.TOP_RATED,'',CssClass.SECTION);
    this._listMostCommentedComponent = new ListView(ExtraCardTitle.MOST_COMMENTED,'',CssClass.SECTION);
    this._lostComponentEmpty = new ListView(ListTitle.EMPTY);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleChangeMode = this._handleChangeMode.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortMovies = this._handleSortMovies.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  _getMovies() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._moviesModel.movies.slice().sort(compareDate);
      case SortType.RATING:
        return this._moviesModel.movies.slice().sort(compareTotalRating);
    }
    return this._moviesModel.movies;
  }

  _getComments() {
    return this._commentsModel.comments;
  }

  init() {
    this._renderSort();
    render(this._movieBoardContainer, this._movieBoardComponent, RenderPosition.BEFOREEND);
    this._renderList();
    this._renderListTopRaited();
    this._renderListMostComment();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._moviesModel.updateMovie(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._movieCardPresenter.has(data.id)) {
          this._movieCardPresenter.get(data.id).init(data);
        }
        if (this._movieTopCardPresenter.has(data.id)) {
          this._movieTopCardPresenter.get(data.id).init(data);
        }
        if (this._movieCommentCardPresenter.has(data.id)) {
          this._movieCommentCardPresenter.get(data.id).init(data);
        }
        break;

    }
  }

  _handleChangeMode() {
    this._movieCardPresenter.forEach((presenter) => presenter.resetPopup());
    this._movieTopCardPresenter.forEach((presenter) => presenter.resetPopup());
    this._movieCommentCardPresenter.forEach((presenter) => presenter.resetPopup());
    document.body.classList.add('hide-overflow');
  }

  _handleShowMoreButtonClick () {
    const movieCount = this._getMovies().length;
    const newRenderedMovieCount = Math.min(movieCount, this._renderedMovieCount+CardCount.GENERAL_PER_STEP);
    const movies = this._getMovies().slice(this._renderedMovieCount, newRenderedMovieCount);
    this._renderCards (this._listComponent, movies);
    this._renderedMovieCount = newRenderedMovieCount;
    if (this._renderedMovieCount >= movieCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleSortMovies(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearList();
    this._renderList();
  }

  _renderSort() {
    render(this._movieBoardContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortChangeHandler(this._handleSortMovies);

  }

  _renderMovieCard (container, movie) {
    if (container === this._listComponent) {
      const movieCardPresenter = new MovieCard (container, this._popupContainer, this._handleViewAction, this._handleChangeMode);
      movieCardPresenter.init(movie);
      this._movieCardPresenter.set(movie.id, movieCardPresenter);
    }
    if (container === this._listMostCommentedComponent) {
      const movieCommentCardPresenter = new MovieCard (container, this._popupContainer, this._handleViewAction, this._handleChangeMode);
      movieCommentCardPresenter.init(movie);
      this._movieCommentCardPresenter.set(movie.id, movieCommentCardPresenter);
    }
    if (container === this._listTopRatedComponent) {
      const movieTopCardPresenter = new MovieCard (container, this._popupContainer, this._handleViewAction, this._handleChangeMode);
      movieTopCardPresenter.init(movie);
      this._movieTopCardPresenter.set(movie.id, movieTopCardPresenter);
    }

  }

  _renderCards (container, movies) {
    movies.forEach((movie) => this._renderMovieCard(container, movie));
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
    this._renderedMovieCount = CardCount.GENERAL_PER_STEP;
    remove(this._showMoreButtonComponent);
    document.body.classList.remove('hide-overflow');
  }

  _renderList () {
    const movieCount = this._getMovies().length;

    if (movieCount === 0) {
      this._renderListNoMovies();
      return;
    }
    const movies = this._getMovies().slice(0, Math.min(movieCount, CardCount.GENERAL_PER_STEP));

    render(this._movieBoardComponent, this._listComponent, RenderPosition.AFTERBEGIN);
    this._renderCards(this._listComponent, movies);
    if (movieCount > CardCount.GENERAL_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderListTopRaited () {
    const moviesTopRaited = this._getMovies().sort(compareTotalRating);
    if (moviesTopRaited[0].filmInfo.totalRating !== 0) {
      render(this._movieBoardComponent, this._listTopRatedComponent, RenderPosition.BEFOREEND);
      const movies = moviesTopRaited.slice(0, Math.min(moviesTopRaited.length, CardCount.ADDITION));
      this._renderCards (this._listTopRatedComponent, movies);
    }
  }

  _renderListMostComment () {
    const moviesMostCommented = this._getMovies().slice().sort(compareComments);
    if (moviesMostCommented[0].comments.length !== 0) {
      render(this._movieBoardComponent, this._listMostCommentedComponent, RenderPosition.BEFOREEND);
      const movies = moviesMostCommented.slice(0, Math.min(moviesMostCommented.length, CardCount.ADDITION));
      this._renderCards (this._listMostCommentedComponent, movies);
    }
  }

}
