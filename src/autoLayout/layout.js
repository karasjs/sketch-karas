import kmeans from 'ml-kmeans';
import { flatten } from 'array-flatten';

const _DISPLAY_MARGIN = 400;

class Layout {
  constructor() {
    this.data = [];
    this.allData = [];
    this.group = [];
    this.tree = [];
    this.splitGroupRes = [];
    this.dev = false;
  }
  init (opt) {
    this.data = opt ? opt.data : [];

    //按规则分组,重叠关系
    this.ruleGroup(30);

    //再判断哪些是group
    this.splitGroup(this.data);
    // 基本单元

    // console.log(JSON.stringify(this.group), '===========');
    for (const key in this.group) {

      const children = this.group[key];
      let gs = [];

      for (const c in children) {
        const child = children[c];
        gs.push(child);
      };

      this.group[key] = this.autoGroup(gs);
      // console.log('this.group[key]',this.group[key])

      for (const index in this.group[key]) {
        let cc = this.group[key][index];
        // console.log('cc',cc)
        this.group[key][index] = {
          //TODO 修复
          list: cc,
          children: this.autoGroup(cc)
        };
      }
    };


    let result = [];
    for (const key in this.group) {
      const g = this.group[key];
      // return;
      let gStyle = {
        style: {},
        children: []
      }
      for (const i in g) {
        const c = g[i];
        // console.log(c)
        let cStyle = {
          style: (() => {
            let { parentLayout } = this.getParentLayoutFromChildren(c.list)
            return parentLayout
          })(),
          testId: c.originId || '111',
          // childrenDev:Array.from(c.list,cc=>cc.id),
          childrenIds: Array.from(c.list, cc => cc.originId)
        };
        //只有一组，就不妨
        if ((Object.keys(c.children)).length > 1) {
          cStyle.children = (() => {
            if ((Object.keys(c.children)).length <= 1) return []
            let cccChildren = [];
            for (const ci in c.children) {
              // console.log('c.children[ci]',c.children[ci])
              cccChildren.push({
                style: (() => {
                  let { parentLayout } = this.getParentLayoutFromChildren(c.children[ci]);
                  return parentLayout
                })(),
                // childrenDev:Array.from(c.children[ci],m=>m.id),
                childrenIds: Array.from(c.children[ci], m => m.originId)
              })

            };
            // console.log('cccChildren',cccChildren)
            return cccChildren
          })();
        }
        gStyle.children.push(cStyle);

        if (this.dev) {
          this.createDiv({ style: cStyle.style }, 'blue', "cStyle")
          Array.from(c.list, cc => {
            document.querySelector("#" + cc.id).style.background = "rgba(255,0,0,0.4)"
          });

          if (cStyle.children && cStyle.children.length > 1) {
            Array.from(cStyle.children, dv => {
              this.createDiv(dv, 'red', "smStyle")
            })
          }
          // console.log('cStyle',cStyle)
        }
      };
      gStyle.style = (() => {
        let { parentLayout } = this.getParentLayoutFromChildren(Array.from(gStyle.children, c => c.style))
        return parentLayout
      })();
      result.push(gStyle);
      // console.log('g',gStyle)
      // result.push();
    };

    this.result = result;
    // console.log('g', result)

  }


  autoGroup (gs = []) {

    let { data, count, centers } = this.autoDirection(gs);
    // console.log(count,data.length)
    let ans = kmeans(data, count == data.length ? 1 : count, count == data.length ? null : { initialization: centers });
    let group = {};
    Array.from(ans.clusters, (c, i) => {
      // console.log(c)
      if (!group[c]) group[c] = [];
      group[c].push(gs[i])
    });
    return group
  }

  autoDirection (data = []) {

    let flexDirection = this.whichDirection(data);

    let res = Array.from(data, t => {
      //对元素的框进行少量的padding，缩进，支持模糊切割
      let padding = 0;
      if (flexDirection == "column") {
        return [(t.y || 0) + parseInt(padding * t.h || 0), (t.y || 0) + (t.h || 0) - parseInt(padding * t.h || 0)]
      } else if (flexDirection == "row") {
        //console.log('row',t.data.x,t.data.w)
        return [(t.x || 0) + parseInt(padding * t.w), (t.x || 0) + (t.w || 0) - parseInt(padding * t.w || 0)]
      } else {
        padding = 0.2;
        return [(t.x || 0) + parseInt(padding * t.w), (t.x || 0) + (t.w || 0) - parseInt(padding * t.w || 0), (t.y || 0) + parseInt(padding * t.h || 0), (t.y || 0) + (t.h || 0) - parseInt(padding * t.h || 0)]
      }

    });

    let { count, centers } = this.oneCountAndCenters(res);
    // console.log(flexDirection)
    return { data: res, count, centers }
  }

