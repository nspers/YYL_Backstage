<template>
  <div class="material subMain">
    <div class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;节目发布</div>
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
        <Button type="primary" @click="addRelase">新建节目</Button>
      </span>
    </div>

    <Tabs value="name1">
      <TabPane :label="selectLabel+'发布记录'" name="name1">
        <div class="material-container">
          <div class="material-right">
            <Table :columns="columns12" :data="tableData">
              <template slot-scope="{ row }" slot="handle">
                <Button type="primary" size="small" @click="edit(row)">查看</Button>
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

    <!-- 步骤条弹窗 -->
    <Modal
      v-model="stepsPoupFlag"
      :title="stepsPoupTitle+'节目'"
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
            <Input v-model="name" style="width:200px" />
          </FormItem>
          <FormItem label="模板选择">
            <Select
              v-model="type"
              style="width:200px"
              label-in-value
              @on-change="typeChange"
              :disabled="selectLabel == 'LED单色屏'"
            >
              <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <div v-if="selectLabel != 'LED单色屏' && typeText!='文字' ">
            <Button @click="showSourceModal" type="primary" style="margin-left:20px">选择{{typeText}}</Button>
            <div class="y-source" style="    height: 244px;
    overflow: auto;">
              <div class="y-source-item" v-for="(item,index) in sourceList" :key="index">
                <div class="img-wrap">
                  <img :src="item.path" v-if="$Common.typeOfName(item.path) =='img'" />
                  <video width="130" :src="item.path" controls v-else />
                </div>
                <div class="y-sourc-name clearfix">
                  <span class="fl">{{item.name | filterName}}</span>
                  <span @click="delSource(item)" class="fr hoverFont">删除</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="selectLabel == 'LED单色屏' || typeText == '文字'">
            <FormItem label="节目内容">
              <Input v-model="ledText" type="textarea" :rows="10" />
            </FormItem>
          </div>
        </Form>
      </div>

      <div v-if="curStep === 1" class="abox_content">
        <div class="performTable">
          <ul class="performBox">
            <li class="performItem" v-for="(item,index) in groupList" :key="index">
              <span class="checked">
                <Checkbox v-model="item.check"></Checkbox>
              </span>
              <span class="equipmentCode">{{item.name}}</span>
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
    <material ref="material" :typeText="typeText" :type="type" @getSourceList="getSourceList"></material>

    <Modal
      v-model="seeModal"
      title="查看节目"
      width="700"
      class-name="vertical-center-modal"
      :styles="{top: '0px'}"
    >
      <Form :model="formSee" :label-width="80">
        <FormItem label="节目名称：">{{formSee.name}}</FormItem>
        <FormItem label="模板选择：">{{formSee.typeName}}</FormItem>
        <FormItem label="分组：">{{formSee.location}}</FormItem>
        <div v-if="formSee.sourceList.length>0 ">
          <div class="y-source" style="    max-height: 400px;
    overflow: auto;">
            <div class="y-source-item" v-for="(item,index) in formSee.sourceList" :key="index">
              <div class="img-wrap">
                <img :src="item.path" v-if="$Common.typeOfName(item.path) =='img'" />
                <video :src="item.path" controls v-else />
              </div>
              <div class="y-sourc-name">{{item.name | filterName}}</div>
            </div>
          </div>
        </div>
        <div v-else>
          <FormItem label="节目内容">
            <Input v-model="formSee.ledText" type="textarea" :rows="10" />
          </FormItem>
        </div>
      </Form>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import material from "@/components/source";
