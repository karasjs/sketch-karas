// import message from './message';
import sketch from 'sketch/dom';

import { reject } from "lodash";

function isNil(v) {
  return v === undefined || v === null;
}
  
function hex2rgba(color) {
  return int2rgba(rgba2int(color));
}

function int2rgba(color) {
  if(Array.isArray(color)) {
    if(color.length === 4) {
      return 'rgba(' + color.join(',') + ')';
    }
    else if(color.length === 3) {
      return 'rgba(' + color.join(',') + ',1)';
    }
  }
  return color || 'rgba(0,0,0,0)';
}
  
function rgba2int(color) {
  if(Array.isArray(color)) {
    return color;
  }
  let res = [];
  if(!color || color === 'transparent') {
    res = [0, 0, 0, 0];
  }
  else if(color.charAt(0) === '#') {
    color = color.slice(1);
    if(color.length === 3) {
      res.push(parseInt(color.charAt(0) + color.charAt(0), 16));
      res.push(parseInt(color.charAt(1) + color.charAt(1), 16));
      res.push(parseInt(color.charAt(2) + color.charAt(2), 16));
      res[3] = 1;
    }
    else if(color.length === 6) {
      res.push(parseInt(color.slice(0, 2), 16));
      res.push(parseInt(color.slice(2, 4), 16));
      res.push(parseInt(color.slice(4), 16));
      res[3] = 1;
    }
    else if(color.length === 8) {
      res.push(parseInt(color.slice(0, 2), 16));
      res.push(parseInt(color.slice(2, 4), 16));
      res.push(parseInt(color.slice(4, 6), 16));
      res.push(parseInt(color.slice(6), 16) / 255);
    }
    else {
      res[0] = res[1] = res[2] = 0;
      res[3] = 1;
    }
  }
  else {
    let c = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
    if(c) {
      res = [parseInt(c[1]), parseInt(c[2]), parseInt(c[3])];
      if(!isNil(c[4])) {
        res[3] = parseFloat(c[4]);
      }
      else {
        res[3] = 1;
      }
    }
    else {
      res = [0, 0, 0, 0];
    }
  }
  return res;
}
  
function getFillStyle(fills, json) {
  if(!fills || !fills.length) {
    return;
  }
  for(let i = 0; i < fills.length; i++) {
    let fill = fills[i];
    if(!fill.enabled) {
      continue;
    }
    // 兼容不同版本 sketch
    fill.fillType = fill.fillType || fill.fill;
    if(fill.fillType === 'Color'|| fill.fill === 'Color') {
      return hex2rgba(fill.color);
    }
    else if(fill.fillType === 'Gradient') {
      let { from, to, aspectRatio, gradientType, stops } = fill.gradient;
      if(gradientType === 'Linear') {
        let s = `linearGradient(${from.x} ${from.y} ${to.x} ${to.y}`;
        stops.forEach(item => {
          s += `, ${item.color} ${item.position * 100}%`;
        });
        s += ')';
        return s;
      }
      else if(gradientType === 'Radial') {
        let s = `radialGradient(${from.x} ${from.y} ${to.x} ${to.y} ${aspectRatio || 1}`;
        stops.forEach(item => {
          s += `, ${item.color} ${item.position * 100}%`;
        });
        s += ')';
        return s;
      }
      else if(gradientType === 'Angular') {
        let s = `conicGradient(`;
        stops = stops.slice(0);
        let i = stops.length - 1;
        if(stops[i].position < 1) {
          stops.push({
            position: 1,
            color: stops[i].color,
          });
        }
        if(stops[0].position > 0) {
          stops.unshift({
            position: 0,
            color: stops[0].color,
          });
        }
        stops.forEach((item, i) => {
          if(i) {
            s += ', ';
          }
          s += `${item.color} ${item.position * 100}%`;
        });
        s += ')';
        return s;
      }
    }
    else {
      // message.content = fill || '⚠️暂不支持图案填充⚠️';
      return
    }
  }
}
  
function getBorderStyle(borders, borderOptions) {
  if(!borders || !borders.length) {
    return;
  }
  for(let i = 0; i < borders.length; i++) {
    let border = borders[i];
    if(!border.enabled || border.thickness <= 0) {
      continue;
    }
    let res = {
      width: border.thickness,
    };
    if(borderOptions.dashePattern && borderOptions.dashePattern.length) {
      res.strokeDasharray = borderOptions.dashePattern;
    }
    if({
      Butt: 'butt',
      Round: 'round',
      Projecting: 'square',
    }.hasOwnProperty(borderOptions.lineEnd)) {
      res.strokeLinecap = borderOptions.lineEnd;
    }
    if(border.fillType === 'Color') {
      res.color = border.color;
    }
    else if(border.fillType === 'Gradient') {
      let { from, to, aspectRatio, gradientType, stops } = border.gradient;
      if(gradientType === 'Linear') {
        let s = `radialGradient(${from.x} ${from.y} ${to.x} ${to.y}`;
        stops.forEach(item => {
          s += `, ${item.position * 100}% ${item.color}`;
        });
        s += ')';
        res.color = s;
      }
      else if(gradientType === 'Radial') {
        let s = `radialGradient(${from.x} ${from.y} ${to.x} ${to.y} ${aspectRatio || 1}`;
        stops.forEach(item => {
          s += `, ${item.position * 100}% ${item.color}`;
        });
        s += ')';
        res.color = s;
      }
    }
    return res;
  }
}
function getImageFormat(exportFormats) {
  let imageFormat = 'png';
  if(exportFormats && exportFormats.length) {
    exportFormats.some(exportFormat => {
      if(exportFormat && exportFormat.fileFormat) {
        imageFormat = exportFormat.fileFormat;
        return true;
      }
      return false;
    });
  }
  return imageFormat;
}

