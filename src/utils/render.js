import Abstract from '../view/absrtact.js';
import { RenderPosition } from '../const.js';


export const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }
  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};


export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const showPopup = (parent, child) => {
  if (child instanceof Abstract) {
    child = child.getElement();
  }
  const popup = parent.querySelector('.film-details');
  if (parent.contains(popup)) {
    popup.remove();
    parent.appendChild(child);
    return;
  }
  document.body.classList.add('hide-overflow');
  parent.appendChild(child);
};

export const hidePopup = (parent, child) => {
  if (child instanceof Abstract) {
    child = child.getElement();
  }
  document.body.classList.remove('hide-overflow');
  parent.removeChild(child);
};

