'use strict';

import type from './type';

export default {
  getTop(layer) {
    if(!layer) {
      return null;
    }
    do {
      if(layer.type === type.ARTBOARD) {
        return layer;
      }
      if(layer.type === type.PAGE) {
        return layer;
      }
      // if(layer.type === type.GROUP) {
      //   return layer;
      // }
      layer = layer.parent;
    }
    while(layer);
    return null;
  },
  rgba2int(s) {
    if(!s) {
      return [0,0,0,0];
    }
    if(s.charAt(0) === '#') {
      let res = [];
      for(let i = 1; i < 8; i += 2) {
        let c = s.slice(i, i + 2);
        res.push(parseInt(c, 16));
      }
      return res;
    }
    return [0,0,0,0];
  },
  int2rgba(arr) {
    if(arr.length === 3) {
      arr.push(1);
    }
    return `rgba(${arr.join(',')})`;
  }
};
