import { ALERT_STYLE} from '../const.js';

export const isOnline = () => window.navigator.onLine;

export const createStoreStructure = (items) =>
  items.reduce((acc, current) => Object.assign({}, acc, {[current.id]: current}), {});

export const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = ALERT_STYLE.zIndex;
  alertContainer.style.position = ALERT_STYLE.position;
  alertContainer.style.left = ALERT_STYLE.left;
  alertContainer.style.top = ALERT_STYLE.top;
  alertContainer.style.right = ALERT_STYLE.right;
  alertContainer.style.height = ALERT_STYLE.height;
  alertContainer.style.padding = ALERT_STYLE.padding;
  alertContainer.style.fontSize = ALERT_STYLE.fontSize;
  alertContainer.style.textAlign = ALERT_STYLE.textAlign;
  alertContainer.style.lineHeight = ALERT_STYLE.lineHeight;
  alertContainer.style.backgroundColor = ALERT_STYLE.backgroundColor;

  alertContainer.textContent = message;
  alertContainer.classList.add('alert-item');
  document.body.append(alertContainer);
};

export const removeAlert = () => document.querySelector('.alert-item').remove();
