import { Document } from 'sketch/dom';
import UI from 'sketch/ui';
import parse from './parse';

function parseNormal(json) {
  let style = json.style;
  let res = {
    karasData: {
      style: {
        opacity: style.opacity,
      },
    },
  };
  ['type', 'id', 'name'].forEach(k => {
    res[k] = json[k];
  });
  // ['x', 'y'].forEach(k => {
  //   res.style[k === 'x' ? 'left' : 'top'] = json.frame[k];
  // });
  ['width', 'height'].forEach(k => {
    res.karasData.style[k] = json.frame[k];
  });
  // TODO: transform/style
  return res;
}

export default function() {
  let document = Document.getSelectedDocument();
  let selection = document.selectedLayers;
  if(!selection || selection.isEmpty) {
    UI.message('⚠️至少要选择一个图层！');
    return;
  }
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
  UI.message('🌈转换成功，数据已存入粘贴板！');
  return res;
}
