<template>
  <div class="material subMain">
    <div class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;回路配置</div>
    <div class="material-container">
      <div class="material-left">
        <div class="titleBox">
          <span class="title">集控器</span>
        </div>
        <div class="companyInfoBox">
          <ul class="companyInfoList">
            <li class="companyItem" :class="(item.gatewayId === nowGatewayId)?'ci_active':''" v-for="(item,index) in playDrectory" :key="index" @click="companyClick(item.gatewayId)">{{item.name}}</li>
          </ul>
        </div>
      </div>
      <div class="material-right">
        <div class="top_btn clearfix">
          <span>回路</span>
          <Select v-model="nowLoop" style="width:200px;margin-left: 20px;">
            <Option v-for="item in alertEqtList" :value="item.number" :key="item.number">{{item.name}}</Option>
          </Select>
          <Button type="primary" @click="addBtn" style="float: right;">添加</Button>
        </div>
        <Tabs>
          <TabPane>
            <Table :loading="loading" :columns="columns12" :data="tableList">
              <template slot-scope="{ row, index }" slot="handle">
                <Button type="error" size="small" @click="remove(row)">删除</Button>
              </template>
            </Table>
          </TabPane>
        </Tabs>
      </div>
    </div>
    <Modal v-model="addBox" width="400" :closable="false" @on-ok="addSend">
      <div class="f_box">
        <Select v-model="sDeviceMenu" style="width:200px">
          <Option v-for="item in deviceMenu" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <CheckboxGroup v-model="nowDev" style="margin-top: 20px;">
          <Checkbox v-for="item in deviceList" :key="item.id" :label="item.name" style="line-height: 30px;"></Checkbox><br/>
        </CheckboxGroup>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      nowGatewayId: 0,
      nowDevId: 0,
      nowLoop: 0,
      typeCode: 0,
      devName: "",
      playDrectory: [],
      alertEqtList: [],
      tableList: [],
      sDeviceMenu: "",
      deviceMenu: [],
      deviceList: [],
      nowDev: [],
      columns12: [
        {
          title: "序号",
          key: "name",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.deviceDid);
          }
        },
        {
          title: "设备名称",
          key: "id",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.deviceName);
          }
        },
        {
          title: "设备类型",
          key: "type",
          align: "center",
          render: (h, params) => {
            return h("div", this.matchDevType(params.row.typecode));
          }
        },
        {
          title: "操作",
          slot: "handle",
          width: 150,
          align: "center"
        }
      ],
      typeFlag: false,
      menuFlag: false,
      typeList: [],
      menuId: null,
      type: null,
      loading: false,
      typeText: "",
      addBox: false,
      sourceName: null,
      formItem: {
        fileName: ""
      },
      addPlayFlag: false,
      playTarget: "add", // 判断播放目录是编辑数据还是添加数据
      pageSizes: [10], // 控制每页显示多少条数据
      currentPage: 1, // 当前页
      limit: 10,
      total: 0,
      imgDetailsData: []
    };
  },
  created: function() {
    //获取集控器列表
    this.$api.post("/device/findLoopGateway")
            .then(res => {
              if(res.code === 1){
                this.playDrectory = res.result
              }
              console.log("获取集控器列表",res);
            });
  },
  mounted: function() {
    this.$nextTick(function() {});
  },
  watch:{
    nowLoop(now,old){
      this.getLoopList(this.nowGatewayId,now);
      this.nowLoop = now;
    },
    sDeviceMenu(now,old){
      this.getDeviceList(now)
    },
    nowDev(now,old){
      this.devName = now[0]
    }
  },
  methods: {
    addBtn() {
      if(this.nowGatewayId){
        if(this.nowLoop){
          if(this.tableList.length>0){
            this.$Message.info("只能添加一个设备");
          }else{
            this.addBox = true;
            this.getDeviceMenu()
          }
        }else{
          this.$Message.info("请选择回路");
        }
      }else{
        this.$Message.info("请选择集控器");
      }
    },
    companyClick(gwId){
      this.nowGatewayId = gwId;
      for(let item of this.playDrectory){
        if(item.gatewayId === gwId){
          this.alertEqtList = item.loop
        }
      }
    },
    //获取回路列表
    getLoopList(gwId,loopId){
      for(let item of this.alertEqtList){
        if(item.number === loopId){
          this.nowDevId = item.id;
        }
      }
      this.$api.post(`device/findLoopListById/${gwId}/${loopId}`)
              .then(res => {
                if(res.code === 1){
                  this.tableList = res.result
                }
                console.log("获取回路列表",res);
              });
    },
    //匹配设备类型
    matchDevType(typecode){
      switch(typecode) {
        case 1:
          return "顶棚照明";
        case 2:
          return "灯箱照明";
        case 3:
          return "logo照明";
        case 4:
          return "LED";
        case 5:
          return "LCD";
        default:
      }
    },
    //获取设备类型列表
    getDeviceMenu(){
      this.$api.post("dictionaryDetails/getDeviceMenu")
              .then(res => {
                if(res.code === 1){
                  this.deviceMenu = res.result
                }
                console.log("获取设备类型列表",res);
              });
    },
    //获取设备列表
    getDeviceList(dtId){
      this.typeCode = dtId;
      this.$api.post("device/findDeviceByType/"+dtId)
              .then(res => {
                if(res.code === 1){
                  this.deviceList = res.result
                }
                console.log("获取设备列表",res);
              });
    },
    //发送添加配置
    addSend(){
      let sendData = {
        "deviceDid": this.nowDevId, //id 36
        "gatewayId": this.nowGatewayId, //gatewayId
        "loop": this.nowLoop, //number
        "deviceName": this.devName, //列表名字
        "type": this.typeCode // 12345
      };
      console.log(sendData);
      this.$api.post("device/addDevice/",sendData)
              .then(res => {
                if(res.code === 1){
                  this.$Message.info(res.message);
                  this.getLoopList(this.nowGatewayId,this.nowLoop)
                }
                console.log(res);
              });
    },
    //删除配置
    remove(row){
      this.$Common.waring(() => {
        let sendData = {
          "type":row.typecode,
          "deviceDid":row.deviceDid,
          "loop":row.loop,
          "gatewayId":row.gatewayDid
        };
        this.$api.post("device/removeDevice",sendData)
                .then(res => {
                  if(res.code === 1){
                    this.$Message.info(res.message);
                    this.getLoopList(this.nowGatewayId,this.nowLoop)
                  }
                  console.log(res);
                });
      }, "确定要删除吗？");

    }
  }
};
</script>

