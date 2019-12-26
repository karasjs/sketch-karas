import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'mobx-react';

import store from './store';

import Library from './component/Library';
import Tool from './component/Tool';
import Timeline from './component/Timeline';
import Confirm from './component/Confirm';

// disable the context menu (eg. the right click menu) to have a more native feel
// document.addEventListener('contextmenu', (e) => {
//   e.preventDefault()
// });

class App extends React.Component {
  render() {
    return <>
      <Tool/>
      <div class="container">
        <div class="preview"/>
        <Timeline/>
      </div>
      <Library/>
      <Confirm/>
    </>;
  }
}

let app = ReactDom.render(
  <Provider {...store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);

window.postMessage('nativeLog', 'dom-ready');

window.g_updateLibrary = json => {
  store.library.update(json.list);
};
