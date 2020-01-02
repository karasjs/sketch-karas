import React from 'react';
import { observer, inject } from 'mobx-react';

import StageItem from './StageItem';
import drag from './drag';

@inject('layer')
@inject('global')
@observer
class Stage extends React.Component {
  enter() {
    drag.isEnter = true;
  }
  leave() {
    drag.isEnter = false;
  }

  render() {
    const { width, height } = this.props.global;
    const { list } = this.props.layer;
    return <div
      class="stage"
      onMouseEnter={() => this.enter()}
      onMouseLeave={() => this.leave()}
      style={{
        width,
        height,
      }}>
      {
        list.map(item => <StageItem data={item}/>)
      }
    </div>;
  }
}

export default Stage;
