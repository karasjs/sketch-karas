import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'mobx-react';

import store from './store';

import Library from './component/Library';
import Tool from './component/Tool';
import Timeline from './component/Timeline';
import Confirm from './component/Confirm';
import Preview from './component/Preview';
import Global from './component/Global';
import message from './message';

// disable the context menu (eg. the right click menu) to have a more native feel
// document.addEventListener('contextmenu', e => {
//   e.preventDefault();
// });

class App extends React.Component {
  render() {
    return <>
      <Tool/>
      <div class="container">
        <Preview ref={el => this.preview = el}/>
        <Timeline/>
      </div>
      <div class="side">
        <Global/>
        <Library/>
      </div>
      <Confirm/>
    </>;
  }
}

ReactDom.render(
  <Provider {...store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);

window.g_init = json => {
  console.log('g_init', json);
  store.library.update(json.library.list);
  store.layer.update(json.layer.list);
};

window.g_updateLibrary = json => {
  store.library.update(json.list);
};

message.domReady();