<style lang="scss" scoped>
.material {
  .material-container {
    padding: 5px;
    // background-color: rgb(244, 243, 245);
    overflow: hidden;
    height: calc(100vh - 141px - 60px);

    .site_list{
      margin: 0 auto;
      width: 90%;
      li{
        display: inline-block;
        margin: 2%;
        width: 20%;
        height: 30px;
        border: 1px solid #999;
        line-height: 30px;
        text-align: center;
      }
    }

    .material-left {
      width: 15%;
      height: 100%;
      background-color: #fff;
      float: left;
      padding: 0px;
      overflow-y: auto;
      border: 1px solid #ccc;

      .titleBox {
        border-bottom: 1px solid #e9eaec;
        padding: 14px 16px;
        font-weight: bold;
        .addBtn {
          float: right;
        }
      }

      .companyInfoBox {
        .companyInfoList {
          // padding:0 10px;
          .companyItem.active {
            background-color: #515a6e;
            color: #f7f7f7;
          }
          .ci_active{
            background-color: rgba(0,0,0,.1);
          }
          .companyItem {
            transition: all 0.3s ease-in;
            cursor: pointer;
            line-height: 40px;
            padding-left: 10px;
            height: 40px;

            // &:hover {
            //   background-color: #515a6e;
            //   color: #f7f7f7;
            // }

            span {
              display: inline-block;
              margin-left: 10px;
              width: 33%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .operation {
              float: right;

              .IconFont {
                margin-right: 30px;
                font-size: 20px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }

    .material-right {
      padding: 10px;
      width: 80%;
      height: 100%;
      background-color: #fff;
      float: right;
      overflow-y: auto;
      border: 1px solid #ccc;
      .imgTitle {
        line-height: 40px;
      }

      .seachBox {
        overflow: hidden;
        margin-bottom: 20px;
        height: 40px;

        .seach {
          width: 300px;
          float: left;
        }

        .addImg {
          float: right;
        }
      }
    }
  }
}
</style>

