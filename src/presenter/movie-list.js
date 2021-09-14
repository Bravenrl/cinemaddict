import MovieCard from './movie.js';
import PopupCard from './popup.js';
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
  SortType,
  UpdateType,
  UserAction,
  FilterType,
  CardTitle,
  Mode,
  State
} from '../const.js';
import { filter } from '../utils/filter.js';
import { isOnline } from '../utils/common.js';
import { toast } from '../utils/toast.js';


export default class MovieList {
  constructor(listContainer, popupContainer, moviesModel, filterModel, commentsModel, api) {
    this._movieCardPresenter = new Map();
    this._movieTopCardPresenter = new Map();
    this._movieCommentCardPresenter = new Map();

    this._api = api;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._moviesModel = moviesModel;
    this._movieBoardContainer = listContainer;
    this._popupContainer = popupContainer;

    this._renderedMovieCount = CardCount.GENERAL_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filterType = FilterType.ALL;
    this._mode = Mode.DEFAULT;
    this._isLoading = true;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._movieBoardComponent = new FilmsView();
    this._listComponent = new ListView(CardTitle.ALL);
    this._listTopRatedComponent = new ListView(CardTitle.TOP_RATED);
    this._listMostCommentedComponent = new ListView(CardTitle.MOST_COMMENTED);
    this._listLoadingComponent = new ListView(CardTitle.LOADING);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortMovies = this._handleSortMovies.bind(this);

    this._popupPresenter = new PopupCard(this._popupContainer, this._handleViewAction, this._commentsModel);
  }

  _getMovies() {
    this._filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filtredMovies = filter[this._filterType](movies);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredMovies.sort(compareDate);
      case SortType.RATING:
        return filtredMovies.sort(compareTotalRating);
    }
    return filtredMovies;
  }

  init() {
    if (this._mode !== Mode.DEFAULT) {
      return;
    }
    render(this._movieBoardContainer, this._movieBoardComponent, RenderPosition.BEFOREEND);
    this._renderList();
    this._renderListTopRaited();
    this._renderListMostComment();
    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._mode = Mode.INIT;
  }

  _handleViewAction(actionType, updateType, updateMovie, updateComment) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._api.updateMovie(updateMovie).then((response) => {
          this._moviesModel.updateMovie(updateType, response);
        });
        break;
      case UserAction.DELETE_COMMENT:
        this._popupPresenter.setViewState(State.DELETING);
        this._api.deleteComment(updateComment.id).then(() => {
          this._commentsModel.deleteComment(updateType, updateMovie, updateComment);
        })
          .catch(() => {
            if (!isOnline()) {
              toast('You can\'t delete comment offline');
            }
            this._popupPresenter.setViewState(State.ABORTING);
          });
        break;
      case UserAction.ADD_COMMENT:
        this._popupPresenter.setViewState(State.SAVING);
        this._api.addComment(updateMovie.id, updateComment).then((response) => {
          this._popupPresenter.resetPopup(response.movie);
          this._commentsModel.setComments(updateType, response.comments, updateMovie);
          this._moviesModel.updateMovie(updateType, response.movie);
        })
          .catch(() => {
            if (!isOnline()) {
              toast('You can\'t create comment offline');
            }
            this._popupPresenter.setViewState(State.ABORTING);
          });
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._filterType !== FilterType.ALL) {
          this._clearList({resetRenderedMovieCount: true});
          this._renderList();
        }
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

      case UpdateType.PATCH_POPUP:
        if (this._movieCardPresenter.has(data.id)) {
          this._movieCardPresenter.get(data.id).init(data);
        }
        if (this._movieTopCardPresenter.has(data.id)) {
          this._movieTopCardPresenter.get(data.id).init(data);
        }
        this._clearListMostComment();
        this._renderListMostComment();
        this._popupPresenter.initPopup(data);
        break;

      case UpdateType.MINOR_POPUP:
        this._clearList({resetRenderedMovieCount: true});
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
        this._popupPresenter.initPopup(data);
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

      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._listLoadingComponent);
        this._renderList();
        this._renderListTopRaited();
        this._renderListMostComment();
        break;

      case UpdateType.INIT_POPUP:
        this._popupPresenter.initPopup(data);
        break;
    }
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
      const movieCardPresenter = new MovieCard(container, this._handleViewAction, this._popupPresenter, this._commentsModel);
      movieCardPresenter.init(movie);
      this._movieCardPresenter.set(movie.id, movieCardPresenter);
    }
    if (container === this._listMostCommentedComponent) {
      const movieCommentCardPresenter = new MovieCard(container, this._handleViewAction, this._popupPresenter, this._commentsModel);
      movieCommentCardPresenter.init(movie);
      this._movieCommentCardPresenter.set(movie.id, movieCommentCardPresenter);
    }
    if (container === this._listTopRatedComponent) {
      const movieTopCardPresenter = new MovieCard(container, this._handleViewAction, this._popupPresenter, this._commentsModel);
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

  _renderLoading() {
    render(this._movieBoardComponent, this._listLoadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderListNoMovies() {
    this._listComponentEmpty = new ListView(CardTitle.EMPTY, this._filterType);
    render(this._movieBoardComponent, this._listComponentEmpty, RenderPosition.AFTERBEGIN);
  }

  _clearList({resetRenderedMovieCount = false, resetSortType = false} = {}) {
    const movieCount = this._getMovies().length;
    this._movieCardPresenter.forEach((presenter) => presenter.destroy());
    this._movieCardPresenter.clear();
    remove(this._showMoreButtonComponent);
    remove(this._sortComponent);
    remove(this._listLoadingComponent);
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

  _clearListMostComment() {
    this._movieCommentCardPresenter.forEach((presenter) => presenter.destroy());
    this._movieCommentCardPresenter.clear();
    remove(this._listMostCommentedComponent);
  }

  _clearListTopRaited() {
    this._movieTopCardPresenter.forEach((presenter) => presenter.destroy());
    this._movieTopCardPresenter.clear();
    remove(this._listTopRatedComponent);
  }

  _renderList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
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
    if (this._isLoading) {
      return;
    }
    const moviesTopRaited = this._moviesModel.getMovies().slice().sort(compareTotalRating);
    const movieCount = moviesTopRaited.length;
    if (movieCount === 0) {
      return;
    }
    render(this._movieBoardComponent, this._listTopRatedComponent, RenderPosition.BEFOREEND);
    const movies = moviesTopRaited.slice(0, Math.min(moviesTopRaited.length, CardCount.ADDITION));
    this._renderCards(this._listTopRatedComponent, movies);
  }

  _renderListMostComment() {
    if (this._isLoading) {
      return;
    }
    const moviesMostCommented = this._moviesModel.getMovies().slice().sort(compareComments);
    const movieCount = moviesMostCommented.length;
    if (movieCount === 0) {
      return;
    }
    render(this._movieBoardComponent, this._listMostCommentedComponent, RenderPosition.BEFOREEND);
    const movies = moviesMostCommented.slice(0, Math.min(moviesMostCommented.length, CardCount.ADDITION));
    this._renderCards(this._listMostCommentedComponent, movies);
  }

  destroy() {
    this._clearList({resetRenderedMovieCount: true, resetSortType: true});
    this._mode = Mode.DEFAULT;
    this._clearListMostComment();
    this._clearListTopRaited();
    remove(this._movieBoardComponent);
    this._moviesModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._commentsModel.removeObserver(this._handleModelEvent);
  }
}
