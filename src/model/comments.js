import AbstractObserver from '../utils/abstract-observer.js';

export default class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  get comments() {
    return this._comments;
  }

  set comments(comments) {
    this._comments = comments.slice();
  }

  addComment(updateType, updateMovie, updateComment) {
    this._comments = [
      updateComment,
      ...this._comments,
    ];

    this._notify(updateType, updateMovie);
  }

  deleteComment(updateType, updateMovie, updateComment) {
    const index = this._comments.findIndex((comment) => comment.id === updateComment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._notify(updateType, updateMovie);
  }
}
