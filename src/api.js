//import MoviesModel from './model/movies.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

// const SuccessHTTPStatusRange = {
//   MIN: 200,
//   MAX: 299,
// };

export default class Api {
  constructor(endPoint, authorization, structure, structureModel) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._structure = structure;
    this._model = structureModel;
  }

  getData() {
    return this._load({url: `${this._structure}`})
      .then(Api.toJSON)
      .then((data) => data.map(this._model.adaptToClient));

  }

  updateData(data) {
    return this._load({
      url: `${this._structure}/${data.id}`,
      method: Method.PUT,
      body: JSON.stringify(this._model.adaptToServer(data)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(this._model.adaptToClient);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}


