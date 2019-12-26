import { action, observable } from 'mobx';

class Library {
  @observable list = [];
  @action update(v) {
    this.list = v || [];
  }
}

export default new Library();
