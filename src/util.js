import message from './message';

export default {
  isNil(v) {
    return v === undefined || v === null;
  },
  int2rgba(color) {
    if(Array.isArray(color)) {
      if(color.length === 4) {
        return 'rgba(' + color.join(',') + ')';
      }
      else if(color.length === 3) {
        return 'rgba(' + color.join(',') + ',1)';
      }
    }
    return color || 'rgba(0,0,0,0)';
  },
  rgba2int(color) {
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
  },
  getFillStyle(fills, json) {
    if(!fills || !fills.length) {
      return;
    }
    for(let i = 0; i < fills.length; i++) {
      let fill = fills[i];
      if(!fill.enabled) {
        continue;
      }
      if(fill.fillType === 'Color') {
        return fill.color;
      }
      else if(fill.fillType === 'Gradient') { console.log(fill);
        let { from, to, aspectRatio, gradientType, stops } = fill.gradient;
        if(gradientType === 'Linear') {
          let s = `radialGradient(${from.x} ${from.y} ${to.x} ${to.y}`;
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
        message.content = '⚠️暂不支持图案填充⚠️';
      }
    }
  },
  getBorderStyle(borders, borderOptions) {
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
  },
  getImageFormat(exportFormats) {
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
  },
  base64SrcEncodedFromNsData(nsdata, imageFormat) {
    return `data:image/${imageFormat};base64,${nsdata.base64EncodedStringWithOptions(0)}`;
  },
  appKitWeightToCSSWeight(appKitWeight) {
    return [100,100,100,200,300,400,500,500,600,700,800,900,900,900,900,900][appKitWeight] || 500;
  },
};
