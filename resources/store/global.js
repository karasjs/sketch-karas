import { action, observable } from 'mobx';

class Global {
  @observable enable = true;
  @observable width = 400;
  @observable height = 300;
  @observable fps = 60;
}

export default new Global();
