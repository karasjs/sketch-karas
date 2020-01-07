import React from 'react';
import { observer, inject } from 'mobx-react';

import render from './render.csx';

@observer
class StageItem extends React.Component {
  componentDidMount() {
    let { data } = this.props;
    console.log(data);
    render.geom(this.props.data, this.container);
  }

  componentWillUnmount() {
    this.container.innerHTML = '';
  }

  render() {
    let { data } = this.props;
    let { style: { left, top, width, height } } = data;
    return <div class="stage-item"
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width,
                  height,
                }}>
      <div class="view"
           ref={el => this.container = el}
           style={{
             position: 'absolute',
             left: 0,
             top: 0,
             width: '100%',
             height: '100%',
           }}
      />
    </div>;
  }
}

export default StageItem;
