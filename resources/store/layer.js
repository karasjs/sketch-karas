import { action, observable } from 'mobx';

import message from '../message';

class Layer {
  @observable list = [];
  @action update(v) {
    this.list = v || [];
  }
  @action add(o) {
    this.list.push(o);
    message.updateLayer(this.list);
  }
  @action clearActive() {
    this.list.forEach(item => item.active = false);
  }
  @action delActive() {
    for(let i = this.list.length - 1; i >= 0; i--) {
      if(this.list[i].active) {
        this.list.splice(i, 1);
      }
    }
    message.updateLayer(this.list);
  }
}

export default new Layer();
