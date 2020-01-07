import karas from 'karas';

import global from '../store/global';

export default {
  geom(data, el) {
    let { points, style, style: { width, height } } = data;
    return karas.render(
      <svg width={parseFloat(width) * 0.01 * global.width} height={parseFloat(height) * 0.01 * global.height}>
        <$polygon
          points={points}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            fill: style.fill,
            stroke: style.stroke,
            strokeWidth: style.strokeWidth,
          }}
        />
      </svg>,
      el
    );
  },
};
