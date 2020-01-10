import { action, observable } from 'mobx';

class Tool {
  @observable type = 'select';
}

export default new Tool();
