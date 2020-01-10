import { action, observable } from 'mobx';

class Timeline {
  @observable currentTime = 0;
  @observable totalFrame = 100;
}

export default new Timeline();
