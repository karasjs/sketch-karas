import karas from 'karas';

const { int2rgba, rgba2int } = karas.util;

export default {
  getFillStyle(fills) {
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
        let gradient = fill.gradient;
        console.log(gradient);
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
