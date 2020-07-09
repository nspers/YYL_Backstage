<template>
  <div class="material subMain">
    <div class="page_title">节目发布</div>
    <div class="clearfix">
      <Select
        v-model="deviceType"
        style="width:200px"
        label-in-value
        @on-change="equipmentTypeChange"
      >
        <Option v-for="item in RecordsMenu" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <span class="fr">
        <Button type="primary" @click="stepsPoupFlag=true">新建节目</Button>
      </span>
    </div>

    <Tabs value="name1">
      <TabPane :label="selectLabel+'发布记录'" name="name1">
        <div class="material-container">
          <div class="material-right">
            <Table :columns="columns12" :data="tableData">
              <template slot-scope="{ row }" slot="handle">
                <Button type="info" size="small" @click="edit(row)">编辑</Button>
                <Button type="error" size="small" @click="del(row)">删除</Button>
              </template>
            </Table>
            <div class="account_subMain_section_footer">
              <Page
                size="small"
                :total="total"
                style="margin-top:-2px;"
                show-total
                show-elevator
                :page-size-opts="pagesizes"
                :page-size="limit"
                @on-change="currentChange"
                @on-page-size-change="changePageSize"
              />
            </div>
          </div>
        </div>
      </TabPane>
    </Tabs>

    <!-- 新建播放目录弹窗 -->
    <Modal
      v-model="addPlayFlag"
      ref="addPlayPoup"
      class-name="vertical-center-modal"
      title="新建播放目录"
      @on-ok="playSure"
    >
      <Form :model="formItemFile" :label-width="80">
        <FormItem label="目录名称">
          <Input v-model="formItemFile.fileName" placeholder="Enter something..." />
        </FormItem>
      </Form>
    </Modal>

    <!-- 编辑任务弹窗 -->
    <Modal
      v-model="editTaskFlag"
      title="编辑任务"
      ref="addPoup"
      @on-ok="poupSure"
      @on-cancel="poupCancel"
      class-name="vertical-center-modal"
    >
      <Form :model="formItem" :label-width="80">
        <FormItem label="任务名称">
          <Input v-model="formItem.addTaskName" placeholder="Enter something..." />
        </FormItem>
      </Form>
      <div class="addPoupForm">
        <label for style="marginRight:5px;">创建时间</label>
        <span>{{creatTime}}</span>
      </div>
      <div class="addPoupForm">
        <label for style="marginRight:5px;">创建者</label>
        <span>admin</span>
      </div>
    </Modal>

    <!-- 步骤条弹窗 -->
    <Modal
      v-model="stepsPoupFlag"
      :title="stepsPoupTitle"
      @on-ok="abNext"
      @on-cancel="abPrev"
      width="700"
      class-name="vertical-center-modal"
    >
      <div class="step_bar">
        <Steps :current="curStep">
          <Step title="任务信息"></Step>
          <Step title="执行目标"></Step>
          <Step title="完成"></Step>
        </Steps>
      </div>
      <div v-if="curStep === 0" class="abox_content">
        <Form :model="formItem" :label-width="80">
          <FormItem label="节目名称">
            <Input v-model="formItem.name" placeholder="请输入策略名称" style="width:180px;" />
          </FormItem>
          <FormItem label="播放日程">
            <DatePicker
              v-model="formItem.time"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="Select date and time(Excluding seconds)"
              style="width: 300px"
            ></DatePicker>
          </FormItem>
          <FormItem label="节目类型">
            <Select v-model="formItem.type" style="width:180px;">
              <Option :value="item.id" v-for="(item,index) in ModelMenu" :key="index">{{item.name}}</Option>
            </Select>
          </FormItem>
          <Upload multiple type="drag" action="//jsonplaceholder.typicode.com/posts/">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>Click or drag files here to upload</p>
            </div>
          </Upload>
          <FormItem label="音响设置">
            <Slider v-model="formItem.stereo"></Slider>
          </FormItem>
          <FormItem label="亮度设备">
            <Slider v-model="formItem.brightness"></Slider>
          </FormItem>
        </Form>
      </div>

      <div v-if="curStep === 1" class="abox_content">
        <div class="performTable">
          <ul class="performBox">
            <li class="performItem" v-for="(item,index) in perfromData" :key="index">
              <span class="checked">
                <Checkbox v-model="item.single"></Checkbox>
              </span>
              <span class="equipmentCode">{{item.code}}</span>
              <span class="equipmentLoction">{{item.loction}}</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="curStep === 2" class="abox_content3">
        <Icon type="md-checkmark-circle-outline" />
        <span>添加成功</span>
      </div>

      <div slot="footer">
        <Button @click="abPrev" v-if="curStep > 0">上一步</Button>
        <Button @click="abNext" type="primary" v-if="curStep < 2">下一步</Button>
        <Button @click="abFinish" type="primary" v-if="curStep === 2">完成</Button>
      </div>
    </Modal>

    <!-- 显示更多设备位置 -->
    <Modal v-model="morePoupFalg" width="360" class-name="vertical-center-modal">
      <p slot="header">
        <span>设备位置</span>
      </p>
      <div style="text-align:center">
        <p
          v-for="(item,index) in moreLoctionData"
          :key="index"
          style="fontSize:16px;"
        >{{item.loction}}</p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="moreSure">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      id: null,
      deviceType: null,
      selectLabel: "",
      RecordsMenu: [], //下拉
      ModelMenu: [], //模板下拉
      tableData: [],
      total: 0,
      which: "add", // 判断是编辑数据还是添加数据
      playTarget: "add", // 判断播放目录是编辑数据还是添加数据
      currentDataIndex: "",
      moreLoctionData: [], // 显示更多设备位置的数据
      morePoupFalg: false, // 控制更多设备弹窗的显示和隐藏
      formItemFile: {
        fileName: ""
      },
      addPlayFlag: false,
      creatTime: "", // 创建任务的时间
      curStep: 0, // 步骤条进度0，1，2
      editTaskFlag: false, // 控制编辑任务弹窗的显示隐藏
      addTaskFlag: false, // 控制添加任务弹窗的显示和隐藏
      stepsPoupFlag: false, // 步骤条弹窗显示和隐藏
      stepsPoupTitle: "",
      pagesizes: [10], // 控制每页显示多少条数据
      currentPage: 1, // 当前页
      limit: 10,
      playDrectory: [
        { fileName: "数知科技", id: 1 },
        { fileName: "数知科技", id: 2 },
        { fileName: "数知科技", id: 3 },
        { fileName: "数知科技", id: 4 },
        { fileName: "数知科技", id: 5 },
        { fileName: "数知科技", id: 6 },
        { fileName: "数知科技", id: 7 }
      ],
      columns12: [
        { title: "节目名称", key: "name", align: "center" },
        { title: "发布时间", key: "creationTime", align: "center" },
        { title: "节目类型", key: "typeName", align: "center" },
        { title: "设备位置", key: "location", align: "center" },
        { title: "操作", slot: "handle", width: 150, align: "center" }
      ],
      formItem: {},
      perfromData: [
        { single: false, code: "3453t", loction: "中影基地" },
        { single: false, code: "345t6435", loction: "丰台地区" },
        { single: false, code: "23ertghr4234234", loction: "东直门" },
        { single: false, code: "ertg", loction: "怀远门" }
      ]
    };
  },
  created: function() {
    this.getRecordsMenu();
    this.getModelMenu();
  },
  mounted: function() {
    this.$nextTick(function() {});
  },
  methods: {
    equipmentTypeChange(obj) {
      this.selectLabel = obj.label;
      this.search_table();
    },
    search_table() {
      let param = {
        id: this.id,
        deviceType: this.deviceType,
        pageSize: this.limit,
        pageNum: this.currentPage
      };
      this.$api.post("/showRecords/findShowRecords", param).then(res => {
        if (res.code == 1) {
          this.tableData = res.result.list;
          this.total = res.result.total;
        }
      });
    },
    getRecordsMenu() {
      this.$api.post("/dictionaryDetails/getRecordsMenu").then(res => {
        if (res.code == 1) {
          this.RecordsMenu = res.result;
          this.deviceType = res.result[0].id;
          this.selectLabel = res.result[0].name;
          this.search_table();
        }
      });
    },
    getModelMenu() {
      this.$api.post("/dictionaryDetails/getModelMenu").then(res => {
        if (res.code == 1) {
          this.ModelMenu = res.result;
        }
      });
    },

    changeIndex(index) {
      return index < 10 ? "0" + (index + 1) : index + 1;
    },
    // 改变页面，current为改变后的页面
    currentChange(current) {
      this.currentPage = current;
    },
    // 改变每页的条数
    changePageSize(limit) {
      this.limit = limit;
    },
    // 新建播放目录
    editPlay() {
      this.playTarget = "add";
      this.formItemFile.fileName = "";
      this.addPlayFlag = true;
    },
    // 编辑播放目录
    editPlayDrectory(index) {
      this.playTarget = "edit";
      this.addPlayFlag = true;
      this.$refs.addPlayPoup.Index = index;
      this.formItemFile.fileName = this.playDrectory[index].fileName;
    },
    // 播放目录弹窗的确定按钮
    playSure() {
      if (this.playTarget == "add") {
        this.playDrectory.push({ fileName: this.formItemFile.fileName });
      } else if (this.playTarget == "edit") {
        this.playDrectory[
          this.$refs.addPlayPoup.Index
        ].fileName = this.formItemFile.fileName;
      }
    },
    // 删除播放目录
    deletePlayDrectory(index) {
      this.$Common.waring(() => {
        this.playDrectory.splice(index, 1);
      }, "确定要删除吗？");
    },

    // 添加任务
    addTask() {
      this.addTaskFlag = true;
      this.which = "add";
      this.curStep = 0;
      this.formItem.addTaskName = "";
      this.formItem.name = "";
      this.formItem.type = "视频";
      this.formItem.stereo = 0;
      this.formItem.brightness = 0;
      this.formItem.time = "";
    },
    // 行内编辑任务
    editLineTask(index) {
      this.which = "edit";
      this.curStep = 0;
      this.currentDataIndex = index;
      this.formItem.addTaskName = this.tableData[index].addTaskName;
      this.creatTime = this.tableData[index].creatTime;
      this.editTaskFlag = true;
    },
    // 显示更多设备位置按钮
    moreLoction(index) {
      this.morePoupFalg = true;
      this.moreLoctionData = this.tableData[index].perfromData;
    },
    del(index) {},
    // 更多设备显示弹窗的确定按钮
    moreSure() {
      this.morePoupFalg = false;
    },
    // 新建任务弹窗确定按钮
    poupSure() {
      this.addTaskFlag = false;
      this.stepsPoupFlag = true;
      if (this.which == "add") {
        this.stepsPoupTitle = "新建任务";
        // 新增时清空上次选择的设备多选框
        this.perfromData.forEach(ele => {
          ele.single = false;
        });
        this.formItem.creatTime = this.$Common.getCurrentDate();
      } else if (this.which == "edit") {
        this.stepsPoupTitle = "编辑任务";
        this.addTaskName = this.tableData[this.currentDataIndex].addTaskName;
        this.formItem.name = this.tableData[this.currentDataIndex].name;
        this.formItem.type = this.tableData[this.currentDataIndex].type;
        this.formItem.time = this.tableData[this.currentDataIndex].time;
        this.formItem.stereo = this.tableData[this.currentDataIndex].stereo;
        this.formItem.brightness = this.tableData[
          this.currentDataIndex
        ].brightness;
        this.tableData[this.currentDataIndex].perfromData.forEach(ele => {
          this.perfromData.forEach(arry => {
            if (ele.code == arry.code && ele.single) {
              arry.single = true;
            }
          });
        });
      }
    },
    // 新建任务取消
    poupCancel() {},
    abNext() {
      if (this.curStep < 2) {
        this.curStep++;
      }
    },
    abPrev() {
      if (this.curStep > 0) {
        this.curStep--;
      }
    },
    // 步骤条弹窗确认按钮
    abFinish() {
      if (this.which == "add") {
        let perfromData = [];
        this.perfromData.forEach(ele => {
          if (ele.single) {
            perfromData.push(ele);
          }
        });
        let formObj = {
          addTaskName: this.formItem.addTaskName,
          name: this.formItem.name,
          time: this.formItem.time,
          oldTime: this.formItem.time,
          type: this.formItem.type,
          stereo: this.formItem.stereo,
          brightness: this.formItem.brightness,
          perfromData,
          creatTime: this.formItem.creatTime
        };
        // console.log(formObj.time);
        this.tableData.push(formObj);
      } else if (this.which == "edit") {
        this.tableData[
          this.currentDataIndex
        ].addTaskName = this.formItem.addTaskName;
        this.tableData[this.currentDataIndex].type = this.formItem.type;
        this.tableData[this.currentDataIndex].name = this.formItem.name;
        this.tableData[this.currentDataIndex].stereo = this.formItem.stereo;
        this.tableData[
          this.currentDataIndex
        ].brightness = this.formItem.brightness;
        this.tableData[this.currentDataIndex].time = this.formItem.time;
        // console.log(this.tableData[this.currentDataIndex].time);
      }

      this.stepsPoupFlag = false;
    },
    preview(index) {},
    // 格式化时间并展示在页面
    formatTime(time) {
      return (
        this.$Common.getCurrentDate(time[0]) +
        "——" +
        this.$Common.getCurrentDate(time[1])
      );
    },
    //
    del(param) {
      this.$Common.waring(() => {
        this.$api.post(`/group/removeGroup/${param.id}`).then(res => {
          if (res.code == 1) {
            this.search_table();
          }
        });
      });
    },
    edit(param) {
      this.addText = "编辑";
      this.deviceModal = true;
      this.formItem = param;
    }
  }
};
</script>

