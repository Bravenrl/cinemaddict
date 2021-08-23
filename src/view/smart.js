import Abstract from './absrtact.js';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update, justDataUpdate) {

    if (!update) {
      return;
    }

    this._data = Object.assign({}, this._data, update);

    if (justDataUpdate) {
      return;
    }
    this.updateElement();
    this.restoreHandlers();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    const currentScroll = prevElement.scrollTop;
    parent.replaceChild(newElement, prevElement);
    newElement.scrollTop = currentScroll;
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
