import sketch from 'sketch/dom';
import { Image, Rectangle } from 'sketch/dom';

import util from './util';
import TYPE_ENUM from './type';

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

const ImageQueue = [];

function parse (layers) {
  console.log(JSON.stringify(layers))
  const data = layers.map(layer => parseLayer(layer));
  let uploadImageNumber = 0;
  let saveImageNumber = 0;
  let base64ImageNumber = 0;
  return new Promise((resolve, reject) => {
    Promise.all(ImageQueue.map(image => {
      const base64Data = image.props.src;
      if (base64Data.length < 4000) {
        base64ImageNumber++;
        return Promise.resolve();
      }
      return uploadImage(base64Data).then(res => {
        if (res != null) {
          image.props.src = res.url;
          uploadImageNumber++;
        } else {
          saveImage(image._layer);
          saveImageNumber++;
        }
        delete image._layer;
        console.log(`(图片上传${uploadImageNumber} + 储存本地${saveImageNumber} + base64图片${base64ImageNumber}) / ${ImageQueue.length || 0}`)
      });
    })).then(res => {
      resolve(data);
    });
  });
}

function parseLayer (layer, json, isChildren) {
  json = json || sketch.fromNative(layer);

  let data = {
    tagName: 'div',
  };
  // hidden 暂时直接去掉
  if (json.hidden) {
    return {
      tagName: 'div',
      children: [],
    };
  }

  parseNormal(data, json, layer, isChildren);
  if (json.type === TYPE_ENUM.SHAPE_PATH) {
    parseShapePath(data, json, layer, isChildren);
  }
  else if (json.type === TYPE_ENUM.SHAPE) {
    parseShape(data, json, layer, isChildren);
  }
  else if (json.type === TYPE_ENUM.IMAGE) {
    parseImage(data, json, layer, isChildren);
  }
  else if (json.type === TYPE_ENUM.TEXT) {
    parseText(data, json, layer, isChildren);
  }
  else if (json.type === TYPE_ENUM.GROUP || json.type === TYPE_ENUM.SYMBOL_MASTER) {
    parseGroup(data, json, layer, isChildren);
  }
  else if (json.type === TYPE_ENUM.ARTBOARD) {
    parseArtboard(data, json, layer, isChildren);
  }
  else if (json.type === TYPE_ENUM.SYMBOL_INSTANCE) {
    parseSymbolInstance(data, json, layer, isChildren);
  }
  return data;
}

function parseNormal (data, json, layer, isChildren) {
  let { style = {}, transform } = json;
  ['id', 'name'].forEach(k => {
    data[k] = json[k];
  });
  data.props = {};
  data.props.style = {
    position: 'absolute',
  };
  // 组里的元素相对父位置
  if (isChildren) {
    // sketch 为 x / y, karas 为 left / top
    data.props.style.left = json.frame.x;
    data.props.style.top = json.frame.y;
  }
  ['width', 'height'].forEach(k => {
    data.props.style[k] = json.frame[k];
  });
  if (!isNil(style.opacity) && style.opacity !== 1) {
    data.props.style.opacity = style.opacity;
  }
  if (transform.rotation) {
    data.props.style.rotateZ = transform.rotation;
  }
  if (transform.flippedHorizontally) {
    data.props.style.scaleX = -1;
  }
  if (transform.flippedVertically) {
    data.props.style.scaleY = -1;
  }

  // 目前只支持高斯模糊
  if (style.blur.enabled &&
    style.blur.blurType === 'Gaussian' &&
    style.blur.radius > 0
  ) {
    data.props.style.filter = `blur(${style.blur.radius}px)`;
  }

  return data;
}

function parseShape (data, json, layer) {
  const options = { formats: 'png', output: false }
  let buffer;
  try {
    buffer = sketch.export(json.layers, options)
  } catch (e) {
    return ({
      tagName: 'div',
      children: [],
    });
  };

  const imageLayer = new Image({
    image: buffer[0],
  })
  parseImage(data, imageLayer, imageLayer);

  return data;
}

function parseShapePath (data, json, layer) {
  data.tagName = '$polygon';
  let { points, frame: { width, height }, style: { fills, borders, borderOptions } } = json;
  // 点和控制点
  let pts = [];
  let cts = [];
  // 是否都是直线
  let hasControl;

  (points || []).forEach((item, index) => {
    let { point, curveFrom, pointType, cornerRadius } = item;
    let nextPoint = index === points.length - 1 ? points[0] : points[index + 1];
    let lastPoint = index === 0 ? points[points.length - 1] : points[index - 1];
    let { curveTo, pointType: nextPointType } = nextPoint;

    if (pointType === 'Straight' && cornerRadius > 0) {
      const P0 = [lastPoint.point.x * width, lastPoint.point.y * height];
      const P1 = [point.x * width, point.y * height];
      const P2 = [nextPoint.point.x * width, nextPoint.point.y * height];
      const {
        M1,
        C1,
        C2,
        C3,
      } = getBezierpts(P0, P1, P2, cornerRadius);

      pts.push([M1[0] / width, M1[1] / height]);
      pts.push([C3[0] / width, C3[1] / height]);
      cts.push([C1[0] / width, C1[1] / height, C2[0] / width, C2[1] / height], []);
      hasControl = true;
    }
    else {

      pts.push([point.x, point.y]);
      if (!json.closed && index === points.length - 1) {
        return;
      }

      // sketch导出的curveFrom和curveTo有问题，如果是straight，应该直接是point
      if (nextPointType === 'Straight') {
        curveTo = nextPoint.point;
      }
      if (pointType === 'Straight' && nextPointType === 'Straight') {
        cts.push(null);
      }
      else {
        cts.push([curveFrom.x, curveFrom.y, curveTo.x, curveTo.y]);
        hasControl = true;
      }
    }
    data.props.points = pts;
    if (hasControl) {
      data.props.controls = cts;
    }

  });


  // 描绘属性，取第一个可用的，无法多个并存
  if (fills && fills.length) {
    const fillsStyle = [];
    for (let i = 0; i < fills.length; i++) {
      const fill = getFillStyle(fills[i], json);
      fillsStyle.push(fill);
    }
    if (fillsStyle) {
      data.props.style.fill = fillsStyle;
    }
  }

  if (borders && borders.length) {
    let borderStyle = getBorderStyle(borders, borderOptions);
    if (borderStyle) {
      data.props.style.strokeWidth = borderStyle.width;
      data.props.style.stroke = hex2rgba(borderStyle.color);
      data.props.style.strokeDasharray = borderStyle.strokeDasharray;
      data.props.style.strokeLinecap = borderStyle.strokeLinecap;
    } else {
      data.props.style.strokeWidth = 0;
    }
  }
  else {
    data.props.style.strokeWidth = 0;
  }
  return data;
}

