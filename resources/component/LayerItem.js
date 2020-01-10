import React from 'react';
import { observer, inject } from 'mobx-react';

import layer from '../store/layer';

@observer
class LayerItem extends React.Component {
  click() {
    layer.clearActive();
    const { data } = this.props;
    data.active = true;
  }

  lock(e) {
    e.stopPropagation();
    const { data } = this.props;
    data.lock = !data.lock;
  }

  spread(e) {
    e.stopPropagation();
    const { data } = this.props;
    data.spread = !data.spread;
  }

  render() {
    const { data } = this.props;
    const { lock, name, uuid, spread, active } = data;
    return <div class={`layer-item ${active && 'active'}`} onClick={() => this.click()}>
      <div class={`lock ${lock && 'ing'}`} onClick={e => this.lock(e)}/>
      <div class="name" title={uuid}>{name}</div>
      <div class={`spread ${spread && 'ing'}`} onClick={e => this.spread(e)}/>
    </div>;
  }
}

export default LayerItem;