  //判断方向
  whichDirection (children) {

    if (this.isXDirection(children)) {
      return "row"
    } else {
      return "column"
    }
  }
  isXDirection (children) {
    if (children) {
      // console.log(parent.children)

      let data = Array.from(children, c => [c.x, c.x + c.w]);
      let { count, _ } = this.oneCountAndCenters(data);
      return count > 1
    }
    return false
  }

  oneCountAndCenters (data) {
    //计算分组数量
    let ds = flatten(data);

    let min = parseInt(Math.min.apply(null, ds)),
      max = parseInt(Math.max.apply(null, ds));
    let dsRange = (new Array(max)).fill(0);
    dsRange = Array.from(dsRange, (d, index) => {
      Array.from(data, dt => {
        if (index >= dt[0] && index <= dt[1]) {
          d = 1;
        }
      });
      return d
    });

    let count = 1;
    let centers = [[0, 0]];
    // console.log(dsRange);
    Array.from(dsRange, (d, i) => {
      if (d == 0 && dsRange[i - 1] == 1) {
        count++;
        centers.push([i - 1, i]);
      }
    });

    return {
      count, centers
    }

  }

  splitGroup (data) {
    // console.log(this.data)
    let group = {};
    Array.from(data, d => {
      Array.from(data, dt => {
        //包含
        if (dt && this.isContain(d, dt)) {
          group[d.id] = d;
        };
      });
    });

    //基本单位 
    let dataForGroup = [];
    Array.from(data, d => {
      if (!group[d.id]) {
        dataForGroup.push(d);
      }
    });

    Array.from(data, d => {
      if (group[d.id]) {
        let children = {};
        let isContains = [];
        Array.from(data, dt => {
          //包含
          if (dt && this.isContain(d, dt)) {
            if (!children[dt.id]) isContains.push(dt);
            children[dt.id] = dt;
          };
        });
        // console.log('children',children)
        group[d.id] = children;
        Array.from(isContains, c => {
          Array.from(dataForGroup, (dg, index) => {
            // console.log(c.id,dg.id)
            if (c.id == dg.id) {
              dataForGroup[index].isGroup = true;
            }
          })
        })
      }

    });

    dataForGroup = dataForGroup.filter(f => !f.isGroup);
    group._ = {};
    Array.from(dataForGroup, d => group._[d.id] = d)
    this.group = group;
    // console.log('dataForGroup', group)
  }

  ruleGroup (num = 20) {
    this.allData.push(JSON.parse(JSON.stringify(this.data)));
    // console.log(this.allData)
    // 二分类:合并，跟不需要合并
    this.findChildren();

    if (this.group.length < 3 && this.allData.length > 1) {
      this.allData.pop();
      this.data = JSON.parse(JSON.stringify(this.allData[this.allData.length - 1]));
      return
    }

    let isFinish = true;
    // this.findChildren();
    this.updateGroup(num);
    this.findChildren();
    Array.from(this.group, g => {
      if (g.children.length < num) {
        isFinish = false;
      }
    });
    num = num - 1;
    if (isFinish == false || num > 0) this.ruleGroup(num)
  }

  nestGroup () {
    let that = this;
    // console.log('group:',this.group)
    let oGroup = that.group;
    //试试聚类
    let ans = kmeans(Array.from(oGroup, g => [
      g.style.x,
      g.style.y,
      g.style.x + g.style.w,
      g.style.y + g.style.h
    ]), oGroup.length - 1);

    let group = {};
    let newGroup = [];
    Array.from(ans.clusters, (c, i) => {
      // console.log(c)
      if (!group[c]) group[c] = [];
      group[c].push(oGroup[i])
    });
    for (const key in group) {
      let gs = group[key];
      let { parentLayout, childrenIds, xs, ys } = that.getParentLayoutFromChildren(Array.from(gs, g => g.style));

      let childDivIsParent = null;
      group[key] = Array.from(gs, g => {
        // console.log("内部有",parentLayout)
        if (that.isEqual(parentLayout, g.style)) {
          //console.log("内部有",parentLayout)
          if (g.style.tagName == "div") {
            childDivIsParent = g;
            g = null;
          } else {
            //把非 div的子元素去除。。
            //TODO 是否可以去
            g.children = [];
          };
        }
        return g
      }).filter(f => f);

      if (childDivIsParent) {
        //不需要新建div
        // childDivIsParent
        // console.log('childDivIsParent:',childDivIsParent.children.length,Array.from(group[key],g=>g.style))
        childDivIsParent.children = childDivIsParent.children.concat(Array.from(group[key], g => g.style));
        // console.log('childDivIsParent:',childDivIsParent.children.length)
        newGroup.push(childDivIsParent);
      }
    };

    this.group = newGroup;


    // console.log('noGroup:',this.noGroup)
    // Array.from(that.group,g=>{
    //     that.noGroup=Array.from(that.noGroup,ng=>{
    //         //包含
    //         if(ng&&that.isContain(g.style,ng.style)){
    //             g.children.push(ng.style);
    //             ng=null;
    //         };
    //         return ng
    //     });
    // })
    // console.log('group:',this.group)
    // console.log('noGroup:',this.noGroup)
  }

