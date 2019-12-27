import { action, observable } from 'mobx';

class Global {
  @observable fps = 60;
  @observable width = 400;
  @observable height = 300;
  @observable bgc = 'transparent';
}

export default new Global();
