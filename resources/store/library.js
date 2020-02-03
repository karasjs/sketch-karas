import { action, observable } from 'mobx';

import message from '../message';

class Library {
  @observable list = [];
  @observable current = null;
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
  @action setCurrent(id) {
    if(!id) {
      return;
    }
    for(let i = 0, len = this.list.length; i < len; i++) {
      let item = this.list[i];
      if(item.id === id && !item.current) {
        item.current = true;
        this.current = item;
      }
      else if(item.id !== id && item.current) {
        item.current = false;
      }
    }
  }
}

export default new Library();
