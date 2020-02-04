import { action, observable, computed } from 'mobx';

import global from './global';

class Timeline {
  @observable currentTime = 0;
  @observable totalTime = 100;
  @computed get currentFrame() {
    let per = 1000 / global.fps;
    return Math.floor(this.currentTime / per);
  }
  @observable totalFrame = 100;
}

export default new Timeline();
