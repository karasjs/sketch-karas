import React from 'react';
import { observer, inject } from 'mobx-react';

import LibraryItem from './LibraryItem';

@inject('library')
@observer
class Library extends React.Component {
  render() {
    const { list } = this.props.library;
    return <div class="library">
      {
        list.map(item => <LibraryItem key={item.id} data={item}/>)
      }
    </div>;
  }
}

export default Library;
