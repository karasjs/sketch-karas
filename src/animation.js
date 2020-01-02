import BrowserWindow from 'sketch-module-web-view';
import { getWebview } from 'sketch-module-web-view/remote';
import { Document } from 'sketch/dom';
import UI from 'sketch/ui';
import Settings from 'sketch/settings';
import Library from './Library';

let webviewIdentifier = 'sketch-karas.webview';

export default function() {
  let document = Document.getSelectedDocument();
  let x = Settings.documentSettingForKey(document, 'x') || 0;
  let y = Settings.documentSettingForKey(document, 'y') || 0;
  let width = Settings.documentSettingForKey(document, 'width') || 800;
  let height = Settings.documentSettingForKey(document, 'height') || 600;
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
    Settings.setDocumentSettingForKey(document, 'width', width);
    Settings.setDocumentSettingForKey(document, 'height', height);
  });

  browserWindow.on('move', () => {
    ({ x, y } = browserWindow.getBounds());
    Settings.setDocumentSettingForKey(document, 'x', x);
    Settings.setDocumentSettingForKey(document, 'y', y);
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
  //   UI.message('UI loaded!');
  //   let json = Settings.documentSettingForKey(document, 'library') || {};
  //   let library = Library.parse(json);
  //   json = library.toJSON();
  //   webContents
  //     .executeJavaScript(`g_updateLibrary(${JSON.stringify(json)})`)
  //     .catch(console.error);
  // });

  // add a handler for a call from web content's javascript
  webContents.on('nativeLog', json => {
    let { key, value } = json;
    console.log(json);
    if(key === 'domReady') {
      let library = Settings.documentSettingForKey(document, 'library') || {};
      let timeline = Settings.documentSettingForKey(document, 'timeline') || {};
      let layer = Settings.documentSettingForKey(document, 'layer') || {};
      let global = Settings.documentSettingForKey(document, 'global') || {};
      webContents
        .executeJavaScript(`g_init(${JSON.stringify({
          library,
          timeline,
          layer,
          global,
        })})`)
        .catch(console.error);
    }
    else if(key === 'updateLayer') {
      Settings.setDocumentSettingForKey(document, 'layer', {
        list: value,
      });
    }
  });

  browserWindow.loadURL(require('../resources/index.html'));
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  let existingWebview = getWebview(webviewIdentifier);
  if(existingWebview) {
    existingWebview.close();
  }
}
