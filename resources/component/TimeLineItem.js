import React from 'react';
import { observer, inject } from 'mobx-react';

import global from '../store/global';
import layer from '../store/layer';

document.body.addEventListener('click', e => {
  // 添加关键帧不取消显示空白定位帧，点击定位本身也是
  if(e.target && e.target.classList) {
    if(e.target.classList.contains('kf') || e.target.classList.contains('empty')) {
      return;
    }
  }
  layer.clearShowEmpty();
  layer.save();
});

@observer
class TimeLineItem extends React.Component {
  click(e) {
    e.preventDefault();
    let { data } = this.props;
    let ox = this.el.getBoundingClientRect().left;
    let x = e.pageX;
    let needSave;
    // 点击到空白处即根元素，显示出定位帧以便添加
    if(e.target === this.el) {
      layer.clearShowEmpty();
      data.emptyTime = Math.floor((x - ox) / 10) * global.spf;
      data.showEmpty = true;
      needSave = true;
    }
    // 点在已有帧上
    // else if(e.target.classList.contains('frame') || e.target.classList.contains('frame-last')) {
    //   layer.clearShowEmpty();
    //   data.emptyTime = Math.floor((x - ox) / 10) * global.spf;
    //   data.showEmpty = true;
    //   needSave = true;
    // }
    if(!data.active) {
      layer.clearActive();
      data.active = true;
      needSave = true;
    }
    if(needSave) {
      layer.save();
    }
  }

  render() {
    let { times, showEmpty, emptyTime, active, data } = this.props.data;
    let keyFrames = [];
    for(let i = 0, len = times.length; i < len - 1; i++) {
      let item = times[i];
      let index = Math.floor(item / global.spf);
      let next = Math.floor(times[i + 1] / global.spf);
      keyFrames.push({
        index,
        length: Math.round(next - index),
      });
    }
    return <div class={`timeline-item ${active ? 'active' : ''}`}
                ref={el => this.el = el}
                onClick={e => this.click(e)}>
      {
        keyFrames.map((item, i) => (
          <div className="frame" key={i} style={{
          left: Math.round(item.index * 10),
          width: item.length * 10,
        }}/>))
      }
      <div className="frame-last" style={{
        left: Math.round(times[times.length - 1] * 10 / global.spf),
      }}/>
      {showEmpty && <div class="empty" style={{
        left: Math.round(emptyTime * 10 / global.spf),
      }}/>}
    </div>;
  }
}

export default TimeLineItem;
