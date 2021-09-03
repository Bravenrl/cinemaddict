import dayjs from 'dayjs';
import {getRandomInteger, getRandomArrayElement} from '../utils/common.js';
import { CardCount } from '../const.js';


const EMOTOINS = ['smile', 'sleeping', 'puke', 'angry'];
const TOTAL_COMMENTS = 5;
const generateDate = () => dayjs().add(getRandomInteger(-100, 0), 'day').format();


const generateNewComment = () =>
  ({
    id: 1,
    author: `Author# ${getRandomInteger(0, 100)}`,
    comment: `Comment# ${getRandomInteger(0, 100)}`,
    date: generateDate(),
    emotion: getRandomArrayElement(EMOTOINS),
  });

let idCounter = 1;
export const generateComments = () => {
  const commentsCount = getRandomInteger(0,TOTAL_COMMENTS);
  const comments = new Array(commentsCount).fill().map(generateNewComment);
  comments.forEach((comment) => comment.id=`${idCounter++}`);
  return comments;
};

export const allComments = new Array(CardCount.GENERAL).fill().map(generateComments);
