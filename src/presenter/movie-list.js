import MovieCard from './movie.js';
import ListView from '../view/list.js';
import FilmsView from '../view/films.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import { compareTotalRating, compareComments } from '../utils/movie.js';
import { render, remove } from '../utils/render.js';
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
    this._handleShowMoreButtonClick = this._handleShowMoreButtonEvt.bind(this);
  }

  init(movies) {
    this._movies = movies.slice();


    render(this._movieBoardContainer, this._movieBoardComponent, RenderPosition.BEFOREEND);
    this._renderList();
    this._renderListTopRaited();
    this._renderListMostComment();
  }

  _renderMovieCard (containerComponent, movie) {
    const movieCardPresenter = new MovieCard (containerComponent, this._popupContainer);
    movieCardPresenter.init(movie);
  }

  _renderCards (containerComponent, movies, from, to) {
    movies
      .slice(from, to)
      .forEach((movie) => this._renderMovieCard(containerComponent, movie));
  }

  _handleShowMoreButtonEvt () {
    this._renderCards (this._listComponent, this._movies, this._renderedCounter, this._renderedCounter+CardCount.GENERAL_PER_STEP);
    this._renderedCounter += CardCount.GENERAL_PER_STEP;
    if (this._renderedCounter >= this._movies.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton () {
    render(this._listComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
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
