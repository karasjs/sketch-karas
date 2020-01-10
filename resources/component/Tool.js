import React from 'react';
import { observer, inject } from 'mobx-react';

@inject('tool')
@observer
class Tool extends React.Component {
  render() {
    let { type } = this.props.tool;
    return <div class="tool">
      <ul>
        <li class={`select ${type === 'select' && 'active'}`}/>
        <li class={`select2 ${type === 'select2' && 'active'}`}/>
        <li class={`hand ${type === 'hand' && 'active'}`}/>
      </ul>
    </div>;
  }
}

export default Tool;
