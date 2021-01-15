
const _DISPLAY_MARGIN = 400;

class Data {
  constructor() {
    //原始数据
    this.data = null;
    //按id索引的原始数据
    this.dataIndex = {};

    //打平的布局
    this.layouts = [];
    //打平布局的索引
    this.layoutsIndex = {};

  }
  init (opt) {
    this.data = opt ? (opt.data ? opt.data : null) : null;
    //开始处理
    this.prepareData();
  }
  //flatten处理布局
  add (d, parent) {
    let that = this;

    if (d.props && (d.props.style.width == undefined || d.props.style.height == undefined)) {
      if (d.tagName == "span" && d.children && d.children.length > 0) {
        let text = d.children.join("").trim();
        let texts = text.split(" ");
        let width = d.props.style.fontSize * text.length;

        //文本换行
        if (texts.length > 1) {
          width /= 2;
        };

        // let tx=measureText(d.children[0],d.props.style.fontSize,d.props.style.fontFamily,d.props.style.textAlign)
        //有些文字没有宽度，需要计算
        d.props.style.width = parseInt(d.props.style.width ? d.props.style.width : width);
        //有些文字没有高度，需要计算
        d.props.style.height = parseInt(d.props.style.height ? d.props.style.height : d.props.style.fontSize * d.props.style.lineHeight);
      }
    };

    //索引原始数据
    if (d.id) {
      if (that.dataIndex[d.id]) console.error("-----重复id------", d)
      that.dataIndex[d.id] = d;
    }


    let layout = {
      id: `_${that.layouts.length}`,
      w: parseInt(d.props && d.props.style.width ? d.props.style.width : 0),
      h: parseInt(d.props && d.props.style.height ? d.props.style.height : 0),
      //使用相对0，0的绝对坐标
      x: parseInt(d.props && d.props.style.fixed_left ? d.props.style.fixed_left : 0),
      y: parseInt(d.props && d.props.style.fixed_top ? d.props.style.fixed_top : 0),
      px: parseInt(d.props && d.props.style.left ? d.props.style.left : 0),
      py: parseInt(d.props && d.props.style.top ? d.props.style.top : 0),
      children: [],
      tagName: d.tagName,
      originParentId: parent ? parent.id : null,
      originId: d.id,
      area: parseInt(d.props && d.props.style.width ? d.props.style.width : 0) * parseInt(d.props && d.props.style.height ? d.props.style.height : 0)
    };
    //去除空的布局 x y w h ===0 
    if ((layout.x != 0 || layout.y != 0 || layout.w != 0 || layout.h != 0) && layout.tagName != "div") {
      that.layouts.push(layout);
    };

    if (!d.children) return;
    Array.from(d.children, c => {
      that.add(c, d);
    });
  }

  isEqual (style1, style2) {
    let count = 0;
    for (const key in style1) {
      if (style1[key] === style2[key] && ['x', 'y', 'w', 'h'].includes(key)) count++;
    }
    return count === 4;
  }

  //去除重叠的div
  removeEqual () {
    let that = this;
    //相似的按一个id索引
    let equals = {};
    let layouts = Array.from(that.layouts, (style1, i) => {
      let isHasEqual = false;
      let sid = `${style1.x}_${style1.y}_${style1.w}_${style1.h}`;
      Array.from(that.layouts, (style2, j) => {
        if (i != j && that.isEqual(style2, style1) && style1.tagName == "div" && style2.tagName == "div") {
          isHasEqual = true;
          if (!equals[sid]) {
            equals[sid] = style1;
          }
        }
      });
      style1.isHasEqual = isHasEqual;
      return style1
    });

    //把重复的去掉，更新layouts
    that.layouts = layouts.filter(f => !f.isHasEqual);
    for (const key in equals) {
      that.layouts.push(equals[key])
    };
  }
  //建索引
  createLayoutsIndex () {
    let that = this;
    Array.from(that.layouts, layout => { that.layoutsIndex[layout.id] = layout });
  }

  //数据预处理
  prepareData () {
    let that = this;
    if (!that.data) return;

    that.add(that.data);
    //得到画板
    that.layouts = that.layouts.sort((a, b) => b.area - a.area);
    //画板
    let mainBoard = that.layouts[0];
    //画板的背景之类的
    let mainBoards = [];
    that.layouts = that.layouts.slice(1, that.layouts.length);
    that.layouts = that.layouts.filter(f => {
      if (f.x == mainBoard.x && f.y == mainBoard.y && f.w == mainBoard.w && f.h == mainBoard.h) {
        mainBoards.push(f);
      };
      return !(f.x == mainBoard.x && f.y == mainBoard.y && f.w == mainBoard.w && f.h == mainBoard.h)
    });

    that.mainBoard = Object.assign(mainBoard || {}, {
      children: mainBoards
    });


    //按照0，0对齐
    that.layouts = that.layouts.sort((b, a) => b.x - a.x);
    //去除重叠的div
    that.removeEqual();
    //建索引
    that.createLayoutsIndex();

  }
  getData () {
    return {
      mainBoard: this.mainBoard,
      layouts: this.layouts
    }
  }
  //可视化
  show () {

    let displayLayouts = {};


    (this.mainBoard.children.concat(this.mainBoard)).forEach((t, i) => {
      let div = document.createElement("div");
      div.style.position = 'absolute';
      div.style.outline = `${i + 1}px solid blue`;
      div.style.fontSize = '12px';
      div.style.left = (_DISPLAY_MARGIN + (t.x || 0)) + 'px';
      div.style.top = (_DISPLAY_MARGIN + (t.y || 0)) + 'px';
      div.style.width = (t.w || 0) + 'px';
      div.style.height = (t.h || 0) + 'px';
      //div.setAttribute("title",4);
      div.id = t.id;
      div.innerText = `${(new Array(i)).fill("\n").join("")}${i} ${t.id}`;
      document.body.appendChild(div);

      displayLayouts[t.id] = div;
    });


    this.layouts.forEach((t, i) => {
      let div = document.createElement("div");
      div.style.position = 'absolute';
      div.style.outline = '1px solid red';
      div.style.fontSize = '12px';
      div.style.left = (_DISPLAY_MARGIN + (t.x || 0)) + 'px';
      div.style.top = (_DISPLAY_MARGIN + (t.y || 0)) + 'px';
      div.style.width = (t.w || 0) + 'px';
      div.style.height = (t.h || 0) + 'px';
      //div.setAttribute("title",4);
      div.id = t.id;
      div.innerText = t.id;
      document.body.appendChild(div);

      displayLayouts[t.id] = div;

      // div.addEventListener("click",e=>{
      //     e.preventDefault();
      //     div.classList.toggle("hover");
      //     if(div.classList.contains("hover")){
      //         let group=findChildren(t);
      //         autoGroup(group);
      //         add2SelectGroup(layouts[i]);
      //     }else{
      //         clearGroup();
      //         clearSelectGroup(); 
      //     }
      // });

    });
    return displayLayouts
  }
}


export default new Data();