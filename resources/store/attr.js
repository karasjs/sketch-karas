import { action, observable } from 'mobx';

class Attr {
  @observable enable = false;
  @observable x = '';
  @observable y = '';
  @observable deg = '';
  @observable w = '';
  @observable h = '';
}

export default new Attr();
