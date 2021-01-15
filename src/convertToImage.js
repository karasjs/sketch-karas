import sketch from 'sketch/dom';
import { Document } from 'sketch/dom';
import UI from 'sketch/ui';
import parse from './parse';
import message from './message';
import { Image, Rectangle } from 'sketch/dom';
import util from './util';

const {
  isNil,
  hex2rgba,
  getFillStyle,
  getBezierpts,
  getBorderStyle,
  getImageFormat,
  appKitWeightToCSSWeight,
  base64SrcEncodedFromNsData,
  uploadImage,
  saveImage,
} = util;

export default function () {
  let document = Document.getSelectedDocument();
  let selection = document.selectedLayers;
  if (!selection || selection.isEmpty) {
    UI.message('⚠🚫至少要选择一个图层！🚫');
    return;
  }
  message.content = '';

  // function parseShape (data, json, layer) {
  const options = { formats: 'png', output: false }
  let buffer;
  try {
    buffer = sketch.export(selection.layers, options)
  } catch (e) {
    console.log(e)
  };

  const imageLayer = new Image({
    image: buffer[0],
  })

  // 以exportFormats第一项为导入的样式，默认为png;
  // let fileFormat = getImageFormat('.png');
  let fileFormat = 'png';

  const base64Data = base64SrcEncodedFromNsData(imageLayer.image.nsdata, fileFormat);
  uploadImage(base64Data).then(res => {
    console.log(res);
    if (!NSPasteboard) {
      let content = '🌈 转换错误！🌈';
      UI.message(content);
    }
    let pasteboard = NSPasteboard.generalPasteboard();
    pasteboard.clearContents();
    pasteboard.setString_forType(res.url, NSPasteboardTypeString);
    // console.log(`(图片上传${uploadImageNumber} + 储存本地${saveImageNumber} + base64图片${base64ImageNumber}) / ${ImageQueue.length || 0}`)
  });

  // parseImage(data, imageLayer, imageLayer);


  // let content = message.content || '🌈转换成功，数据已存入粘贴板！🌈';
  // UI.message(content);
}
