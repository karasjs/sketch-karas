import React from 'react';
import { observer, inject } from 'mobx-react';

import LibraryItem from './LibraryItem';
import preview from './preview.csx';

@inject('library')
@observer
class Library extends React.Component {
  componentDidUpdate() {
    let { current } = this.props.library;
    let el = this.el;
    if(!current) {
      el.innerHTML = '';
      return;
    }
    preview.library(current, el);
  }

  render() {
    let { list, current } = this.props.library;
    return <div class="library">
      <h3>库</h3>
      <div class="preview-l"
           title={current && current.id}
           ref={el => this.el = el}
      />
      <div class="list">
        {
          list.map(item => <LibraryItem
            key={item.id}
            data={item}
            current={item.id === (current && current.id)}
          />)
        }
      </div>
    </div>;
  }
}

export default Library;
