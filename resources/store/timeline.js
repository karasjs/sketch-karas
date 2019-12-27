import { action, observable } from 'mobx';

class Timeline {
  @observable currentTime = 0;
  @observable totalFrame = 0;
  @observable fps = 60;
}

export default new Timeline();
