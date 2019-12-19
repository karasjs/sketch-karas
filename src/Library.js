import UI from 'sketch/ui';
import LibraryItem from './LibraryItem';

class Library {
  constructor(json) {
    this._list = (json.list || []).map(item => {
      return new LibraryItem(item);
    });
  }

  add(layer) {
    let item = LibraryItem.fromNative(layer);
    if(item.isPage) {
      UI.alert('warn', `Can not add a page(${layer.name}/${layer.id}) to library!`);
      return;
    }
    if(item.isArtBoard) {
      UI.alert('warn', `Can not add an artBoard(${layer.name}/${layer.id}) to library!`);
      return;
    }
    if(item.isHidden) {
      UI.alert('warn', `Can not add a hidden layer(${layer.name}/${layer.id}) to library!`);
      return;
    }
    for(let i = 0; i < this.list.length; i++) {
      if(item.id === this.list[i].id) {
        UI.alert('warn', `Can not add duplicate layer(${layer.name}/${layer.id}) to library!`);
        return;
      }
    }
    this.list.push(item);
  }

  toJSON() {
    return {
      list: this.list.map(item => {
        return item.data;
      }),
    };
  }

  get list() {
    return this._list;
  }

  static parse(json) {
    return new Library(json);
  }
}

export default Library;
