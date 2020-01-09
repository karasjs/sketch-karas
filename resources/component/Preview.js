import React from 'react';
import { observer, inject } from 'mobx-react';

import drag from './drag';
import preview from './preview.csx';
import layer from '../store/layer';

@inject('global')
@observer
class Preview extends React.Component {
  init() {
    preview.init(layer.list, this.stage);
  }

  enter() {
    drag.isEnter = true;
  }

  leave() {
    drag.isEnter = false;
  }

  render() {
    const { width, height } = this.props.global;
    return <div class="preview">
      <div class="stage"
           ref={el => this.stage = el}
           onMouseEnter={() => this.enter()}
           onMouseLeave={() => this.leave()}
           style={{
             width,
             height,
           }}/>
    </div>;
  }
}

export default Preview;
