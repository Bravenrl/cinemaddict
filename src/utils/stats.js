import { DateType, DurationType, ProfileRank } from '../const.js';
import { filter } from './filter.js';
import { FilterType } from '../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(duration);
dayjs.extend(isBetween);

export const getRating = (movies) => {
  const rating = filter[FilterType.HISTORY](movies).length;
  if ((rating>=ProfileRank.novice.from)&&(rating<=ProfileRank.novice.to)) {
    return ProfileRank.novice.rank;
  }
  if ((rating>=ProfileRank.fan.from)&&(rating<=ProfileRank.fan.to)) {
    return ProfileRank.fan.rank;
  }
  if ((rating>=ProfileRank.movieBuff.from)&&(rating<ProfileRank.movieBuff.to)) {
    return ProfileRank.movieBuff.rank;
  }
  return '';
};

export const getWathedMoviesInRange = (movies, dateFrom, dateTo) =>
  movies.reduce((moviesInRange, movie) => {
    if (
      dayjs(movie.userDetails.watchingDate).isSame(dateFrom) ||
    dayjs(movie.userDetails.watchingDate).isBetween(dateFrom, dateTo) ||
    dayjs(movie.userDetails.watchingDate).isSame(dateTo)
    ) {
      moviesInRange.push(movie);
    }
    return moviesInRange;
  }, []);


export const getDuration = (movies, type) => {
  const totalDuration = movies.reduce((totalTime, movie) => totalTime + movie.filmInfo.runtime, 0);
  if (type===DurationType.HOURS) {
    const hours = dayjs.duration(totalDuration, 'm').asHours();
    return Math.floor(hours);
  }
  return dayjs.duration(totalDuration, 'm').minutes();
};

export const getAllGenres = (movies) => movies.reduce((genre, movie) => [...genre, ...movie.filmInfo.genre], []);

export const getCountGenres = (movies) => getAllGenres(movies)
  .reduce( (total, ganre) => {
    total[ganre] = (total[ganre] || 0) + 1 ;
    return total;
  } , {});

export const getTopGenre = (movies) => {
  const genres = getCountGenres(movies);
  return Object.keys(genres).reduce((max, current) => (genres[max] > genres[current]) ? max : current);
};

export const getSortGenreKeys = (movies) => {
  const genres = getCountGenres(movies);
  return Object.keys(genres).sort((a,b) => genres[b]-genres[a]);
};

export const getSortGenreValues = (movies) => {
  const genres = getCountGenres(movies);
  return Object.values(genres).sort((a,b) => b-a);
};

export const getDateFrom = (type) => {
  let countAgo = 1;
  if (type === DateType.ALL) {
    countAgo = 100;
    return dayjs().subtract(countAgo, 'years').toDate();
  }
  if (type === DateType.TODAY) {
    return dayjs().toDate();
  }
  return dayjs().subtract(countAgo, type).toDate();
};