export default {
  name: "App",
  filters: {
    filterName(value) {
      if (!value) return "";
      if ((value + "").length > 10) return (value + "").slice(0, 10) + "...";
      return value;
    }
  },
  components: {
    material
  },
  data() {
    return {
      seeModal: false,
      formSee: {
        sourceList: []
      },
      name: "",
      ledText: "",
      playDrectory: [],
      sourceList: [],
      type: null,
      typeText: "",
      typeList: [],
      id: null,
      deviceType: null,
      selectLabel: "",
      RecordsMenu: [], //下拉
      ModelMenu: [], //模板下拉
      tableData: [],
      total: 0,
      formItemFile: {
        fileName: ""
      },
      addPlayFlag: false,
      curStep: 0, // 步骤条进度0，1，2
      stepsPoupFlag: false, // 步骤条弹窗显示和隐藏
      stepsPoupTitle: "",
      pagesizes: [10], // 控制每页显示多少条数据
      currentPage: 1, // 当前页
      limit: 10,
      columns12: [
        {
          title: "节目名称",
          key: "name",
          align: "center"
        },
        {
          title: "发布时间",
          key: "creationTime",
          align: "center"
        },
        {
          title: "节目类型",
          key: "typeName",
          align: "center"
        },
        {
          title: "设备位置",
          key: "location",
          align: "center"
        },
        {
          title: "操作",
          slot: "handle",
          width: 150,
          align: "center"
        }
      ],
      formItem: {},
      groupList: []
    };
  },
  created: function() {
    this.search_menu();
    this.searchType();
    this.getRecordsMenu();
    this.getModelMenu();
  },
  mounted: function() {
    this.$nextTick(function() {});
  },
  methods: {
    delSource(obj) {
      var index = this.sourceList.findIndex(item => item.id == obj.id);
      this.sourceList.splice(index, 1);
      this.$refs.material.showSourceModal(this.sourceList);
    },
    getSourceList(list) {
      this.sourceList = list;
    },
    showSourceModal() {
      this.$refs.material.showSourceModal(this.sourceList);
    },
    addRelase() {
      this.stepsPoupTitle = "新增";

      this.$refs.material.clearSource();
      this.curStep = 0;
      this.sourceList = [];
      this.id = null;
      this.name = "";
      this.groupIds = [];
      this.materialIds = [];
      this.ledText = "";
      this.stepsPoupFlag = true;
      this.search_group();
    },
    equipmentTypeChange(obj) {
      this.selectLabel = obj.label;
      this.search_table();
    },
    typeChange(obj) {
      this.typeText = obj.label;
      this.sourceList = [];
      this.$refs.material.clearSource();
    },
    search_menu() {
      this.$api.post("/materialMenu/findMaterialMenu").then(res => {
        if (res.code == 1) {
          this.playDrectory = res.result;
        }
      });
    },
    searchType() {
      this.$api.post("/dictionaryDetails/getMaterialMenu").then(res => {
        if (res.code == 1) {
          this.typeList = res.result;
          // this.type = this.typeList.filter(item => item.name == "图片")[0].id;
        }
      });
    },
    search_group() {
      let param = {
        deviceType: this.deviceType,
        pageSize: 1000,
        pageNum: 1
      };
      this.$api.post("/group/findGroup", param).then(res => {
        if (res.code == 1) {
          this.groupList = res.result.list.map(item => {
            item.check = false;
            return item;
          });
        }
      });
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
      this.search_table();
    },
    // 改变每页的条数
    changePageSize(limit) {
      this.limit = limit;
    },
    abNext() {
      if (this.curStep == 0) {
        if (!this.name) {
          this.$Message.error("请输入节目名称");
          return;
        }
        // if (!this.type) {
        //   this.$Message.error("请选择模板");
        //   return;
        // }
        let param = {};
        if (
          this.selectLabel != "LED单色屏" &&
          this.typeText != "文字" &&
          this.sourceList.length == 0
        ) {
          this.$Message.error("请选择素材");
          return;
        } else if (
          (this.selectLabel == "LED单色屏" || this.typeText == "文字") &&
          !this.ledText
        ) {
          this.$Message.error("请选择素材");
          return;
        }
      } else if (
        this.curStep == 1 &&
        this.groupList.filter(item => item.check == true).length == 0
      ) {
        this.$Message.error("请选择分组");
        return;
      } else if (this.curStep == 2) {
      }

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
      let param = {
        name: this.name,
        deviceType: this.deviceType,
        type: this.type,
        groupIds: this.groupList
          .filter(item => item.check == true)
          .map(item => item.id)
      };
      if (this.selectLabel != "LED单色屏" && this.typeText != "文字") {
        param.materialIds = this.sourceList.map(item => item.id);
      } else if (this.selectLabel == "LED单色屏" || this.typeText == "文字") {
        param.ledText = this.ledText;
      }
      this.$api.post("/showRecords/addShowRecords", param).then(res => {
        if (res.code == 1) {
          this.stepsPoupFlag = false;
          this.search_table();
        }
      });
    },
    //
    del(param) {
      this.$Common.waring(() => {
        this.$api
          .post(`/showRecords/removeShowRecordsById/${param.id}`)
          .then(res => {
            if (res.code == 1) {
              this.search_table();
            }
          });
      });
    },
    edit(param) {
      this.stepsPoupTitle = "查看";
      this.seeModal = true;
      this.$api
        .post(`/showRecords/findShowRecordsById/${param.id}`)
        .then(res => {
          if (res.code == 1) {
            this.curStep = 0;
            this.formSee = param;
            this.formSee.selectLabel = this.RecordsMenu.find(
              item => item.id == param.deviceType
            ).name;
            if (res.result && res.result.length > 0 && res.result[0]) {
              this.formSee.sourceList = res.result;
            } else {
              this.formSee.sourceList = [];
            }
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.hoverFont {
  color: #2b85e4;
  cursor: pointer;

  &:hover {
    color: #6da9e9;
    text-decoration: underline;
  }
}

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
            border-bottom: 1px solid #ccc;
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
    height: 100%;
    overflow: auto;
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
          width: 80%;
          float: left;
          text-align: left;
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
