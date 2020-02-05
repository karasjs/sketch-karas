import React from 'react';
import { observer, inject } from 'mobx-react';
import lodash from 'lodash';
import uuidv4 from 'uuid/v4';

import type from '../../src/type';
import drag from './drag';
import layer from '../store/layer';
import library from '../store/library';

let timeout;

document.body.addEventListener('mousemove', e => {
  if(timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  if(drag.isDown) {
    drag.isMove = true;
  }
  if(drag.isMove) {
    document.body.classList.add('drag');
    if(drag.isEnter && drag.data) {
      drag.data.style.left = e.offsetX;
      drag.data.style.top = e.offsetY;
    }
  }
});
document.body.addEventListener('mouseup', () => {
  if(timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  if(drag.isMove && drag.isEnter && drag.data) {
    layer.add(drag.data);
  }
  document.body.classList.remove('drag');
  drag.isDown = false;
  drag.isMove = false;
  drag.isEnter = false;
  drag.data = null;
});

@inject('confirm')
@observer
class LibraryItem extends React.Component {
  edit() {
  }

  del() {
    let { id } = this.props.data;
    library.del(id);
  }

  down(e) {
    e.preventDefault();
    drag.isDown = true;
    // clone数据防止对库元素干扰，将clone的数据放入舞台
    drag.data = lodash.cloneDeep(this.props.data);
    drag.data.originStyle = lodash.cloneDeep(drag.data.style);
    drag.data.uuid = uuidv4();
    timeout = setTimeout(() => {
      drag.isMove = true;
      document.body.classList.add('drag');
    }, 100);
  }

  click() {
    library.setCurrent(this.props.data.id);
  }

  render() {
    let { name, id, current } = this.props.data;
    return <div class={`library-item ${current ? 'current' : ''}`}
                title={id}
                onClick={() => this.click()}>
      <div class="icon" onMouseDown={e => this.down(e)}/>
      <div class="name" onMouseDown={e => this.down(e)}>{name}</div>
      <div class="edit" onClick={() => this.edit()}/>
      <div class="del" onClick={() => this.del()}/>
    </div>;
  }

  get data() {
    return this.props.data;
  }
  get id() {
    return this.data.id;
  }
  get name() {
    return this.data.name;
  }
  get type() {
    return this.data.type;
  }
  get isMeta() {
    return [type.IMAGE, type.SHAPE, type.SHAPE_PATH, type.TEXT].indexOf(this.type) > -1;
  }
  get isGroup() {
    return this.type === type.GROUP;
  }
}

export default LibraryItem;
