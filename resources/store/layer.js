import { action, observable } from 'mobx';

import timeline from './timeline';
import message from '../message';

class Layer {
  count = 0; // 图层名字自动生成计数
  @observable list = [];
  @action update(v) {
    this.list = v || [];
  }
  @action add(data) {
    // 每层限制只允许一个元素出现
    this.list.push({
      times: [timeline.currentTime],
      active: true,
      data,
    });
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
