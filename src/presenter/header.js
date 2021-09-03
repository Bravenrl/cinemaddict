import HeaderProfileView from '../view/header-profile.js';
import {
  render,
  remove
} from '../utils/render.js';
import {
  RenderPosition
} from '../const.js';

export default class HeaderBord {
  constructor(container, moviesModel) {
    this._moviesModel = moviesModel;
    this._headerBordContainer = container;
    this._headerBordComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);


  }


  init() {
    this._movies = this._moviesModel.movies;
    this._headerBordComponent = new HeaderProfileView(this._movies);
    render(this._headerBordContainer, this._headerBordComponent, RenderPosition.BEFOREEND);
  }

  _handleModelEvent(updateType, data) {
    const updatedMovie = this._movies.find((movie) => movie.id === data.id);
    if (updatedMovie.userDetails.alreadyWatched === data.userDetails.alreadyWatched) {
      return;
    }
    remove(this._headerBordComponent);
    this.init();
  }
}
