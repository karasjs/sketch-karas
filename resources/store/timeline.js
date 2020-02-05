import { action, observable, computed } from 'mobx';

import global from './global';

class Timeline {
  @observable currentTime = 0;
  @observable totalTime = 0;
  @computed get currentFrame() {
    return Math.round(this.currentTime / global.spf);
  }
  @computed get totalFrame() {
    return Math.round(this.totalTime / global.spf);
  };
  @computed get maxFrame() {
    return Math.max(this.totalFrame, 100);
  }
  @action setCurrentTime(v) {
    if(v <= this.totalTime) {
      this.currentTime = v;
    }
  }
}

export default new Timeline();
