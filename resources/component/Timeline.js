import React from 'react';
import { observer, inject } from 'mobx-react';

import LayerItem from './LayerItem';
import TimeLineItem from './TimeLineItem';
import layer from '../store/layer';

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
  ms = String(ms).replace('.', '');
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

@inject('timeline')
@inject('layer')
@inject('global')
@observer
class Timeline extends React.Component {
  fps() {}

  del() {
    layer.delActive();
  }

  render() {
    let { currentTime, totalFrame } = this.props.timeline;
    let { fps } = this.props.global;
    let { list } = this.props.layer;
    return <div class="timeline">
      <div class="data">
        <div class="num">
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{totalFrame}</span>
          <span> / </span>
          <span onClick={() => this.fps()}>{fps}fps</span>
        </div>
        <div class="layer">
          {
            list.map(item => <LayerItem data={item} key={item.uuid}/>)
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
          <li class="kf"/>
          <li class="start"/>
          <li class="play"/>
          <li class="end"/>
          <li class="repeat"/>
        </ul>
        <div class="frame-time">
          <ul class="frame-num">
            {
              new Array(totalFrame).fill(1).map((item, i) => {
                if(i % 5 === 0) {
                  return <li key={i}>{i}</li>;
                }
                return <li key={i}/>
              })
            }
          </ul>
          <div class="layer">
            {
              list.map(item => <TimeLineItem data={item} key={item.uuid}/>)
            }
          </div>
          <div class="time-num">
            {
              new Array(Math.ceil(totalFrame / 10)).fill(1).map((item, i) => {
                return <li key={i}>{frame2time(i, fps)}</li>;
              })
            }
          </div>
          <div class="point"/>
        </div>
      </div>
    </div>;
  }
}

export default Timeline;
