import Abstract from './absrtact';

const createFilmsTemplate = () => '<section class="films"></section>';

export default class Films extends Abstract {
  getTemplate () {
    return createFilmsTemplate();
  }
}

