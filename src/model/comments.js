import AbstractObserver from '../utils/abstract-observer.js';

export default class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = null;
  }

  removeComments() {
    this._comments = null;
  }

  getComments() {
    return this._comments;
  }

  setComments(updateType, comments, movie) {
    this._comments = comments.slice();

    this._notify(updateType, movie);
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

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
    );
    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
    );
    return adaptedComment;
  }

}
