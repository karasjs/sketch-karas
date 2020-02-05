import { action, observable, computed } from 'mobx';

class Global {
  @observable enable = true;
  @observable width = 400;
  @observable height = 300;
  @observable fps = 60;
  @computed get spf() {
    return 1 / this.fps;
  }
}

export default new Global();
