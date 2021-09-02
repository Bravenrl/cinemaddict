import MovieCard from './movie.js';
import ListView from '../view/list.js';
import FilmsView from '../view/films.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import SortView from '../view/sort.js';
import {
  compareTotalRating,
  compareComments,
  compareDate
} from '../utils/movie.js';
import {
  render,
  remove
} from '../utils/render.js';
import {
  RenderPosition,
  CardCount,
  ListTitle,
  CssClass,
  SortType,
  UpdateType,
  UserAction,
  FilterType,
  CardTitle
} from '../const.js';
import { filter } from '../utils/filter.js';
import { allComments } from '../mock/comment.js';


export default class MovieList {
  constructor(listContainer, popupContainer, moviesModel, filterModel, commentsModel) {
    this._movieCardPresenter = new Map();
    this._movieTopCardPresenter = new Map();
    this._movieCommentCardPresenter = new Map();

    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._moviesModel = moviesModel;
    this._movieBoardContainer = listContainer;
    this._popupContainer = popupContainer;
    this._renderedMovieCount = CardCount.GENERAL_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filterType = FilterType.ALL;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._movieBoardComponent = new FilmsView();
    this._listComponent = new ListView(ListTitle.ALL_MOVIES, CssClass.HEADING);
    this._listTopRatedComponent = new ListView(CardTitle.TOP_RATED, '', CssClass.SECTION);
    this._listMostCommentedComponent = new ListView(CardTitle.MOST_COMMENTED, '', CssClass.SECTION);


    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleChangeMode = this._handleChangeMode.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortMovies = this._handleSortMovies.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  _getMovies() {
    this._filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.movies;
    const filtredMovies = filter[this._filterType](movies);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredMovies.sort(compareDate);
      case SortType.RATING:
        return filtredMovies.sort(compareTotalRating);
    }

    return filtredMovies;
  }

  _getComments(movie) {
    return this._commentsModel.comments = allComments[movie.id];
  }

  init() {
    render(this._movieBoardContainer, this._movieBoardComponent, RenderPosition.BEFOREEND);
    this._renderList();
    this._renderListTopRaited();
    this._renderListMostComment();
  }

