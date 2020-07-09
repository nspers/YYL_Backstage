<template>
  <div class="devsetting subMain">
    <div id="container"></div>
    <div class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;设备配置</div>
    <!-- <div class="btnBox">
      <Select v-model="formItem.equipmentType" style="width:200px">
        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>-->
    <div class="devset-container">
      <div class="menu">
        <div class="title">灯杆列表</div>
        <div class="equipmentList sbar">
          <ul>
            <li
              class="equipmentItem"
              v-bind:class="{selected:listIndex===index}"
              v-for="(item,index) in lamppostList"
              :key="item.id"
            >
              <span class="name">{{item.lamppostname}}</span>
              <Icon
                type="md-settings"
                class="Icon"
                title="设备配置"
                @click="settingPoup(item.id,index)"
              />
              <Icon type="md-locate" class="Icon" title="定位该点" @click="locate(item.id,index)" />
              <Icon type="md-pin" class="Icon" title="挪到地图中心" @click="showMarker(index)" />
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 设备配置弹窗 -->
    <Modal
      v-model="settingFlag"
      title="设备配置"
      class-name="vertical-center-modal"
      @on-ok="poupSure"
      @on-cancel="poupCancel"
    >
      <Form :model="formItem" :label-width="80" style="margin-left: 16%;">
        <FormItem label="设备名称">
          <Select v-model="nowDeviceType" style="width: 240px;">
            <Option
              v-for="item in deviceTypeList"
              :value="item.code"
              :key="item.code"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="equipmentContent">
        <Transfer
          :data="UnselectedList"
          :target-keys="selectedList"
          :render-format="render1"
          @on-change="transChange"
          :titles="['设备列表','已选设备']"
          :list-style="{}"
        ></Transfer>
      </div>
    </Modal>
  </div>
