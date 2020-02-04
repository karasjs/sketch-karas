import { Document } from 'sketch/dom';
import UI from 'sketch/ui';
import Settings from 'sketch/settings';

export function clearLayer() {
  let document = Document.getSelectedDocument();
  UI.getInputFromUser('Confirm to clear Layer(Y/N)', {
    initialValue: 'N',
  }, (err, value) => {
    if(err) {
      return;
    }
    if(value === 'Y' || value === 'y') {
      Settings.setDocumentSettingForKey(document, 'layer', null);
      UI.message('Layer cleared');
    }
  });
}
