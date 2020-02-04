import React from 'react';
import { observer, inject } from 'mobx-react';

import preview from './preview.csx';

@observer
class StageItem extends React.Component {
  componentDidMount() {
    preview.init(this.props.data.data, this.el);
  }

  componentWillUnmount() {
    this.el.innerHTML = '';
  }

  componentDidUpdate() {
    this.el.innerHTML = '';
    preview.init(this.props.data, this.el);
  }

  render() {
    let { width, height } = this.props;
    return <svg class="stage-item"
                width={width}
                height={height}
                ref={el => this.el = el}/>;
  }
}

export default StageItem;
