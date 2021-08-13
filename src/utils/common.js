export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomNumberFloat = function (value1 = 0, value2 = 10, float = 1) {
  const low = Math.min(Math.abs(value1), Math.abs(value2));
  const hight = Math.max(Math.abs(value1), Math.abs(value2));
  const result = Math.random() * (hight - low) + low;
  return +result.toFixed(float);
};

export const getRandomArrayElement = (elements) => elements[getRandomInteger(0,elements.length-1)];  //Случайные элементы из массива

export const getRandomArrayNonRepeat = (elements) => {                                                 //Массив случайной длины с неповторяющимися элементами
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