  exchange () {
    let that = this;
    Array.from(that.group, g => {
      // console.log('group:',g)
      that.noGroup = Array.from(that.noGroup, ng => {
        if (that.isContain(g.style, ng.style)) {
          g.children.push(ng.style);
          ng = null;
        };
        return ng
        //console.log('nogroup:',ng,that.isContain(g.style,ng.style))
      }).filter(f => f);

    });
    //console.log(that.noGroup,that.group)
  }

  clusterGroup (tGroup) {
    // console.log('tGroup:',tGroup)
    // console.log('nogroup',this.noGroup)
    let that = this;
    let tagNames = {};
    Array.from(tGroup, g => {
      tagNames[g.tagName] = (Object.keys(tagNames)).length;
    });

    let ans = kmeans(Array.from(tGroup, g => [
      g.x,
      g.y,
      g.x + g.w,
      g.y + g.h,
      tagNames[g.tagName]
    ]), tGroup.length > 4 ? 4 : tGroup.length - 1);
    // this.noGroup
    let group = {};
    Array.from(ans.clusters, (c, i) => {
      // console.log(c)
      if (!group[c]) group[c] = [];
      group[c].push(tGroup[i])
    });
    let groupList = [];
    for (const key in group) {
      const gs = group[key];

      var res = that.getParentLayoutFromChildren(Array.from(gs, g => g));
      let ng = {
        style: res.parentLayout,
        children: gs
      }
      groupList.push(ng);
    }

    return groupList;
    // console.log(this.group,groupList)
  }


  //判断style1 是否包含style2
  isContain (style1, style2) {
    return (style2.x > style1.x && style2.y > style1.y) &&
      (style2.x + style2.w) < (style1.x + style1.w) &&
      (style2.y + style2.h) < (style1.y + style1.h)
  }

  //相等
  isEqual (style1, style2) {
    let count = 0;
    for (const key in style1) {
      if (style1[key] === style2[key] && ['x', 'y', 'w', 'h'].includes(key)) count++;
    }
    return count === 4;
  }


  findChildren () {
    let that = this;
    let group = [];
    let noGroup = [];

    Array.from(that.data, d1 => {
      let rect1 = [
        d1.x || 0,
        d1.y || 0,
        d1.w || 0,
        d1.h || 0];
      let children = [];
      Array.from(that.data, d2 => {
        let rect2 = [
          d2.x || 0,
          d2.y || 0,
          d2.w || 0,
          d2.h || 0];

        //2种情况，包含或等于，本身需要去除
        if (
          (rect1[0] <= rect2[0]
            && rect1[1] <= rect2[1]
            && (rect1[0] + rect1[2]) >= (rect2[0] + rect2[2])
            && (rect1[1] + rect1[3]) >= (rect2[1] + rect2[3]))
          && (rect1[0] != rect2[0] || rect1[1] != rect2[1] || (rect1[0] + rect1[2]) != (rect2[0] + rect2[2]) || (rect1[1] + rect1[3]) != (rect2[1] + rect2[3]))
        ) {
          children.push(d2);
        }
      });
      if (children.length > 0) {
        group.push({
          style: d1,
          children: children
        });
      } else {
        noGroup.push({
          style: d1,
          children: children
        });
      }
    });

    that.noGroup = noGroup;
    that.group = group;
    return
  }
  updateGroup (num = 5) {
    let that = this;
    // console.log('1:::',that.data)
    Array.from(that.group, g => {
      //1-4个元素才会自动合并
      if (g.children.length < 5) {
        var res = that.getParentLayoutFromChildren(g.children);

        //更新布局数据
        // children: 14
        // h: 376
        // id: "_0"
        // originId: "2DD0B901-ECC2-418E-9C0E-A8FFE5143D56"
        // parentId: null
        // px: 0
        // py: 0
        // tagName: "div"
        // w: 702
        // x: 0
        // y: 0

        //去除被合并的子元素
        that.data = Array.from(that.data, d => {
          let isTarget = false;
          Array.from(g.children, c => {
            if (d.id == c.id) isTarget = true;
          });
          if (isTarget == false) return d;
        }).filter(f => f);
        // console.log('2:::',that.data)
        //把合并的子元素，作为group字段 更新布局数据
        that.data = Array.from(that.data, d => {
          // console.log(d.tagName)
          if (d.id == g.style.id) {
            d.children = g.children;
            d = Object.assign(d, res.parentLayout);

          }
          return d
        }).filter(f => f);
      }
    });
    // console.log('2:::',that.data)
  }
  //更新父级的布局
  getParentLayoutFromChildren (children) {
    let xs = [], ys = [], childrenIds = "";

    children.forEach((g, i) => {
      xs.push(g.x);
      xs.push(g.x + g.w);
      ys.push(g.y);
      ys.push(g.y + g.h);
      childrenIds += g.id;
    });
    return {
      parentLayout: this.getParentLayoutFromPositions(xs, ys),
      childrenIds: childrenIds,
      xs: xs, ys: ys
    };
  }
  // 从坐标中计算父级布局
  getParentLayoutFromPositions (xs = [], ys = []) {
    let xMin = Math.min.apply(null, xs),
      xMax = Math.max.apply(null, xs);
    let yMin = Math.min.apply(null, ys),
      yMax = Math.max.apply(null, ys);
    return {
      x: xMin,
      y: yMin,
      w: xMax - xMin,
      h: yMax - yMin
    }
  }

