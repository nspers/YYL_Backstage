<template>
  <div>
    <Tree :data="data2" ref="tree" show-checkbox multiple></Tree>
    <button @click="filter()">筛选</button>
    <div>{{this.list}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      dest: [],
      map: {},
      data2: [
        {
          title: "西海北延AL6配电箱集控器",
          id: "1",
          expand: true,
          children: [
            { id: "1-1", title: "回路1（东延智慧照明）" },
            { id: "1-2", title: "回路1（东延智慧照明）" }
          ]
        },
        {
          title: "西海北延AL6配电箱集控器",
          id: "2",
          expand: true,
          children: [
            {
              id: "2-1",
              title: "回路1（东延智慧照明）"
            },
            {
              id: "2-2",
              title: "回路1（东延智慧照明）"
            }
          ]
        }
      ]
    };
  },
  created: function() {},
  methods: {
    choiceAll: function(data) {
      console.log(data); //当复选框选中时则会打印出选中的内容
      this.data3 = data;
      console.log(this.data3);
      let choicesAll = this.$refs.tree.getCheckedNodes; //方法的运用 getSelectedNodes也是如此用法
      console.log(choicesAll);
    },
    filter() {
      this.list = [];
      (this.dest = []), (this.map = {}), console.log(this.data2);
      for (let i = 0; i < this.data2.length; i++) {
        if (this.data2[i].checked) {
          for (let j = 0; j < this.data2[i].children.length; j++) {
            this.list.push({
              did: this.data2[i].id,
              gatewayDid: 23,
              loop: this.data2[i].children[j].id
            });
          }
        } else {
          for (let j = 0; j < this.data2[i].children.length; j++) {
            if (this.data2[i].children[j].checked) {
              this.list.push({
                did: this.data2[i].id,
                gatewayDid: 23,
                loop: this.data2[i].children[j].id
              });
            }
          }
        }
      }
      console.log(this.list);

      for (var i = 0; i < this.list.length; i++) {
        var ai = this.list[i];
        console.log(ai);
        if (!this.map[ai.did]) {
          this.dest.push({
            did: ai.did,
            gatewayDid: ai.gatewayDid,
            loop: ai.loop
          });
          this.map[ai.did] = ai;
          console.log(this.dest);
        } else {
          for (var j = 0; j < this.dest.length; j++) {
            var dj = this.dest[j];
            if (dj.did === ai.did) {
              this.dest[j].loop = dj.loop + "," + ai.loop;

              break;
            }
          }
        }
      }
      console.log(JSON.stringify(this.dest));
      //  "loops": [
      //         {
      //             "did": 23,
      //             "gatewayDid":23,
      //             "loop":"1,2,3"

      //         }
      //     ]

      //   let newTree = data3.map(item => {
      //                 if (item.children) {
      //                     console.log('1')
      //                     return {
      //                        ...item,
      //                         title: item.name,
      //                         children: this.filter(item.children)
      //                     }
      //                 } else {
      //                     console.log('2')
      //                     return {
      //                       ...item,
      //                         title: item.name
      //                     }
      //                 }
      //             })
      //             return newTree
      //             console.log(newTree)
    }
  }
};
</script>