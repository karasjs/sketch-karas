import React from 'react';
import { observer, inject } from 'mobx-react';

@inject('global')
@observer
class Global extends React.Component {
  render() {
    const { width, height, fps, enable } = this.props.global;
    return <div class="global">
      <h3>全局</h3>
      <div class="list">
        <div className="item">
          <input type="number" defaultValue={width} readOnly={!enable}/>
          <span>W</span>
        </div>
        <div className="item">
          <input type="number" defaultValue={height} readOnly={!enable}/>
          <span>H</span>
        </div>
        <div className="item">
          <input type="number" defaultValue={fps} readOnly={!enable}/>
          <span>FPS</span>
        </div>
      </div>
    </div>;
  }
}

export default Global;
