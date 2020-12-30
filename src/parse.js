import sketch from 'sketch/dom';
import util from './util';
import TYPE_ENUM from './type';

const { isNil, hex2rgba } = util;

function parse(layer, json, isChildren) {
  json = json || sketch.fromNative(layer);
  // console.log(layer);
  console.log(json);
  let data = {
    tagName: '',
  };
  parseNormal(data, json, layer, isChildren);
  if(json.type === TYPE_ENUM.SHAPE_PATH) {
    parseShapePath(data, json, layer, isChildren);
  }
  else if(json.type === TYPE_ENUM.SHAPE) {
    parseShape(data, json, layer, isChildren);
  }
  else if(json.type === TYPE_ENUM.IMAGE) {
    parseImage(data, json, layer, isChildren);
  }
  else if(json.type === TYPE_ENUM.TEXT) {
    parseText(data, json, layer, isChildren);
  }
  else if(json.type === TYPE_ENUM.GROUP || json.type === TYPE_ENUM.SYMBOL_MASTER) {
    parseGroup(data, json, layer, isChildren);
  }
  else if(json.type === TYPE_ENUM.ARTBOARD) {
    parseArtboard(data, json, layer, isChildren);
  }
  else if(json.type === TYPE_ENUM.SYMBOL_INSTANCE) {
    parseSymbolInstance(data, json, layer, isChildren);
  }
  return data;
}

function parseNormal(data, json, layer, isChildren) {
  let { style, transform } = json;
  ['id', 'name'].forEach(k => {
    data[k] = json[k];
  });
  data.props = {};
  data.props.style = {
    position: 'absolute',
  };
  // 组里的元素相对父位置
  if(isChildren) {
    // sketch 为 x / y, karas 为 left / top
    data.props.style.left = json.frame.x;
    data.props.style.top = json.frame.y;
  }
  ['width', 'height'].forEach(k => {
    data.props.style[k] = json.frame[k];
  });
  if(!isNil(style.opacity) && style.opacity !== 1) {
    data.props.style.opacity = style.opacity;
  }
  if(transform.rotation) {
    data.props.style.rotateZ = transform.rotation;
  }
  if(transform.flippedHorizontally) {
    data.props.style.scaleX = -1;
  }
  if(transform.flippedVertically) {
    data.props.style.scaleY = -1;
  }
  return data;
}

function parseShape(data, json, layer) {
  data.tagName = 'div';
  console.log(json, '====shape')
  data.children = [];
  let document = sketch.getSelectedDocument();
  // 递归每一层的layer
  for(let i = 0; i < json.layers.length; i++) {
    let layerJson = json.layers[i];
    let layer = document.getLayerWithID(layerJson.id);
    let layerData = parse(layer, layerJson, true);
    data.children.push(layerData);
  }
  return data;
}



function parseShapePath(data, json, layer) {
  data.tagName = '$polygon';
  let { points, style: { fills, borders, borderOptions } } = json;
  // 点和控制点
  let pts = [];
  let cts = [];
  // 是否都是直线
  let hasControl;

  // console.log('---------', json);
  (points || []).forEach((item, index) => {
    let { point, curveFrom, pointType } = item;
    let nextPoint = index === points.length - 1 ? points[0] : points[index + 1];
    let { curveTo, pointType: nextPointType } = nextPoint;
    pts.push([point.x, point.y]);
    if(!json.closed && index === points.length - 1) {
      // polyline
      return;
    }
    // sketch导出的curveFrom和curveTo有问题，如果是straight，应该直接是point
    if(nextPointType === 'Straight') {
      curveTo = nextPoint.point;
    }
    if(pointType === 'Straight' && nextPointType === 'Straight') {
      cts.push(null);
    }
    else {
      cts.push([curveFrom.x, curveFrom.y, curveTo.x, curveTo.y]);
      hasControl = true;
    }
  });
  data.props.points = pts;
  if(hasControl) {
    data.props.controls = cts;
  }
  // 描绘属性，取第一个可用的，无法多个并存
  if(fills && fills.length) {
    let fill = util.getFillStyle(fills, json);
    if(fill) {
      data.props.style.fill = fill;
    }
  }

  // TODO: 为啥要初始化 transparent
  data.props.style.stroke = 'transparent';
  if(borders && borders.length) {
    let borderStyle = util.getBorderStyle(borders, borderOptions);
    if(borderStyle) {
      data.props.style.strokeWidth = borderStyle.width;
      data.props.style.stroke = hex2rgba(borderStyle.color);
      data.props.style.strokeDasharray = borderStyle.strokeDasharray;
      data.props.style.strokeLinecap = borderStyle.strokeLinecap;
    }
  }
  else {
    data.props.strokeWidth = 0;
  }
  console.log(data)
  return data;
}

function parseImage(data, json, layer) {
  data.tagName = 'img';
  let {
    style: { borders, borderOptions },
    exportFormats,
  } = json;
  // 以exportFormats第一项为导入的样式，默认为png;
  let fileFormat = util.getImageFormat(exportFormats);
  data.props.src = util.base64SrcEncodedFromNsData(layer.image.nsdata, fileFormat);
  let borderStyle = util.getBorderStyle(borders, borderOptions);
  if(borderStyle) {
    data.props.style.border = `${borderStyle.width}px ${borderStyle.strokeDasharray ? 'dashed' : 'solid'} ${borderStyle.color}`;
  }
  return data;
}

function parseText(data, json, layer) {
  data.tagName = 'span';
  ['fontSize', 'fontFamily'].forEach(k => {
    data.props.style[k] = json.style && json.style[k];
  });
  data.props.style.fontWeight = util.appKitWeightToCSSWeight(json.style.fontWeight);
  data.props.style.textAlign = json.style.alignment;
  data.props.style.color = hex2rgba(json.style.textColor);
  // fillColor override
  let fillStyle = util.getFillStyle(json.style.fills);
  if(fillStyle && fillStyle.color) {
    data.props.style.color = hex2rgba(fillStyle.color);
  }
  // 0 - variable width (fixed height)
  // 1 - variable height (fixed width)
  // 2 - fixed width and height
  const textBehaviour = layer.sketchObject.textBehaviour();
  if(textBehaviour === 0) {
    delete data.props.style.width;
  }
  else if(textBehaviour === 1) {
    delete data.props.style.height;
  }
  data.children = [json.text];
  return data;
}

function parseGroup(data, json, layer) {
  data.tagName = 'div';
  data.children = [];
  let document = sketch.getSelectedDocument();
  // 递归每一层的layer
  for(let i = 0; i < json.layers.length; i++) {
    let layerJson = json.layers[i];
    let layer = document.getLayerWithID(layerJson.id);
    let layerData = parse(layer, layerJson, true);
    data.children.push(layerData);
  }
  return data;
}

function parseArtboard(data, json, layer) {
  data.tagName = 'div';
  data.children = [];
  let document = sketch.getSelectedDocument();
  // 递归每一层的layer
  for(let i = 0; i < json.layers.length; i++) {
    let layerJson = json.layers[i];
    let layer = document.getLayerWithID(layerJson.id);
    let layerData = convert(layer, layerJson);
    data.children.push(layerData);
  }
  if(json.background.enabled && json.background.color) {
    data.props.style.backgroundColor = json.background.color;
  }
  return data;
}

function parseSymbolInstance(data, json, layer) {}

export default parse;
