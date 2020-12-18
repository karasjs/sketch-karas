import message from './message';

export default {
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
};
