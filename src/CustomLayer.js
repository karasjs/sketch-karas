import type from './type';

class CustomLayer {
  constructor(layer, top) {
    this._layer = layer;
    this._top = top;
  }

  get layer() {
    return this._layer;
  }
  get top() {
    return this._top;
  }
  get id() {
    return this.layer.id;
  }
  get name() {
    return this.layer.name;
  }
  get type() {
    return this.layer.type;
  }
  get isMeta() {
    return [type.IMAGE, type.SHAPE, type.SHAPE_PATH, type.TEXT].indexOf(this.type) > -1;
  }
  get x() {
    return this.layer.frame.x;
  }
  get y() {
    return this.layer.frame.y;
  }
  get xs() {
    let x = this.x;
    let parent = this.layer.parent;
    while(parent && parent.id !== this.top.id) {
      x += parent.frame.x;
      parent = parent.parent;
    }
    return x;
  }
  get ys() {
    let y = this.y;
    let parent = this.layer.parent;
    while(parent && parent.id !== this.top.id) {
      y += parent.frame.y;
      parent = parent.parent;
    }
    return y;
  }
}

export default CustomLayer;
