import type from './type';
import convert from './convert';

class LibraryItem {
  constructor(data) {
    this._data = data;
  }

  get data() {
    return this._data;
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
  get isPage() {
    return this.type === type.PAGE;
  }
  get isArtBoard() {
    return this.type === type.ARTBOARD;
  }
  get isHidden() {
    return !!this.data.hidden;
  }
  get style() {
    return this.data.style;
  }

  static fromNative(layer) {
    return new LibraryItem(convert(layer));
  }
}

export default LibraryItem;
