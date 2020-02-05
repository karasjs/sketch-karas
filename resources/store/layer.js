import { action, observable } from 'mobx';

import timeline from './timeline';
import message from '../message';

class Layer {
  count = 0; // 图层名字自动生成计数
  @observable list = [];
  @action init(v) {
    this.count = v.count || 0;
    this.list = v.list || [];
  }
  @action update(v) {
    this.list = v || [];
    this.save();
  }
  @action add(data) {
    let { list } = this;
    // 每层限制只允许一个元素出现，激活最新层
    list.forEach(item => {
      item.active = false;
    });
    list.push({
      times: [timeline.currentTime],
      active: true,
      data,
      name: `图层${this.count++}`,
    });
    this.save();
  }
  @action clearActive() {
    let { list } = this;
    list.forEach(item => item.active = false);
    this.save();
  }
  @action delActive() {
    let { list } = this;
    for(let i = list.length - 1; i >= 0; i--) {
      if(list[i].active) {
        list.splice(i, 1);
      }
    }
    this.save();
  }
  save() {
    message.updateLayer({
      count: this.count,
      list: this.list,
    });
  }
}

export default new Layer();
