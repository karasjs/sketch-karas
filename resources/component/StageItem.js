import React from 'react';
import { observer, inject } from 'mobx-react';

@observer
class StageItem extends React.Component {
  componentDidMount() {
    const { data } = this.props;
    console.log(data);
  }

  render() {
    return <div class="stage-item">
      <div class="container" ref={el => this.container = el}/>
    </div>;
  }
}

export default StageItem;
