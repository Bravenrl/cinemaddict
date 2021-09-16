import Smart from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';

import { getAllGenres, getDateFrom, getRating, getDuration, getCountGenres, getTopGenre, getWatchedMoviesInRange, getSortGenreKeys, getSortGenreValues } from '../utils/stats.js';
import { filter } from '../utils/filter.js';
import { FilterType, DurationType, DateType } from '../const.js';

const CANVAS_HEIGHT = 50;

const renderChart = (statisticCtx, {movies, dateFrom, dateTo, target}) => {
  const rangedMovies = getWatchedMoviesInRange(movies, dateFrom, dateTo, target);
  const allGenres = getAllGenres(rangedMovies);
  if (allGenres.length === 0) {
    return;
  }
  const countGenres = getCountGenres(allGenres);
  statisticCtx.height =  Object.keys(countGenres).length * CANVAS_HEIGHT;
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: getSortGenreKeys(countGenres),
      datasets: [{
        data: getSortGenreValues(countGenres),
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


const createStatisticTemplate = ({movies, dateFrom, dateTo, target}) => {
  const rangedMovies = getWatchedMoviesInRange(movies, dateFrom, dateTo, target);
  const allGenres = getAllGenres(rangedMovies);
  const countGenres = getCountGenres(allGenres);

  return (`<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getRating(movies)}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${target === DateType.ALL ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${target === DateType.TODAY ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${target === DateType.WEEK ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${target === DateType.MONTH ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${target === DateType.YEAR ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
    ${rangedMovies.length>0 ?
      `<ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${rangedMovies.length} <span class="statistic__item-description">${rangedMovies.length>1 ? 'movies' : 'movie'}</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${getDuration(rangedMovies, DurationType.HOURS)} <span class="statistic__item-description">h</span> ${getDuration(rangedMovies, DurationType.MINUTES)} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${allGenres.length !==0 ? getTopGenre(countGenres) : 'No Genre'}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>` : '<div><h2 class="films-list__title">There are no watched movies in range</h2></div>'}
</section>`);
};

export default class Statistic extends Smart {
  constructor (allMovies) {
    super();
    this._watchedMovies = filter[FilterType.HISTORY](allMovies);
    this._data = {
      movies: this._watchedMovies,
      dateFrom: dayjs().toDate(),
      dateTo: dayjs().toDate(),
      target: DateType.ALL,
    };
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._setChart();
    this._setDateChangeHandler();
  }

  getTemplate () {
    return createStatisticTemplate(this._data);
  }

  restoreHandlers() {
    this._setChart();
    this._setDateChangeHandler();
  }

  _dateChangeHandler(evt) {
    evt.preventDefault();
    const type = evt.target.value;
    const dateFrom = getDateFrom(type);
    this.updateData({
      dateTo: dayjs().toDate(),
      dateFrom,
      target: type,
    });
  }

  _setDateChangeHandler() {
    this.getElement().querySelector('.statistic__filters')
      .addEventListener('change', this._dateChangeHandler);
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._chart = renderChart(statisticCtx, this._data);
  }
}
