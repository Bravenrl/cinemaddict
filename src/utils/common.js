import { AlertStyle } from '../const.js';

export const isOnline = () => window.navigator.onLine;

export const createStoreStructure = (items) =>
  items.reduce((acc, current) => Object.assign({}, acc, {[current.id]: current}), {});

export const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = AlertStyle.zIndex;
  alertContainer.style.position = AlertStyle.position;
  alertContainer.style.left = AlertStyle.left;
  alertContainer.style.top = AlertStyle.top;
  alertContainer.style.right = AlertStyle.right;
  alertContainer.style.height = AlertStyle.height;
  alertContainer.style.padding = AlertStyle.padding;
  alertContainer.style.fontSize = AlertStyle.fontSize;
  alertContainer.style.textAlign = AlertStyle.textAlign;
  alertContainer.style.lineHeight = AlertStyle.lineHeight;
  alertContainer.style.backgroundColor = AlertStyle.backgroundColor;

  alertContainer.textContent = message;
  alertContainer.classList.add('alert-item');
  document.body.append(alertContainer);
};

export const removeAlert = () => document.querySelector('.alert-item').remove();
