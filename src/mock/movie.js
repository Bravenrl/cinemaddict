import dayjs from 'dayjs';
import {
  getRandomInteger,
  getRandomNumberFloat,
  getRandomArrayNonRepeat,
  getRandomArrayElement
} from '../utils/common.js';

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];


const GANRES = [
  'sci-fi', 'documentary', 'animation',
  'action', 'тhriller', 'drama',
  'comedy', 'adventure',
];

const WRITERS = [
  'Writer-1', 'Writer-2', 'Writer-3', 'Writer-4', 'Writer-5',
];

const ACTORS = [
  'actor-1', 'actor-2', 'actor-3', 'actor-4', 'actor-5', 'actor-6', 'actor-7',
];

const COUNTRIES = ['Russia', 'USA', 'England', 'France', 'Spain', 'Italy', 'Japan'];

const POSTERS = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];


const TITLES = [
  'made for each other',
  'popeye meets sinbad',
  'sagebrush trail',
  'santa claus conquers the martians',
  'the dance of life',
  'the great flamarion',
  'the man with the golden arm',
];

const generateDate = () => dayjs().add(getRandomInteger(-360, 0), 'day').format();

let movieCount = 0;

export const generateMovie = () => {
  const alreadyWatched = Boolean(getRandomInteger(0, 1));
  const watchingDate = (alreadyWatched) ? generateDate() : '';
  const watchlist = !alreadyWatched;


  return {
    id: `${movieCount++}`,
    comments: [],
    filmInfo: {
      title: getRandomArrayElement(TITLES),
      alternativeTitle: getRandomArrayElement(TITLES),
      totalRating: getRandomNumberFloat(),
      poster: getRandomArrayElement(POSTERS),
      ageRating: getRandomInteger(0, 18),
      director: `director#${getRandomInteger(0, 100)}`,
      writers: getRandomArrayNonRepeat(WRITERS),
      actors: getRandomArrayNonRepeat(ACTORS),
      release: {
        date: dayjs().add(getRandomInteger(-50, 0), 'year').format(),
        releaseCountry: getRandomArrayElement(COUNTRIES),
      },
      runtime: getRandomInteger(60, 240),
      genre: getRandomArrayNonRepeat(GANRES),
      description: getRandomArrayNonRepeat(DESCRIPTIONS),
    },
    userDetails: {
      watchlist,
      alreadyWatched,
      watchingDate,
      favorite: Boolean(getRandomInteger(0, 1)),

    },
  };
};

