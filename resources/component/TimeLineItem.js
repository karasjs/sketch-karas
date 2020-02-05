import React from 'react';
import { observer, inject } from 'mobx-react';

import global from '../store/global';
import layer from '../store/layer';

document.body.addEventListener('click', () => {
  layer.clearSelectEmpty();
});

@observer
class TimeLineItem extends React.Component {
  click(e) {
    let { data } = this.props;
    // 点击到空白处即根元素，显示出定位帧以便添加
    if(e.target === this.el) {
      e.preventDefault();
      e.stopPropagation();
      layer.clearSelectEmpty();
      let per = 1000 / global.fps;
      let ox = this.el.getBoundingClientRect().left;
      let x = e.pageX;
      data.selectEmptyTime = Math.floor((x - ox) / 10) * per;
      data.selectEmpty = true;
    }
    if(!data.active) {
      layer.clearActive();
      data.active = true;
      layer.save();
    }
  }

  render() {
    let { times, selectEmpty, selectEmptyTime, data } = this.props.data;
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
    return <div class="timeline-item"
                ref={el => this.el = el}
                onClick={e => this.click(e)}>
      {
        keyFrames.map(item => <div className="frame" style={{
          left: Math.round(item.index * 10),
          width: item.length,
        }}><b/></div>)
      }
      <div className="frame-last" style={{
        left: times[times.length - 1] * 10,
      }}/>
      {selectEmpty && <div class="empty" style={{
        left: Math.round(selectEmptyTime * 10 / per),
      }}/>}
    </div>;
  }
}

export default TimeLineItem;
