import karas from 'karas';

const { int2rgba, rgba2int } = karas.util;
const { math: { geom: { r2d } } } = karas;

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
        return int2rgba(rgba2int(fill.color));
      }
      else if(fill.fillType === 'Gradient') {
        let { width, height } = json.frame;
        let { from, to, gradientType, stops } = fill.gradient;
        console.log(fill.gradient);
        if(gradientType === 'Linear') {
          let deg;
          // 朝左下
          if(to.y >= from.y && to.x < from.x) {
            deg = Math.atan(Math.abs(to.y * height - from.y * height) / Math.abs(to.x * width - from.x * width));
            deg = r2d(deg);
            deg += 90;
            deg = -deg;
          }
          // 右下
          else if(to.y >= from.y && to.x >= from.x) {
            deg = Math.atan(Math.abs(to.y * height - from.y * height) / Math.abs(to.x * width - from.x * width));
            deg = r2d(deg);
            deg += 90;
          }
          // 左上
          else if(to.y < from.y && to.x < from.x) {
            deg = Math.atan(Math.abs(to.x * width - from.x * width) / Math.abs(to.y * height - from.y * height));
            deg = r2d(deg);
            deg = -deg;
          }
          // 右上
          else if(to.y < from.y && to.x >= from.x) {
            deg = Math.atan(Math.abs(to.x * width - from.x * width) / Math.abs(to.y * height - from.y * height));
            deg = r2d(deg);
          }
          let s = `linear-gradient(${deg}`;
          s += ')';
          return s;
        }
        else if(gradientType === 'Radial') {}
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
      if(border.fillType === 'Color') {
        let res = {
          width: border.thickness,
        };
        res.color = int2rgba(rgba2int(border.color));
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
        return res;
      }
      else if(border.fillType === 'Gradient') {
        let gradient = border.gradient;
        console.log(gradient);
      }
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
