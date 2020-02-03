import karas from 'karas';

import type from '../../src/type';
import global from '../store/global';

export default {
  library(data, el) {
    let { points, style, style: { width, height, strokeWidth } } = data;
    let clientWidth = el.clientWidth;
    let clientHeight = el.clientHeight;
    let w = width + strokeWidth;
    let h = height + strokeWidth;
    let scale = Math.min(clientWidth / w, clientHeight / h);
    return karas.render(
      <svg width={clientWidth} height={clientHeight}>
        <$polygon
          points={points}
          style={{
            position: 'absolute',
            left: (clientWidth - width * scale) * 0.5,
            top: (clientHeight - height * scale) * 0.5,
            width: width * scale,
            height: height * scale,
            fill: style.fill,
            stroke: style.stroke,
            strokeWidth: style.strokeWidth * scale,
          }}
        />
      </svg>,
      el
    );
  },
  init(data, el) {
    if(data.type === type.SHAPE_PATH) {
      let { points, style } = data;
      return karas.render(
        <svg width={global.width} height={global.height}>
          <$polygon
            points={points}
            style={{
              ...style,
              position: 'absolute',
            }}
          />
        </svg>,
        el
      );
    }
  },
};
