import HeaderProfileView from '../view/header-profile.js';
import FooterStatistivView from '../view/footer-statistic.js';
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
    const movies = this._getMovies();
    this._headerComponent = new HeaderProfileView(movies);
    render(this._headerContainer, this._headerComponent, RenderPosition.BEFOREEND);
  }

  _renderFooter() {
    let moviesCount = 0;
    if (!this._isLoading) {
      moviesCount = this._getMovies().length;
    }
    this._footerComponent = new FooterStatistivView(moviesCount);
    render(this._footerContainer, this._footerComponent, RenderPosition.BEFOREEND);
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
        remove(this._footerComponent);
        this._isLoading = false;
        this._renderHeader();
        this._renderFooter();
        break;
      default:
        remove(this._headerComponent);
        this._renderHeader();
        break;
    }
  }
}
