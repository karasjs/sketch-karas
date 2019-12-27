import React from 'react';
import { observer, inject } from 'mobx-react';

import Layer from './Layer';

function formatTime(t) {
  let hour = 0;
  let minute = 0;
  let second = 0;
  let ms = 0;
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
  ms = t;
  minute = String(minute);
  second = String(second);
  ms = String(ms);
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
  return `${hour}:${minute}:${second}.${ms}`;
}

@inject('timeline')
@observer
class Timeline extends React.Component {
  fps() {}

  render() {
    const { currentTime, totalFrame, fps } = this.props.timeline;
    return <div class="timeline">
      <div class="data">
        <div class="num">
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{totalFrame}</span>
          <span> / </span>
          <span onClick={() => this.fps()}>{fps}fps</span>
        </div>
        <Layer/>
        <div class="fn">
          <span class="new"/>
          <span class="del"/>
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
      </div>
    </div>;
  }
}

export default Timeline;
