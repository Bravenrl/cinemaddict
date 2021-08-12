import dayjs from 'dayjs';
import {getRandomInteger, getRandomArrayElement} from '../utils/common.js';

const EMOTOINS = ['smile', 'sleeping', 'puke', 'angry'];

const generateDate = () => dayjs().add(getRandomInteger(-100, 0), 'day').format();


export const generateComments = () =>
  ({
    id: 1,
    author: `Author# ${getRandomInteger(0, 100)}`,
    comment: `Comment# ${getRandomInteger(0, 100)}`,
    date: generateDate(),
    emotion: getRandomArrayElement(EMOTOINS),
  });


