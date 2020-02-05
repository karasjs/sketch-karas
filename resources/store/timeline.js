import { action, observable, computed } from 'mobx';

import global from './global';

class Timeline {
  @observable currentTime = 0;
  @computed get currentFrame() {
    return Math.round(this.currentTime / global.spf);
  }
  @action setCurrentTime(v) {
    this.currentTime = v;
  }
}

export default new Timeline();
