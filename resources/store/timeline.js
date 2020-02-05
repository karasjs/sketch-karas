import { action, observable, computed } from 'mobx';

import global from './global';

class Timeline {
  @observable currentTime = 0;
  @observable totalTime = 0;
  @computed get currentFrame() {
    let per = 1000 / global.fps;
    return Math.round(this.currentTime / per);
  }
  @computed get totalFrame() {
    let per = 1000 / global.fps;
    return Math.round(this.totalTime / per);
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
