import React from 'react';
import { observer, inject } from 'mobx-react';

import global from '../store/global';

@observer
class TimeLineItem extends React.Component {
  render() {
    let { times, data } = this.props.data;
    let keyFrames = [];
    let per = 1000 / global.fps;
    for(let i = 0, len = times.length; i < len - 1; i++) {
      let item = times[i];
      let index = Math.floor(item / per);
      let next = Math.floor(times[i + 1] / per);
      keyFrames.push({
        index,
        length: next - index,
      });
    }
    return <div class="timeline-item">
      {
        keyFrames.map(item => <div className="frame" style={{
          left: item.index * 10,
          width: item.length,
        }}><b/></div>)
      }
      <div className="frame-last" style={{
        left: times[times.length - 1] * 10,
      }}/>
    </div>;
  }
}

export default TimeLineItem;
