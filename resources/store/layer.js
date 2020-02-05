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
      item.active = false; // 激活选择当前图层
      item.selectEmpty = false; // 选中当前图层空白帧
      item.selectEmptyTime = 0;
    });
    list.push({
      times: [timeline.currentTime],
      active: true,
      selectEmpty: false,
      selectEmptyTime: 0,
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
  @action clearSelectEmpty() {
    this.list.forEach(item => {
      item.selectEmpty = false;
      item.selectEmptyTime = 0;
    });
  }
  save() {
    message.updateLayer({
      count: this.count,
      list: this.list,
    });
  }
}

export default new Layer();