function parseImage (data, json, layer) {
  data.tagName = 'img';
  let {
    style: { borders, borderOptions },
    exportFormats,
  } = json;
  // 以exportFormats第一项为导入的样式，默认为png;
  let fileFormat = getImageFormat(exportFormats);

  const base64Data = base64SrcEncodedFromNsData(layer.image.nsdata, fileFormat);
  data.props.src = base64Data;

  let borderStyle = getBorderStyle(borders, borderOptions);
  if (borderStyle) {
    data.props.style.border = `${borderStyle.width}px ${borderStyle.strokeDasharray ? 'dashed' : 'solid'} ${borderStyle.color}`;
  }
  data._layer = layer;

  ImageQueue.push(data);
  return data;
}

function parseText (data, json, layer) {
  data.tagName = 'span';
  ['fontSize', 'fontFamily'].forEach(k => {
    data.props.style[k] = json.style[k];
  });
  // 添加line-height 
  // TODO: 如何计算
  // 默认1.4？还是 单行 height / fontSize
  data.props.style.lineHeight = json.style.lineHeight && json.style.fontSize
    ? json.style.lineHeight / json.style.fontSize
    : 1.4;

  // sketch 和浏览器标准并不完全对齐
  // 浏览器中的 letter-spacing 包含最后一个字符，而 sketch 中并不是这样的。
  if (json.style.kerning) {
    data.props.style.letterSpacing = json.style.kerning;
  }
  data.props.style.fontWeight = appKitWeightToCSSWeight(json.style.fontWeight);
  data.props.style.textAlign = json.style.alignment;
  data.props.style.color = hex2rgba(json.style.textColor);
  // fillColor override
  // 字体渐变暂不支持
  let fillStyle = getFillStyle(json.style.fills[0]);
  if (fillStyle) {
    data.props.style.color = fillStyle;
  }

  // 0 - variable width (fixed height)
  // 1 - variable height (fixed width)
  // 2 - fixed width and height

  const textBehaviour = layer ? layer.sketchObject.textBehaviour() : 1;
  if (textBehaviour === 0) {
    delete data.props.style.width;
  }
  else if (textBehaviour === 1) {
    delete data.props.style.height;
  }
  data.children = [json.text];
  return data;
}

function parseGroup (data, json, layer) {
  data.tagName = 'div';
  data.children = [];
  let document = sketch.getSelectedDocument();
  // 递归每一层的layer
  for (let i = 0; i < json.layers.length; i++) {
    let layerJson = json.layers[i];
    let layer = document.getLayerWithID(layerJson.id);
    let layerData = parseLayer(layer, layerJson, true);
    data.children.push(layerData);
  }
  return data;
}

function parseArtboard (data, json, layer) {
  data.tagName = 'div';
  data.children = [];
  let document = sketch.getSelectedDocument();
  // 递归每一层的layer
  for (let i = 0; i < json.layers.length; i++) {
    let layerJson = json.layers[i];
    let layer = document.getLayerWithID(layerJson.id);
    let layerData = parseLayer(layer, layerJson);
    data.children.push(layerData);
  }
  if (json.background.enabled && json.background.color) {
    data.props.style.backgroundColor = json.background.color;
  }
  return data;
}

function parseSymbolInstance (data, json, layer) {
  const document = sketch.getSelectedDocument();
  var source = document.getSymbolMasterWithID(json.symbolId)

  // console.log(source.overrides)
  data.tagName = 'div';
  data.children = [];

  // 子
  const { width, height } = source.frame;
  // 父
  const { width: pwidth, height: pheight } = json.frame;
  // 比例修改
  let scaleX = 1;
  let scaleY = 1;

  if (data.props.style.scaleX) {
    scaleX *= width ? pwidth / width : 0;
  } else {
    scaleX = width ? pwidth / width : 0;
  }

  if (data.props.style.scaleY) {
    scaleY *= height ? pheight / height : 0;
  } else {
    scaleY = height ? pheight / height : 0;
  }

  const innerData = {
    tagName: 'div',
    props: {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        scaleX,
        scaleY,
      },
    },
    children: [],
  };


  for (let i = 0; i < source.layers.length; i++) {
    let layerJson = source.layers[i];
    // console.log(layerJson)
    let layer = document.getLayerWithID(layerJson.id);
    let layerData = parseLayer(layer, layerJson, true);
    innerData.children.push(layerData);
  }
  data.children.push(innerData);
  return data;
}

export default parse;