<style lang="scss" scoped>
.ivu-tabs-bar {
  margin-bottom: 0px;
}
.ivu-form-item {
  margin-bottom: 15px;
}
.step_bar {
  overflow: hidden;
  margin: 20px 0 40px 80px;
  width: 600px;
  box-sizing: border-box;
}
.abox_content,
.abox_content3 {
  margin: auto;
  width: 500px;
  height: 360px;
}
.abox_content3 {
  font-size: 26px;
  color: #2d8cf0;
  line-height: 300px;
  text-align: center;
  i {
    font-size: 50px;
  }
}
.material {
  .material-container {
    padding: 5px;
    background-color: rgb(244, 243, 245);
    overflow: hidden;
    height: calc(100vh - 230px - 60px);
    .material-left {
      width: 25%;
      height: 100%;
      background-color: #fff;
      float: left;
      padding: 20px;
      overflow-y: auto;
      .titleBox {
        line-height: 35px;
        .addBtn {
          float: right;
        }
      }
      .companyInfoBox {
        .companyInfoList {
          .companyItem {
            line-height: 40px;
            &:hover {
              background-color: rgb(244, 243, 245);
            }
            span {
              display: inline-block;
              margin-left: 10px;
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
      width: 100%;
      height: 100%;
      background-color: #fff;
      float: right;
      padding: 20px;
      overflow-y: auto;
      .titleBox {
        line-height: 40px;
        .addBtn {
          float: right;
        }
      }
      .imgDetailsBox {
        .imgDetailsList {
          .imgDetailsThead {
            background-color: rgb(244, 243, 245);
            width: 100%;
            span {
              float: left;
              width: 20%;
              line-height: 30px;
              text-align: center;
            }
          }
          .imgDetailsItem {
            border-bottom: 1px solid #666;
            height: 100px;
            box-sizing: border-box;
            line-height: 100px;
            overflow: hidden;
            .imgBox {
              width: 20%;
              float: left;
              text-align: center;
              .img {
                height: 80px;
                margin-top: 10px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            span {
              float: left;
              text-align: center;
              width: 20%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}
.ivu-modal-body {
  .performTable {
    .performBox {
      .performItem {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #eee;
        width: 100%;
        &:hover {
          background-color: #eee;
        }
        .checked {
          width: 20%;
          float: left;
          text-align: center;
        }
        .equipmentCode {
          width: 30%;
          float: left;
          text-align: center;
        }
        .equipmentLoction {
          width: 50%;
          float: left;
          text-align: center;
        }
      }
    }
  }
}

.addPoupForm {
  margin-bottom: 20px;
}
.addPoupForm label {
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right: 10px;
}
</style>


