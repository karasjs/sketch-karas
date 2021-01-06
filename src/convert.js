import { Document } from 'sketch/dom';
import UI from 'sketch/ui';
import parse from './parse';
import message from './message';

export default function () {
  let document = Document.getSelectedDocument();
  let selection = document.selectedLayers;
  if (!selection || selection.isEmpty) {
    UI.message('⚠🚫至少要选择一个图层！🚫');
    return;
  }
  message.content = '';
  parse(selection.layers).then(res => {
    // 存入粘贴板
    if (!NSPasteboard) {
      let content = '🌈 转换错误！🌈';
      UI.message(content);
    }
    let pasteboard = NSPasteboard.generalPasteboard();
    pasteboard.clearContents();
    if (res.length > 1) {
      pasteboard.setString_forType(JSON.stringify(res), NSPasteboardTypeString);
    }
    else {
      pasteboard.setString_forType(JSON.stringify(res[0]), NSPasteboardTypeString);
    }
    let content = message.content || '🌈转换成功，数据已存入粘贴板！🌈';
    UI.message(content);
    console.log('-------完成--------')
    // return res;
  });
}
