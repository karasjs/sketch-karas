import React from 'react';
import { observer, inject } from 'mobx-react';

import put from './put';

@inject('layer')
@inject('global')
@observer
class Stage extends React.Component {
  enter() {
    put.isEnter = true;
  }
  leave() {
    put.isEnter = false;
  }

  render() {
    const { width, height } = this.props.global;
    return <div
      id="stage"
      class="stage"
      onMouseEnter={() => this.enter()}
      onMouseLeave={() => this.leave()}
      style={{
        width,
        height,
      }}>
      1
    </div>;
  }
}

export default Stage;
