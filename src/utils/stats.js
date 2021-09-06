import { DateType, DurationType, ProfileRank } from '../const.js';
import { filter } from './filter.js';
import { FilterType } from '../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(isToday);

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

export const getWatсhedMoviesInRange = (movies, dateFrom, dateTo, target) =>
  movies.reduce((moviesInRange, movie) => {
    if (target===DateType.ALL) {
      moviesInRange.push(movie);
      return moviesInRange;
    }
    if (target===DateType.TODAY && dayjs(movie.userDetails.watchingDate).isToday()) {
      moviesInRange.push(movie);
      return moviesInRange;
    }
    if (dayjs(movie.userDetails.watchingDate).isBetween(dateFrom, dateTo, null, [])) {
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

export const getCountGenres = (allGenres) => allGenres.reduce( (total, ganre) => {
  total[ganre] = (total[ganre] || 0) + 1 ;
  return total;
} , {});

export const getTopGenre = (genres) => Object.keys(genres).reduce((max, current) => (genres[max] > genres[current]) ? max : current);

export const getSortGenreKeys = (genres) => Object.keys(genres).sort((a,b) => genres[b]-genres[a]);

export const getSortGenreValues = (genres) => Object.values(genres).sort((a,b) => b-a);

export const getDateFrom = (type) => {
  const countAgo = 1;
  return dayjs().subtract(countAgo, type).toDate();
};


