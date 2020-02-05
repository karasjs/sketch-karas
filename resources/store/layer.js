import { action, observable, computed } from 'mobx';
import uuidv4 from 'uuid/v4';

import message from '../message';
import global from './global';

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
  @action add(data, currentTime) {
    let { list } = this;
    // 每层限制只允许一个元素出现，激活最新层
    list.forEach(item => {
      item.active = false; // 激活选择当前图层
      item.showEmpty = false; // 选中当前图层空白帧
      item.emptyTime = 0;
    });
    list.push({
      uuid: uuidv4(),
      times: [currentTime],
      active: true,
      showEmpty: false,
      emptyTime: 0,
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
  @action clearshowEmpty() {
    this.list.forEach(item => {
      item.showEmpty = false;
      item.emptyTime = 0;
    });
  }
  @computed get showAnimate() {
    let { list } = this;
    for(let i = 0, len = list.length; i < len; i++) {
      if(list[i].active) {
        return true;
      }
    }
    return false;
  }
  @computed get showKf() {
    let { list } = this;
    for(let i = 0, len = list.length; i < len; i++) {
      if(list[i].showEmpty) {
        return true;
      }
    }
    return false;
  }
  @computed get maxTime() {
    let max = 0;
    this.list.forEach(item => {
      item.times.forEach(item2 => {
        max = Math.max(max, item2);
      });
    });
    return max;
  }
  @computed get maxFrame() {
    return Math.round(this.maxTime / global.spf);
  }
  save() {
    message.updateLayer({
      count: this.count,
      list: this.list,
    });
  }
}

export default new Layer();
