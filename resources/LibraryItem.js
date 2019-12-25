import React from 'react';
import karas from 'karas';

import type from '../src/type';

class LibraryItem extends React.Component {
  componentDidMount() {
    console.log(this.data);
    if(this.isMeta) {
      let { points, style, style: { width, height } } = this.data;
      let scale = Math.min(16 / width, 16 / height);
      console.log(width, height, scale, width * scale, height * scale);
      karas.render(
        karas.createVd('svg', [
          ['width', 16],
          ['height', 16],
        ], [
          karas.createGm('$polygon', [
            ['points', points],
            ['style', {
              position: 'absolute',
              left: (16 - width * scale) * 0.5,
              top: ( 16 - height * scale) * 0.5,
              margin: '0 auto',
              width: width * scale,
              height: height * scale,
              fill: style.fill,
              stroke: style.stroke,
              strokeWidth: style.strokeWidth * scale,
            }],
          ]),
        ]),
        this.icon
      );
    }
  }

  render() {
    const { name } = this.data;
    return <div class="library-item">
      <div class="icon" ref={el => this.icon = el}/>
      <div class="name">{name}</div>
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
