import { Document } from 'sketch/dom';
import UI from 'sketch/ui';
import Settings from 'sketch/settings';

export function clearLibrary() {
  let document = Document.getSelectedDocument();
  UI.getInputFromUser('Confirm to clear Library(Y/N)', {
    initialValue: 'N',
  }, (err, value) => {
    if(err) {
      return;
    }
    if(value === 'Y' || value === 'y') {
      Settings.setDocumentSettingForKey(document, 'library', null);
      UI.message('Library cleared');
    }
  });
}
