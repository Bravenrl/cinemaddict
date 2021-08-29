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
    case RenderPosition.BEFOREBEGIN:
      container.before(child);
  }
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;
  const currentScrollTop = oldChild.scrollTop;
  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }
  parent.replaceChild(newChild, oldChild);
  newChild.scrollTop = currentScrollTop;
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

