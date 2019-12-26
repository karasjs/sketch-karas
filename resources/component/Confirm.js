import React from 'react';
import { observer, inject } from 'mobx-react';

@inject('confirm')
@observer
class Confirm extends React.Component {
  render() {
    let { visible } = this.props.confirm;
    if(!visible) {
      return null;
    }
    return <div class="confirm">
      <div class="c">1</div>
    </div>;
  }
}

export default Confirm;
