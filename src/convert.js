import { Document } from 'sketch/dom';
import UI from 'sketch/ui';
import parse from './parse';
import message from './message';

export default function() {
  let document = Document.getSelectedDocument();
  let selection = document.selectedLayers;
  if(!selection || selection.isEmpty) {
    UI.message('⚠🚫至少要选择一个图层！🚫');
    return;
  }
  message.content = '';
  let res = selection.layers.map(layer => {
    return parse(layer);
  });
  // 存入粘贴板
  let pasteboard = NSPasteboard.generalPasteboard();
  pasteboard.clearContents();
  if(res.length > 1) {
    pasteboard.setString_forType(JSON.stringify(res), NSPasteboardTypeString);
  }
  else {
    pasteboard.setString_forType(JSON.stringify(res[0]), NSPasteboardTypeString);
  }
  let content = message.content || '🌈转换成功，数据已存入粘贴板！🌈';
  UI.message(content);
  return res;
}
