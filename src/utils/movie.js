import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';


dayjs.extend(duration);
dayjs.extend(relativeTime);
export const humanizeMovieTime = (time) => dayjs.duration(time, 'minutes').format('H[h] mm[m]');
export const getCommentDate = (commentDate) => dayjs(commentDate).fromNow();
export const getYear = (date) => dayjs(date).format('YYYY');
export const getReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');
export const getTodayDate = () => dayjs().format();

export const compareTotalRating = (objA, objB) => objB.filmInfo.totalRating - objA.filmInfo.totalRating;

export const compareDate = (objA, objB) => dayjs(objB.filmInfo.release.date).diff(dayjs(objA.filmInfo.release.date));

export const compareComments = (objA, objB) => objB.comments.length - objA.comments.length;


export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const isSubmitEvent = (evt) => (evt.ctrlKey || evt.metaKey) && evt.key === 'Enter';
