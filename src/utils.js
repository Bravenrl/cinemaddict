const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomNumberFloat = function (value1 = 0, value2 = 10, float = 1) {
  const low = Math.min(Math.abs(value1), Math.abs(value2));
  const hight = Math.max(Math.abs(value1), Math.abs(value2));
  const result = Math.random() * (hight - low) + low;
  return +result.toFixed(float);
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0,elements.length-1)];  //Случайные элементы из массива

const getRandomArrayNonRepeat = (elements) => {                                                 //Массив случайной длины с неповторяющимися элементами
  const arrayNonRepeat = new Array(getRandomInteger(0,elements.length-1)).fill(null);
  const sortArrayNonRepeat = new Array();
  arrayNonRepeat.forEach((value1, index) => {
    const random = getRandomArrayElement(elements);
    arrayNonRepeat[index] = (arrayNonRepeat.every((value) => value!==random)) ? random : 0;
    if (arrayNonRepeat[index]!==0) {
      sortArrayNonRepeat.push(arrayNonRepeat[index]);
    }
  });
  return sortArrayNonRepeat;
};

const humanizeMovieTime = (time) => {
  let mins = time % 60;
  let hours = (time - mins) / 60;
  if (mins < 10) {mins = `0${  mins}`;}
  if (hours < 10) {hours = `${  hours}`;}
  return (`${hours  }h ${  mins}m`);
};

const compareTotalRating = (objA, objB) => {
  if (objA.filmInfo.totalRating > objB.filmInfo.totalRating) {
    return 1;
  }
  if (objA.filmInfo.totalRating < objB.filmInfo.totalRating) {
    return -1;
  }
  return 0;
};
const compareComments = (objA, objB) => {
  if (objA.comments.length > objB.comments.length) {
    return 1;
  }
  if (objA.comments.length < objB.comments.length) {
    return -1;
  }
  return 0;
};
export {getRandomInteger, getRandomNumberFloat, getRandomArrayNonRepeat, getRandomArrayElement, humanizeMovieTime, compareComments, compareTotalRating};
