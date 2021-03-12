
import data from './data';
import layout from './layout';


function start (json) {

  //数据预处理
  data.init({
    data: json
  });

  layout.init({
    data: data.layouts
  });

  return layout.output();
}

export default start;

// console.log(layout,layout.findChildren())