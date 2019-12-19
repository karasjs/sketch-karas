import { Document } from 'sketch/dom';
import UI from 'sketch/ui';
import Settings from 'sketch/settings';
import { getWebview } from 'sketch-module-web-view/remote';
import Library from './Library';

export function add2Library() {
  let document = Document.getSelectedDocument();
  let selection = document.selectedLayers;
  if(!selection || selection.isEmpty) {
    UI.alert('warn', 'At lease one layer must be selected!');
    return;
  }
  let json = Settings.documentSettingForKey(document, 'library') || {};
  let library = Library.parse(json);
  selection.layers.forEach(layer => {
    library.add(layer);
  });
  json = library.toJSON();
  Settings.setDocumentSettingForKey(document, 'library', json);
  let existingWebview = getWebview('sketch-karas.webview');
  if(existingWebview) {
    let webContents = existingWebview.webContents;
    webContents
      .executeJavaScript(`g_updateLibrary(${JSON.stringify(json)})`)
      .catch(console.error);
  }
}
