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
      UI.alert(`Can not add a page(${layer.id}) to library!`);
      return;
    }
    if(item.isArtBoard) {
      UI.alert(`Can not add an artBoard(${layer.id}) to library!`);
      return;
    }
    if(item.isHidden) {
      UI.alert(`Can not add a hidden layer(${layer.id}) to library!`);
      return;
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
