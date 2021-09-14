import { TOAST_SHOW_TIME } from '../const.js';

const toastContainer = document.createElement('div');

toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

export const toast = (message) => {
  const prevItem = toastContainer.querySelector('.toast-item');
  if (prevItem) {
    prevItem.remove();
  }
  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-item');
  toastContainer.append(toastItem);

  setTimeout(() => {
    toastItem.remove();
  }, TOAST_SHOW_TIME);
};
