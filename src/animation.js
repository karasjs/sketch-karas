import BrowserWindow from 'sketch-module-web-view';
import { getWebview } from 'sketch-module-web-view/remote';
import { Document } from 'sketch/dom';
import UI from 'sketch/ui';
import Settings from 'sketch/settings';
import Library from "./Library";

let webviewIdentifier = 'sketch-karas.webview';

export default function() {
  let x = Settings.settingForKey('x') || 0;
  let y = Settings.settingForKey('y') || 0;
  let width = Settings.settingForKey('width') || 800;
  let height = Settings.settingForKey('height') || 600;
  let options = {
    identifier: webviewIdentifier,
    x,
    y,
    width,
    height,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#1d1e1f',
    show: true,
  };

  let browserWindow = new BrowserWindow(options);

  browserWindow.on('resize', () => {
    [width, height] = browserWindow.getSize();
    Settings.setSettingForKey('width', width);
    Settings.setSettingForKey('height', height);
  });

  browserWindow.on('move', () => {
    ({ x, y } = browserWindow.getBounds());
    Settings.setSettingForKey('x', x);
    Settings.setSettingForKey('y', y);
  });

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show();
  });

  let webContents = browserWindow.webContents;


  webContents.on('did-finish-load', () => {
    UI.message('UI loaded!');
    // console.log('did-finish-load');
  });

  webContents.on('did-frame-finish-load', () => {
    // console.log('did-frame-finish-load');
  });

  // print a message when the page loads
  // webContents.on('dom-ready', () => {
  //   console.log('dom-ready');
  //   UI.message('UI loaded!');
  //   let json = Settings.documentSettingForKey(document, 'library') || {};
  //   let library = Library.parse(json);
  //   json = library.toJSON();
  //   webContents
  //     .executeJavaScript(`g_updateLibrary(${JSON.stringify(json)})`)
  //     .catch(console.error);
  // });

  // add a handler for a call from web content's javascript
  webContents.on('nativeLog', s => {
    UI.message(s);
    if (s === 'dom-ready') {
      let document = Document.getSelectedDocument();
      let json = Settings.documentSettingForKey(document, 'library') || {};
      let library = Library.parse(json);
      json = library.toJSON();
      webContents
        .executeJavaScript(`g_updateLibrary(${JSON.stringify(json)})`)
        .catch(console.error);j
    }
  });

  browserWindow.loadURL(require('../resources/index.html'));
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  let existingWebview = getWebview(webviewIdentifier);
  if (existingWebview) {
    existingWebview.close();
  }
}

let timeout;

export function onSelectionChangedBegin() {
  // let existingWebview = getWebview(webviewIdentifier);
  // if(existingWebview) {
  //   let webContents = existingWebview.webContents;
  //   if(timeout) {
  //     clearTimeout(timeout);
  //   }
  //   webContents
  //     .executeJavaScript(`changeDisabled(true)`)
  //     .catch(console.error);
  // }
}

export function onSelectionChangedFinish(context) {
  // let existingWebview = getWebview(webviewIdentifier);
  // if(existingWebview) {
  //   let webContents = existingWebview.webContents;
  //   if(timeout) {
  //     clearTimeout(timeout);
  //   }
  //   timeout = setTimeout(() => {
  //     let newSelection = context.actionContext.newSelection;
  //     let json;
  //     if(newSelection.length === 1) {
  //       let layer = newSelection[0];
  //       // layer = sketch.fromNative(layer);
  //       // console.log(JSON.stringify(layer));
  //       // let customLayer = new CustomLayer(layer);
  //     }
  //     else {
  //       newSelection = null;
  //     }
  //     webContents
  //       .executeJavaScript(`changeDisabled(true)`)
  //       .catch(console.error);
  //   }, 200);
  // }
}