  _handleViewAction(actionType, updateType, updateMovie, updateComment, cardTitle) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._moviesModel.updateMovie(updateType, updateMovie, cardTitle);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, updateMovie, updateComment);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, updateMovie, updateComment);
    }
  }

  _handleModelEvent(updateType, data, cardTitle) {
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
          remove(this._listMostCommentedComponent);
          this._renderListMostComment();
        }
        break;
      case UpdateType.POPUP:
        this._clearList();
        this._renderList();
        if (this._movieCardPresenter.has(data.id)) {
          this._movieCardPresenter.get(data.id).init(data);
        }
        if (this._movieTopCardPresenter.has(data.id)) {
          this._movieTopCardPresenter.get(data.id).init(data);
        }
        if (this._movieCommentCardPresenter.has(data.id)) {
          this._movieCommentCardPresenter.get(data.id).init(data);
        }
        switch (cardTitle) {
          case CardTitle.ALL:
            if (this._movieCardPresenter.has(data.id)) {
              this._movieCardPresenter.get(data.id).showNewPopup();
            }
            break;
          case CardTitle.MOST_COMMENTED:
            if (this._movieCommentCardPresenter.has(data.id)) {
              this._movieCommentCardPresenter.get(data.id).resetPopup();
              this._movieCommentCardPresenter.get(data.id).showNewPopup();
            }
            break;
          case CardTitle.TOP_RATED:
            if (this._movieTopCardPresenter.has(data.id)) {
              this._movieTopCardPresenter.get(data.id).resetPopup();
              this._movieTopCardPresenter.get(data.id).showNewPopup();
            }
            break;

        }
        break;

      case UpdateType.MINOR:
        this._clearList();
        this._renderList();
        if (this._movieTopCardPresenter.has(data.id)) {
          this._movieTopCardPresenter.get(data.id).init(data);
        }
        if (this._movieCommentCardPresenter.has(data.id)) {
          this._movieCommentCardPresenter.get(data.id).init(data);
        }
        break;
      case UpdateType.MAJOR:
        this._clearList({resetRenderedMovieCount: true, resetSortType: true});
        this._renderList();
        break;
    }
  }


  _handleChangeMode() {
    this._movieCardPresenter.forEach((presenter) => presenter.resetPopup());
    this._movieTopCardPresenter.forEach((presenter) => presenter.resetPopup());
    this._movieCommentCardPresenter.forEach((presenter) => presenter.resetPopup());
    document.body.classList.add('hide-overflow');
  }

  _handleShowMoreButtonClick() {
    const movies = this._getMovies();
    const movieCount = movies.length;
    const newRenderedMovieCount = Math.min(movieCount, this._renderedMovieCount + CardCount.GENERAL_PER_STEP);
    this._renderCards(this._listComponent, movies.slice(this._renderedMovieCount, newRenderedMovieCount));
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
    this._clearList({resetRenderedMovieCount: true});
    this._renderList();

  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortChangeHandler(this._handleSortMovies);
    render(this._movieBoardComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderMovieCard(container, movie) {
    if (container === this._listComponent) {
      const movieCardPresenter = new MovieCard(container, this._popupContainer, this._handleViewAction, this._handleChangeMode, this._commentsModel, CardTitle.ALL);
      movieCardPresenter.init(movie);
      this._movieCardPresenter.set(movie.id, movieCardPresenter);
    }
    if (container === this._listMostCommentedComponent) {
      const movieCommentCardPresenter = new MovieCard(container, this._popupContainer, this._handleViewAction, this._handleChangeMode, this._commentsModel, CardTitle.MOST_COMMENTED);
      movieCommentCardPresenter.init(movie);
      this._movieCommentCardPresenter.set(movie.id, movieCommentCardPresenter);
    }
    if (container === this._listTopRatedComponent) {
      const movieTopCardPresenter = new MovieCard(container, this._popupContainer, this._handleViewAction, this._handleChangeMode, this._commentsModel, CardTitle.TOP_RATED);
      movieTopCardPresenter.init(movie);
      this._movieTopCardPresenter.set(movie.id, movieTopCardPresenter);
    }
  }

  _renderCards(container, movies) {
    movies.forEach((movie) => this._renderMovieCard(container, movie));
  }


  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }
    this._showMoreButtonComponent = new ShowMoreButtonView();

    render(this._listComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderListNoMovies() {
    this._listComponentEmpty = new ListView(this._filterType);
    render(this._movieBoardComponent, this._listComponentEmpty, RenderPosition.AFTERBEGIN);
  }

  _clearList({resetRenderedMovieCount = false, resetSortType = false} = {}) {
    const movieCount = this._getMovies().length;

    this._movieCardPresenter.forEach((presenter) => presenter.destroy());
    this._movieCardPresenter.clear();

    remove(this._showMoreButtonComponent);
    remove(this._sortComponent);

    if (this._listComponentEmpty) {
      remove(this._listComponentEmpty);
    }

    if (resetRenderedMovieCount) {
      this._renderedMovieCount = CardCount.GENERAL_PER_STEP;
    } else {
      this._renderedMovieCount = Math.min(movieCount, this._renderedMovieCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    document.body.classList.remove('hide-overflow');
  }

  _renderList() {
    const movies = this._getMovies();
    const movieCount = movies.length;

    if (movieCount === 0) {
      this._renderListNoMovies();
      return;
    }

    this._renderSort();
    render(this._movieBoardComponent, this._listComponent, RenderPosition.AFTERBEGIN);
    this._renderCards(this._listComponent, movies.slice(0, Math.min(movieCount, this._renderedMovieCount)));
    if (movieCount > this._renderedMovieCount) {
      this._renderShowMoreButton();
    }
  }

  _renderListTopRaited() {
    const moviesTopRaited = this._getMovies().slice().sort(compareTotalRating);
    if (moviesTopRaited[0].filmInfo.totalRating !== 0) {
      render(this._movieBoardComponent, this._listTopRatedComponent, RenderPosition.BEFOREEND);
      const movies = moviesTopRaited.slice(0, Math.min(moviesTopRaited.length, CardCount.ADDITION));
      this._renderCards(this._listTopRatedComponent, movies);
    }
  }

  _renderListMostComment() {
    const moviesMostCommented = this._getMovies().slice().sort(compareComments);
    if (moviesMostCommented[0].comments.length !== 0) {
      render(this._movieBoardComponent, this._listMostCommentedComponent, RenderPosition.BEFOREEND);
      const movies = moviesMostCommented.slice(0, Math.min(moviesMostCommented.length, CardCount.ADDITION));
      this._renderCards(this._listMostCommentedComponent, movies);
    }
  }

  _clearListTopRaited() {
    this._movieTopCardPresenter.forEach((presenter) => presenter.destroy());
    this._movieTopCardPresenter.clear();
    document.body.classList.remove('hide-overflow');
  }

  _clearListMostComment() {
    this._movieCommentCardPresenter.forEach((presenter) => presenter.destroy());
    this._movieCommentCardPresenter.clear();
    document.body.classList.remove('hide-overflow');
  }

}