  getResult (parent) {
    let that = this;
    parent = Array.from(parent, r => {
      let cs = {}, children = [];
      if (typeof (r.children) != "number") {
        Array.from(r.children, (c, i) => {
          // console.log(c)
          if (!c.id) c.id = `${i}_${c.style.x}_${c.style.y}_${c.style.w}_${c.style.h}`;
          if (c.id && !cs[c.id]) {
            cs[c.id] = c;
            children.push(c);
          };
          if (cs[c.id]) {
            // console.log('!!!!!:',c.id)
          };
          if (typeof (c.children) != "number") {
            c.children = that.getResult(c.children);
          }

        });

        r.children = children;
      };
      return r
    });
    return parent
  }

  show () {
    // console.log('data:',this.data)
    // console.log('group:',this.group)
    // console.log('res:::',this.noGroup.concat(this.group))
    //去重      
    let res = this.getResult(this.noGroup.concat(this.group));

    // console.log('res:',JSON.stringify(res,null,2))


    let color1 = `rgba(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()},1)`;
    Array.from(res, g => {
      // console.log("!!!",g)
      // if(g.children.length<4){
      if (!g.style.id) {
        let div = document.createElement("div");
        div.style.position = 'absolute';
        div.style.outline = `4px solid ${color1}`;
        div.style.fontSize = '12px';
        div.style.left = (_DISPLAY_MARGIN + (g.style.x || 0)) + 'px';
        div.style.top = (_DISPLAY_MARGIN + (g.style.y || 0)) + 'px';
        div.style.width = (g.style.w || 0) + 'px';
        div.style.height = (g.style.h || 0) + 'px';
        //div.style.background=color;
        //div.setAttribute("title",4);
        // div.id=.id;
        // div.innerText=t.id;
        document.body.appendChild(div);
      } else {
        //
        //document.querySelector("#"+g.style.id).style.background=color;
        document.querySelector("#" + g.style.id).style.outline = `4px solid ${color1}`;
        document.querySelector("#" + g.style.id).innerText = `c-${g.children.length}`
      }

      // }
      let color2 = `rgba(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()},0.3)`;
      Array.from(g.children, c => {
        // console.log('c',c)

        if (c.style) {
          let div = document.createElement("div");
          div.style.position = 'absolute';
          div.style.outline = `8px solid ${color2}`;
          div.style.fontSize = '12px';
          div.style.left = (_DISPLAY_MARGIN + (c.style.x || 0)) + 'px';
          div.style.top = (_DISPLAY_MARGIN + (c.style.y || 0)) + 'px';
          div.style.width = (c.style.w || 0) + 'px';
          div.style.height = (c.style.h || 0) + 'px';

          document.body.appendChild(div);
        } else {
          //
          // console.log(document.querySelector("#"+c.id))
          //document.querySelector("#"+g.style.id).style.background=color;
          document.querySelector("#" + c.id).style.outline = `4px solid ${color2}`;
          // document.querySelector("#"+c.id).innerText=`c-${g.children.length}`
        }

        let color3 = `rgba(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()},0.3)`;
        Array.from(c.children, cc => {
          document.querySelector("#" + cc.id).style.background = color3;
        })

      });

    });

  }

  createDiv (c, color, title) {
    let div = document.createElement("div");
    div.style.position = 'absolute';
    div.style.outline = `8px solid ${color}`;
    div.style.fontSize = '12px';
    div.style.left = (_DISPLAY_MARGIN + (c.style.x || 0)) + 'px';
    div.style.top = (_DISPLAY_MARGIN + (c.style.y || 0)) + 'px';
    div.style.width = (c.style.w || 0) + 'px';
    div.style.height = (c.style.h || 0) + 'px';
    div.innerText = title;
    document.body.appendChild(div);

  }

  output () {
    return this.result;
  }

}


export default new Layout();
// module.exports = new Layout()