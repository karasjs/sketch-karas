import sketch from 'sketch/dom';
import type from './type';
import util from './util';

function parseNormal(json) {
  let style = json.style;
  let res = {
    style: {
      opacity: style.opacity,
    },
  };
  ['type', 'id', 'name', 'hidden'].forEach(k => {
    res[k] = json[k];
  });
  ['x', 'y'].forEach(k => {
    res.style[k === 'x' ? 'left' : 'top'] = json.frame[k];
  });
  ['width', 'height'].forEach(k => {
    res.style[k] = json.frame[k];
  });
  // TODO: transform/style
  return res;
}

function parseShapePath(data, json) {
  let { points, style: { fills, borders } } = json;
  // 点和控制点
  let pts = [];
  let cts = [];
  points.forEach(item => {
    let { pointType, point } = item;
    if(pointType === 'Straight') {
      pts.push([point.x, point.y]);
    }
  });
  data.points = pts;
  data.controls = cts;
  // 描绘属性，取第一个可用的，无法多个并存
  if(fills && fills.length) {
    for(let i = 0; i < fills.length; i++) {
      let fill = fills[i];
      if(!fill.enabled) {
        continue;
      }
      if(fill.fillType === 'Color') {
        data.style.fill = util.int2rgba(util.rgba2int(fill.color));
      }
      break;
    }
  }
  if(borders && borders.length) {
    for(let i = 0; i < borders.length; i++) {
      let border = borders[i];
      if(!border.enabled) {
        continue;
      }
      if(border.fillType === 'Color') {
        data.style.stroke = util.int2rgba(util.rgba2int(border.color));
      }
      data.style.strokeWidth = border.thickness || 1;
      break;
    }
  }
  return data;
}

export default function(layer) {
  let json = sketch.fromNative(layer);
  // console.log(JSON.stringify(json));
  let data = parseNormal(json);
  if(data.type === type.SHAPE_PATH) {
    Object.assign(data, parseShapePath(json));
  }
  return data;
}
