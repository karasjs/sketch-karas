import { action, observable } from 'mobx';

class Confirm {
  @observable visible = false;
}

export default new Confirm();
