import React from 'react';

import LibraryItem from './LibraryItem';

class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  update(json) {
    this.setState({
      ...json,
    });
  }

  render() {
    const { list = [] } = this.state;
    return <div class="library">
      {
        list.map(item => <LibraryItem key={item.id} data={item}/>)
      }
    </div>;
  }
}

export default Library;
