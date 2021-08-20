import dayjs from 'dayjs';
import AdvancedFormat from 'dayjs/plugin/relativeTime';


export const humanizeMovieTime = (time) => {
  let mins = time % 60;
  let hours = (time - mins) / 60;
  if (mins < 10) {mins = `0${  mins}`;}
  if (hours < 10) {hours = `${  hours}`;}
  return (`${hours  }h ${  mins}m`);
};

dayjs.extend(AdvancedFormat);
export const getCommentDate = (commentDate) => dayjs(commentDate).fromNow();
export const getYear = (date) => dayjs(date).format('YYYY');
export const getReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');

export const compareTotalRating = (objA, objB) => objB.filmInfo.totalRating - objA.filmInfo.totalRating;

export const compareDate = (objA, objB) => dayjs(objB.filmInfo.release.date).diff(dayjs(objA.filmInfo.release.date));

export const compareComments = (objA, objB) => objB.comments.length - objA.comments.length;


export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
