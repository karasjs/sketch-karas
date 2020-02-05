import React from 'react';
import { observer, inject } from 'mobx-react';

import LayerItem from './LayerItem';
import TimeLineItem from './TimeLineItem';
import layer from '../store/layer';
import timeline from '../store/timeline';
import global from '../store/global';

function calTime(t) {
  let hour = 0;
  let minute = 0;
  let second = 0;
  if(t >= 360000) {
    hour = Math.floor(t / 360000);
    t -= hour * 360000;
  }
  if(t >= 60000) {
    minute = Math.floor(t / 60000);
    t -= minute * 60000;
  }
  if(t >= 1000) {
    second = Math.floor(t / 1000);
    t -= second * 1000;
  }
  let ms = t;
  minute = String(minute);
  second = String(second);
  ms = String(ms * 1000).replace('.', '');
  if(minute.length < 2) {
    minute = '0' + minute;
  }
  if(second.length < 2) {
    second = '0' + second;
  }
  if(ms.length < 2) {
    ms = '00' + ms;
  }
  else if(ms.length < 3) {
    ms = '0' + ms;
  }
  else if(ms.length > 3) {
    ms = ms.slice(0, 3);
  }
  return {
    hour,
    minute,
    second,
    ms,
  };
}

function formatTime(t) {
  let {
    hour,
    minute,
    second,
    ms,
  } = calTime(t);
  return `${hour}:${minute}:${second}.${ms}`;
}

function frame2time(i, fps) {
  let {
    hour,
    minute,
    second,
    ms,
  } = calTime(i * 1000 / fps);
  return `${hour}:${minute}:${second}.${ms}`;
}

let isDrag;
let ox;

document.body.addEventListener('mousemove', e => {
  if(isDrag) {
    if(e.pageX > ox) {
      // 先算一格多长时间
      timeline.setCurrentTime(Math.floor((e.pageX - ox) / 10) * global.spf);
    }
    else {
      timeline.currentTime = 0;
    }
  }
});

document.body.addEventListener('mouseup', () => {
  isDrag = false;
});

@inject('timeline')
@inject('layer')
@inject('global')
@observer
class Timeline extends React.Component {
  del() {
    layer.delActive();
  }

  down(e) {
    e.preventDefault();
    isDrag = true;
    ox = this.el.getBoundingClientRect().left;
  }

  clickFrameNum(e) {
    e.preventDefault();
    isDrag = false;
    ox = this.el.getBoundingClientRect().left;
    timeline.setCurrentTime(Math.floor((e.pageX - ox) / 10) * global.spf);
  }

  clickKf(e) {
    e.preventDefault();
    let { list } = this.props.layer;
    for(let i = 0, len = list.length; i < len; i++) {
      let item = list[i];
      let { showEmpty, emptyTime } = item;
      if(showEmpty) {
        item.times.push(emptyTime);
        layer.save();
        return;
      }
    }
  }

  render() {
    let { currentTime, currentFrame, maxFrame } = this.props.timeline;
    let { fps } = this.props.global;
    let { list, showKf } = this.props.layer;
    return <div class="timeline">
      <div class="data">
        <div class="num">
          <span>{formatTime(currentTime * 1000)}</span>
          <span> / </span>
          <span>{currentFrame}</span>
        </div>
        <div class="layer">
          {
            list.slice(0).reverse().map(item => <LayerItem data={item} key={item.data.uuid}/>)
          }
        </div>
        <div class="fn">
          <span class="new"/>
          <span class="del" onClick={() => this.del()}/>
        </div>
      </div>
      <div class="panel">
        <ul class="btn">
          <li class="bezier"/>
          <li class={`kf ${showKf ? 'enable' : ''}`} onClick={e => this.clickKf(e)}/>
          <li class="start"/>
          <li class="play"/>
          <li class="end"/>
          <li class="repeat"/>
        </ul>
        <div class="frame-time" ref={el => this.el = el}>
          <ul class="frame-num" onClick={e => this.clickFrameNum(e)}>
            {
              new Array(Math.ceil(maxFrame)).fill(1).map((item, i) => {
                return <li key={i}>{i * 5}</li>;
              })
            }
          </ul>
          <div class="layer" onMouseDown={e => e.preventDefault()}>
            {
              list.slice(0).reverse().map(item => <TimeLineItem data={item} key={item.data.uuid}/>)
            }
          </div>
          <div class="time-num">
            {
              new Array(Math.ceil(maxFrame / 10)).fill(1).map((item, i) => {
                return <li key={i}>{frame2time(i * 10, fps)}</li>;
              })
            }
          </div>
          <div class="point"
               style={{
                 transform: `translateX(${currentFrame * 10}px)`,
               }}
               onMouseDown={e => this.down(e)}>
            <b/>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default Timeline;
