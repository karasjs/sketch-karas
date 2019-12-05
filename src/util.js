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
};