</template>
<script>
import Vue from "vue";
import "@/assets/css/amap.css";
import amap from "../amap/amap";
import log from "./log";
export default {
  name: "App",
  data() {
    return {
      nowSiteId: 0,
      nowSiteName: "",
      siteList: [],
      lamppostList: [],
      equipmentList: [],
      deviceTypeList: [],
      tempDevList: [],
      UnselectedList: [],
      selectedList: [],
      sendDataList: [],
      rightList: [],
      data1: [],
      targetKeys1: [],
      name: "",
      settingFlag: false, // 控制设置弹窗的显示和隐藏
      nowDeviceType: null,
      formItem: {
        equipmentType: ""
      },
      cityList: [],
      listIndex: -1
    };
  },
  created: function() {
    this.findLamppost();
  },
  mounted: function() {
    this.$nextTick(function() {});
    this.initMap();
  },
  watch: {
    nowDeviceType(now, old) {
      if (now) {
        this.tempDevList = [];
        this.UnselectedList = [];
        this.selectedList = [];
        this.getEquList(now);
      }
    }
  },
  methods: {
    findLamppost() {
      var self = this;

      self.$api
        .post("/lighpole/findLamppost", {
          pageNum: 1,
          pageSize: 1000
        })
        .then(function(res) {
          if (res.code === 1) {
            self.lamppostList = res.result.list;
            self.updateMarkers();
          }
        });
    },
    updateLamppost({ lamppostname, longitude, latitude, height, id }) {
      var self = this;

      self.$api
        .post("/lighpole/updateLamppost", {
          lamppostname,
          longitude,
          latitude,
          height,
          id
        })
        .then(function(res) {
          if (res.code === 1) {
            Vue.prototype.$Message.info(`【${lamppostname}】的经纬度已更新`);
          } else {
            Vue.prototype.$Message.error(res.message);
          }
        });
    },
    updateMarkers() {
      var self = this;

      if (window.amap && this.listIndex < 0 && self.lamppostList.length > 0) {
        self.lamppostList.forEach(obj => {
          if (obj.longitude && obj.latitude) {
            self.addMarker(obj);
          }
        });
        self.listIndex = 0;
      }
    },
    addMarker(obj) {
      var self = this;

      window.amap.addMarker({
        lng: obj.longitude,
        lat: obj.latitude,
        text: obj.lamppostname,
        data: obj,
        width: 26,
        height: 34,
        offsetX: -13,
        offsetY: -30,
        drag: function(marker) {
          if (!window.confirm("确定提交更改?")) {
            marker.setPosition([obj.longitude, obj.latitude]);
            return;
          }
          var param = marker.getExtData();

          param.longitude = marker.getPosition().getLng();
          param.latitude = marker.getPosition().getLat();

          self.updateLamppost(param);
        }
      });
    },
    showMarker(index) {
      var self = this;
      var data = this.lamppostList[index];
      var marker = window.amap.markers[index]; //.find(m=>m.getExtData().id===data.id);
      var center = window.amap.amap.getCenter();

      this.listIndex = index;

      data.longitude = center.getLng();
      data.latitude = center.getLat();
      marker.setPosition(new AMap.LngLat(data.longitude, data.latitude));

      if (!data.longitude || !data.latitude) {
        data.longitude = center.getLng();
        data.latitude = center.getLat();
        self.addMarker(data);
      }

      // window.amap.setCenterAndZoom([data.longitude, data.latitude]);
      marker.setAnimation("AMAP_ANIMATION_DROP");
    },
    initMap() {
      var self = this;

      amap
        .loadAndInit({
          center: [119.783883, 34.169471],
          zooms: [15, 19],
          zoom: 19,
          limit: false
        })
        .then(amap => {
          window.amap = amap;
          self.updateMarkers();
        });
    },
    locate(id, index) {
      var marker = window.amap.markers.find(m => m.getExtData().id === id);

      window.amap.amap.setZoomAndCenter(
        window.amap.amap.getZooms()[1],
        marker.getPosition()
      );
      marker.setAnimation("AMAP_ANIMATION_DROP");

      this.listIndex = index;
    },
    poupSure() {
      this.sendRightList();
    },
    poupCancel() {
      this.nowLamppostId = 0;
      this.lampList = [];
      this.UnselectedList = [];
      this.selectedList = [];
      //   this.$Message.info("Clicked cancel");
    },
    settingPoup(id, idx) {
      this.settingFlag = true;
      this.nowLamppostId = id;
      this.listIndex = idx;
      this.UnselectedList = [];
      this.selectedList = [];
      this.nowDeviceType = 0;

      //获取设备类型下拉
      this.$api.post("/equipment/getDeviceTypes").then(res => {
        if (res.code === 1) {
          this.deviceTypeList = res.result;
          if (res.result.length) {
            this.nowDeviceType = res.result[0].code;
          }
        }
      });
    },
    render1(item) {
      return item.label;
    },
    //获取灯头列表
    getEquList(nowDeviceType) {
      let sendData = {
        deviceType: nowDeviceType,
        lamppostid: this.nowLamppostId
      };
      // let sendData = {"deviceType": 7, "lamppostid": 6};
      this.$api.post("/equipment/getSelectedLampList", sendData).then(res => {
        if (res.code === 1) {
          this.tempDevList = res.result.Unselected;

          if (!this.tempDevList.length) {
            this.$Message.info("没有可选的设备");
          }
          if (res.result.selected.length > 0) {
            for (let item of res.result.selected) {
              this.tempDevList.push(item);
            }
            this.getSelectedList(res.result.selected);
          }
          this.getUnselectedList();
        }
      });
    },
    getUnselectedList() {
      for (let item of this.tempDevList) {
        this.UnselectedList.push({
          key: item.id,
          label: item.name || item.lamppostName || item.deviceName
        });
      }
    },
    getSelectedList(selected) {
      for (let item of selected) {
        this.selectedList.push(item.id);
      }
    },
    transChange(newTargetKeys, direction, moveKeys) {
      this.selectedList = newTargetKeys;
      this.makeSendData(newTargetKeys);
    },
    makeSendData(newTargetKeys) {
      this.sendDataList = [];
      for (let item1 of newTargetKeys) {
        for (let item2 of this.UnselectedList) {
          if (item1 === item2.key) {
            this.sendDataList.push({
              id: item2.key,
              name: item2.label
            });
          }
        }
      }
    },
    //发送右侧列表
    sendRightList() {
      let sendData = {
        deviceType: this.nowDeviceType,
        lamppostId: this.nowLamppostId,
        controllerList: this.sendDataList
      };
      this.$api.post("/equipment/configureDeviceList", sendData).then(res => {
        if (res.code === 1) {
          this.settingFlag = false;
          this.$Message.success(res.result);
        } else {
          this.settingFlag = false;
          this.$Message.error(res.result);
        }
      });
    }
  }
};
</script>

<style scoped  lang="scss">
.devset-container {
  margin-top: 20px;
  height: calc(100vh - 174px - 81px);
  position: relative;
  width: max-content;
}
#container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #6a727d !important;
}
.menu {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 250px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  color: #fff;
  .title {
    line-height: 30px;
    border-bottom: 1px solid #666;
  }
  .equipmentList {
    max-height: calc(100% - 30px);
    overflow-y: auto;
    .equipmentItem {
      padding: 0 5px;
      line-height: 35px;
      height: 35px;
      .Icon {
        float: right;
        margin-left: 5px;
        line-height: 35px;
        cursor: pointer;
      }
      &:hover,
      &.selected {
        background-color: #00ffff42;
      }
    }
  }
}

.addPoupForm label {
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right: 10px;
}

.equipmentContent {
  margin: 20px auto;
  width: 420px;
}
</style>


