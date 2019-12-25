import React from 'react';
import ReactDom from 'react-dom';

import Library from './Library';
import Tool from './Tool';
import Timeline from './Timeline';

// disable the context menu (eg. the right click menu) to have a more native feel
// document.addEventListener('contextmenu', (e) => {
//   e.preventDefault()
// });

class App extends React.Component {
  render() {
    return <>
      <Tool ref={el => this.tool = el}/>
      <div class="container">
        <div class="preview"/>
        <Timeline ref={el => this.timeline = el}/>
      </div>
      <Library ref={el => this.library = el}/>
    </>;
  }
}

let app = ReactDom.render(<App/>, document.getElementById('app'));

window.postMessage('nativeLog', 'dom-ready');

window.g_updateLibrary = json => {
  app.library.update(json);
};
