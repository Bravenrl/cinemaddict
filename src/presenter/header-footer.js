import HeaderProfileView from '../view/header-profile.js';
import FooterStatisticView from '../view/footer-statistic.js';
import {
  render,
  remove
} from '../utils/render.js';
import {
  RenderPosition,
  UpdateType
} from '../const.js';

export default class HeaderBord {
  constructor(headerCntainer, footerContainer, moviesModel) {
    this._moviesModel = moviesModel;
    this._headerContainer = headerCntainer;
    this._footerContainer = footerContainer;
    this._headerComponent = null;
    this._footerComponent = null;
    this._updateMovie = null;
    this._isLoading = true;
    this._movies = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderHeader();
    this._renderFooter();
  }

  _getMovies () {
    return this._moviesModel.getMovies();
  }

  _renderHeader() {
    if (this._isLoading) {
      return;
    }
    this._movies = this._getMovies();
    this._headerComponent = new HeaderProfileView(this._movies);
    render(this._headerContainer, this._headerComponent, RenderPosition.BEFOREEND);
  }

  _renderFooter() {
    let moviesCount = 0;
    if (!this._isLoading) {
      moviesCount = this._getMovies().length;
    }
    this._footerComponent = new FooterStatisticView(moviesCount);
    render(this._footerContainer, this._footerComponent, RenderPosition.BEFOREEND);
  }

  _handleModelEvent(updateType, data) {

    switch (updateType) {
      case UpdateType.INIT:
        remove(this._footerComponent);
        this._isLoading = false;
        this._renderHeader();
        this._renderFooter();
        break;
      default:
        this._updatedMovie = this._movies.find((movie) => movie.id === data.id);
        if (this._updatedMovie.userDetails.alreadyWatched === data.userDetails.alreadyWatched) {
          return;
        }
        remove(this._headerComponent);
        this._renderHeader();
        break;
    }
  }
}
