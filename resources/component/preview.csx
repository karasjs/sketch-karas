import karas from 'karas';

import type from '../../src/type';
import global from '../store/global';

export default {
  icon(data, el) {
    let { points, style, style: { width, height } } = data;
    let scale = Math.min(16 / width, 16 / height);
    return karas.render(
      <svg width="16" height="16">
        <$polygon
          points={points}
          style={{
            position: 'absolute',
            left: (16 - width * scale) * 0.5,
            top: (16 - height * scale) * 0.5,
            margin: '0 auto',
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
