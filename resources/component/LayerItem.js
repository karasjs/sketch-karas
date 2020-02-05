import React from 'react';
import { observer, inject } from 'mobx-react';

import layer from '../store/layer';

@observer
class LayerItem extends React.Component {
  click() {
    let { data } = this.props;
    if(!data.active) {
      layer.clearActive();
      data.active = true;
      layer.save();
    }
  }

  lock(e) {
    e.stopPropagation();
    let { data } = this.props;
    data.lock = !data.lock;
  }

  spread(e) {
    e.stopPropagation();
    let { data } = this.props;
    data.spread = !data.spread;
  }

  render() {
    let { data } = this.props;
    let { lock, spread, active, name, data: { uuid } } = data;
    return <div class={`layer-item ${active && 'active'}`} onClick={() => this.click()}>
      <div class={`lock ${lock && 'ing'}`} onClick={e => this.lock(e)}/>
      <div class="name" title={uuid}>{name}</div>
      <div class={`spread ${spread && 'ing'}`} onClick={e => this.spread(e)}/>
    </div>;
  }
}

export default LayerItem;
