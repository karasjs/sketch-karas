import React from 'react';
import { observer, inject } from 'mobx-react';
import put from './put';

@inject('layer')
@observer
class Layer extends React.Component {
  componentDidMount() {
    document.body.addEventListener('mouseup', e => {
      if(put.isMove) {
        put.isDown = false;
        put.isMove = false;
        document.body.classList.remove('put');
        if(put.isEnter) {
          console.log(e);
          console.log(put.data);
        }
        put.data = null;
      }
    });
  }

  render() {
    return <div class="layer">1</div>;
  }
}

export default Layer;
