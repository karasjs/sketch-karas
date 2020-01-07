import { action, observable } from 'mobx';

import message from '../message';

class Library {
  @observable list = [];
  @action update(v) {
    this.list = v || [];
  }
  @action del(id) {
    if(!id) {
      return;
    }
    for(let i = this.list.length - 1; i >= 0; i--) {
      if(this.list[i].id === id) {
        this.list.splice(i, 1);
      }
    }
    message.updateLibrary(this.list);
  }
}

export default new Library();
