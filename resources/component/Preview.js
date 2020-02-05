import React from 'react';
import { observer, inject } from 'mobx-react';

import drag from './drag';
import layer from '../store/layer';
import StageItem from './StageItem';

@inject('global')
@inject('layer')
@observer
class Preview extends React.Component {
  componentDidMount() {
    this.stage.addEventListener('click', this.click.bind(this));
  }

  enter() {
    drag.isEnter = true;
  }

  leave() {
    drag.isEnter = false;
  }

  click(e) {
    console.log(e);
  }

  render() {
    let { width, height } = this.props.global;
    let { list } = this.props.layer;
    return <div class="preview">
      <div class="stage"
           ref={el => this.stage = el}
           onMouseEnter={() => this.enter()}
           onMouseLeave={() => this.leave()}
           style={{
             width,
             height,
           }}>
        {
          list.reverse().map(item =>
            <StageItem
              data={item}
              width={width}
              height={height}
              key={item.data.uuid}
            />)
        }
      </div>
    </div>;
  }
}

export default Preview;