function base64SrcEncodedFromNsData(nsdata, imageFormat) {
  return `data:image/${imageFormat};base64,${nsdata.base64EncodedStringWithOptions(0)}`;
}
  
function uploadImage(base64Data, needCompress = true, fileName = 'a.png') {
  const url = 'https://animconfig-office.alipay.net/api/ae2karas/upload';
  return fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imgData: base64Data,
      fileName: fileName,
      needCompress,
    }),
  })
  .then(res => {
    if (res.ok) {
      return JSON.parse(res.text()._value);
    } else {
      return null;
    }
  })
  .catch(e => {
    console.error(e)
  });
}

function saveImage(layer) {
  const outputPath = '~/sketch-karas/images/';
  const format = 'png';
  const fileName = `${outputPath}${layer.id}.${format}`;
  const options = {
    scales: 1,
    formats: 'png',
    trimmed: true, // 剪切图片透明无效区域
    'use-id-for-name': true,
    'group-contents-only': true,
    'save-for-web': false,
    output: outputPath
  };

  sketch.export(layer, options);
  console.log(fileName)
  return fileName;
}
function appKitWeightToCSSWeight(appKitWeight) {
  return [100,100,100,200,300,400,500,500,600,700,800,900,900,900,900,900][appKitWeight] || 500;
}

// P0, P1, P2 => M1, C1, C2, C3
function getBezierpts(P0, P1, P2, R) {
// function getBezierpts() {
//   const P0 = [0,100];
//   const P1 = [100, 100];
//   const P2 = [100 ,0];
//   const R = 50;

  let M1 = [];
  let C1 = [];
  let C2 = [];
  let C3 = [];

  const Lp0p1 = Math.sqrt((P0[1] - P1[1]) * (P0[1] - P1[1]) + (P0[0] - P1[0]) * (P0[0] - P1[0]));
  const Lp1p2 = Math.sqrt((P1[1] - P2[1]) * (P1[1] - P2[1]) + (P1[0] - P2[0]) * (P1[0] - P2[0]));
  const Lp2p0 = Math.sqrt((P0[1] - P2[1]) * (P0[1] - P2[1]) + (P0[0] - P2[0]) * (P0[0] - P2[0]));

  const angle = Math.acos((Lp0p1 * Lp0p1 + Lp1p2 * Lp1p2 - Lp2p0 * Lp2p0) / (2 * Lp0p1 * Lp1p2));
  
  const Lp1m1 = R / Math.tan(angle/2);

  const Lp1c1 = Lp1m1 - 4 / 3 * R * Math.tan(Math.PI / 4 - angle / 4);
  const Lp1c2 = Lp1c1;
  const Lp1c3 = Lp1m1;

  const Rp1m1Top0p1 = Lp1m1 / Lp0p1;
  const Rp1m2Top0p1 = Lp1c1 / Lp0p1;
  const Rp1m3Top1p2 = Lp1c2 / Lp1p2;;
  const Rp1c3Top1p2 = Lp1c3 / Lp1p2;

  M1[0] = P1[0] - (P1[0] - P0[0]) * Rp1m1Top0p1;
  M1[1] = P1[1] - (P1[1] - P0[1]) * Rp1m1Top0p1;
  C1[0] = P1[0] - (P1[0] - P0[0]) * Rp1m2Top0p1;
  C1[1] = P1[1] - (P1[1] - P0[1]) * Rp1m2Top0p1;
  C2[0] = P1[0] - (P1[0] - P2[0]) * Rp1m3Top1p2;
  C2[1] = P1[1] - (P1[1] - P2[1]) * Rp1m3Top1p2;
  C3[0] = P1[0] - (P1[0] - P2[0]) * Rp1c3Top1p2;
  C3[1] = P1[1] - (P1[1] - P2[1]) * Rp1c3Top1p2;

  return {
    M1,
    C1,
    C2,
    C3,
  };
}

export default {
  hex2rgba,
  isNil,
  int2rgba,
  rgba2int,
  getFillStyle,
  getBorderStyle,
  getImageFormat,
  base64SrcEncodedFromNsData,
  appKitWeightToCSSWeight,
  getBezierpts,
  uploadImage,
  saveImage,
}
