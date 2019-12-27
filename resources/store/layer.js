import { action, observable } from 'mobx';

class Layer {
  @observable visible = false;
}

export default new Layer();
