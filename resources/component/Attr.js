import React from 'react';
import { observer, inject } from 'mobx-react';

@inject('attr')
@observer
class Attr extends React.Component {
  render() {
    let { enable, x, y, alpha, deg, w, h, skewX, skewY } = this.props.attr;
    return <div class="attr">
      <h3>属性</h3>
      <div class={`list ${enable ? 'enable' : ''}`}>
        <div class="item">
          <input type="number" defaultValue={x} readOnly={!enable}/>
          <span>X</span>
        </div>
        <div className="item">
          <input type="number" defaultValue={y} readOnly={!enable}/>
          <span>Y</span>
        </div>
        <div className="item">
          <input type="number" defaultValue={alpha} readOnly={!enable}/>
          <span>A</span>
        </div>
        <div className="item">
          <input type="number" defaultValue={w} readOnly={!enable}/>
          <span>W</span>
        </div>
        <div className="item">
          <input type="number" defaultValue={h} readOnly={!enable}/>
          <span>H</span>
        </div>
        <div className="item">
          <input type="number" defaultValue={deg} readOnly={!enable}/>
          <span>°</span>
        </div>
        <div className="item">
          <input type="number" defaultValue={skewX} readOnly={!enable}/>
          <span>SX</span>
        </div>
        <div className="item">
          <input type="number" defaultValue={skewY} readOnly={!enable}/>
          <span>SX</span>
        </div>
      </div>
    </div>;
  }
}

export default Attr;
