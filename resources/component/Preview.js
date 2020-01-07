import React from 'react';
import { observer, inject } from 'mobx-react';

import drag from './drag';
import StageItem from './StageItem';

@inject('layer')
@inject('global')
@observer
class Preview extends React.Component {
  enter() {
    drag.isEnter = true;
  }
  leave() {
    drag.isEnter = false;
  }

  render() {
    const { width, height } = this.props.global;
    const { list } = this.props.layer;
    return <div class="preview">
      <div class="stage"
           onMouseEnter={() => this.enter()}
           onMouseLeave={() => this.leave()}
           style={{
             width,
             height,
           }}>
        {
          list.map(item => <StageItem data={item}/>)
        }
      </div>
    </div>;
  }
}

export default Preview;
