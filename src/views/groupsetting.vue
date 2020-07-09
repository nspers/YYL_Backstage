<template>
  <div class="material subMain">
    <div class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;设备分组</div>
    <div class="clearfix">
      <Select
        v-model="deviceType"
        style="width:200px"
        label-in-value
        @on-change="equipmentTypeChange"
        placeholder="请选择分组类型"
      >
        <Option v-for="item in RecordsMenu" :value="item.code" :key="item.code">{{ item.name }}</Option>
      </Select>
      <span>
        <Button type="primary" @click="addGroup">新增分组</Button>
      </span>
      <div style="float: right;">
        <span>组名称：</span>
        <AutoComplete
          v-model="nowSearchGroupName"
          :data="data3"
          :filter-method="filterMethod"
          placeholder="请输入组名"
          style="width:200px;"
        ></AutoComplete>
        <Button type="primary" @click="groupSearch">搜索</Button>
      </div>
    </div>

    <Tabs value="name1">
      <TabPane :label="selectLabel+'发布记录'" name="name1">
        <div class="material-container">
          <div class="material-right">
            <Table :columns="columns12" :data="tableData">
              <template slot-scope="{ row }" slot="handle">
                <Button size="small" @click="editName(row)">编辑组名</Button>
                <Button type="error" size="small" @click="del(row)">删除</Button>
                <Button type="warning" size="small" @click="edit(row)">配置</Button>
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

    <Modal v-model="deviceModal" :title="addText" class-name="vertical-center-modal">
      <Form :model="formItem" :label-width="80" v-if="actType !== 'edit'">
        <FormItem label="分组名称">
          <Input v-model="formItem.name" style="width:360px" />
        </FormItem>
      </Form>
      <div class="equipmentContent" style="padding-left: 40px;" v-if="actType === 'edit'">
        <div style="margin-bottom: 10px;">
          <AutoComplete
            v-model="leftDevName"
            :data="data4"
            :filter-method="filterMethod"
            placeholder="请输入设备名"
            style="width:130px;"
          ></AutoComplete>
          <Button type="primary" style="width: 47px;padding-left: 11px" @click="lrSearch('l')">搜索</Button>
          <!--          <AutoComplete-->
          <!--                  v-model="rightDevName"-->
          <!--                  :data="data5"-->
          <!--                  :filter-method="filterMethod"-->
          <!--                  placeholder="请输入设备名"-->
          <!--                  style="width:130px;margin-left: 57px;">-->
          <!--          </AutoComplete>-->
          <!--          <Button type="primary" style="width: 47px;padding-left: 11px" @click="lrSearch('r')">搜索</Button>-->
        </div>
        <Transfer
          :data="UnselectedList"
          :target-keys="selectedList"
          @on-change="transChange"
          :titles="['设备列表','已选设备']"
        ></Transfer>
      </div>
      <div slot="footer">
        <Button @click="deviceModal=false">取消</Button>
        <Button @click="deviceSubmit" type="primary">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      actType: "add",
      addText: "新增",
      nowDevType: 0,
      nowGroupId: 0,
      pushname: [],
      tempDevList: [],
      selectedList: [],
      UnselectedList: [],
      sendDataList: [],
      deviceIds: [],
      deviceModal: false,
      id: null,
      deviceType: null,
      selectLabel: "",
      RecordsMenu: [], //下拉
      ModelMenu: [], //模板下拉
      tableData: [],
      total: 0,
      pagesizes: [10], // 控制每页显示多少条数据
      currentPage: 1, // 当前页
      limit: 10,
      columns12: [
        {
          title: "#",
          type: "index",
          width: 100,
          align: "center"
        },
        {
          title: "分组名称",
          key: "groupName",
          align: "left"
        },
        {
          title: "操作",
          slot: "handle",
          width: 180,
          align: "center"
        }
      ],
      formItem: {},
      nowSearchGroupName: "",
      leftDevName: "",
      rightDevName: "",
      data3: [], //['Steve Jobs', 'Stephen Gary Wozniak', 'Jonathan Paul Ive']
      data4: [], //['Steve Jobs', 'Stephen Gary Wozniak', 'Jonathan Paul Ive']
      data5: [] //['Steve Jobs', 'Stephen Gary Wozniak', 'Jonathan Paul Ive']
    };
  },
  created: function() {
    this.getTypeMenu();
  },
  mounted: function() {
    this.$nextTick(function() {});
  },
  methods: {
    getTypeMenu() {
      var self = this;

      this.$api.post("/equipment/getDeviceTypes").then(res => {
        if (res.code === 1) {
          this.RecordsMenu = res.result;
          if (res.result.length) {
            self.deviceType = res.result[0].code;
            self.equipmentTypeChange();
          }
          // this.$Message.success("获取分组类型成功");
        } else {
          this.$Message.error(res.result);
        }
      });
    },
    equipmentTypeChange(obj) {
      this.nowDevType = this.deviceType;
      this.getTableList(1);
      // this.search_table();
    },
    getTableList(pNum) {
      let sendData = {
        deviceType: this.nowDevType,
        pageNumber: pNum,
        groupName: ""
      };
      // let sendData = {"deviceType": 7,"pageNumber": 1,"groupName":""};
      this.$api.post("/equipment/getDeviceGroupList", sendData).then(res => {
        if (res.code === 1) {
          this.tableData = res.result;
          this.total = res.total;
        }
      });
    },
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    groupSearch() {
      if (this.nowDevType) {
        let sendData = {
          deviceType: this.nowDevType,
          // "deviceType": 7,
          pageNumber: 1,
          groupName: this.nowSearchGroupName
        };
        this.$api.post("/equipment/getDeviceGroupList", sendData).then(res => {
          if (res.code === 1) {
            if (res.result.length) {
              this.tableData = res.result;
            } else {
              this.$Message.error("无匹配数据");
            }
          } else {
            this.deviceModal = false;
            this.$Message.error(res.message);
          }
        });
      } else {
        this.$Message.error("请先选择分组类型");
      }
    },
    lrSearch(LorR) {
      let sendData = {
        deviceType: this.nowDevType,
        groupId: this.nowGroupId,
        uname: "",
        name: ""
      };
      let devName = "";
      let result = "";
      if (LorR === "l") {
        devName = this.leftDevName;
        result = "Unselected";
        sendData.uname = this.leftDevName;
      } else {
        devName = this.rightDevName;
        result = "selected";
        sendData.name = this.rightDevName;
      }
      if (devName) {
        this.$api
          .post("/equipment/getSelectedControllerList", sendData)
          .then(res => {
            if (res.code === 1) {
              if (res.result[result].length) {
                if (result === "Unselected") {
                  this.tempDevList = [];
                  this.selectedList = [];
                  this.UnselectedList = [];
                  this.tempDevList = res.result[result];
                  if (res.result.selected.length > 0) {
                    for (let item of res.result.selected) {
                      this.tempDevList.push(item);
                    }
                    this.getSelectedList(res.result.selected);
                  }
                  this.getUnselectedList();
                }
              } else {
                this.$Message.error("无匹配数据");
              }
            } else {
              this.$Message.error(res.message);
            }
          });
      } else {
        this.$Message.error("搜索内容不能为空");
      }
    },
    addGroup() {
      if (this.deviceType) {
        this.actType = "add";
        this.addText = "新增分组";
        this.nowGroupId = 0;
        this.formItem = {};
        this.deviceModal = true;
      } else {
        this.$Message.error("请先选择分组");
      }
    },
    editName(row) {
      this.actType = "editName";
      this.nowGroupId = row.id;
      this.formItem.name = row.groupName || "无名称";
      this.deviceModal = true;
    },
    edit(row) {
      this.actType = "edit";
      this.nowGroupId = row.id;
      this.deviceModal = true;
      this.tempDevList = [];
      this.selectedList = [];
      this.UnselectedList = [];
      this.leftDevName = "";
      this.rightDevName = "";
      let sendData = { deviceType: this.nowDevType, groupId: this.nowGroupId };
      // let sendData = {"deviceType":7,"groupId":3};//假数据
      this.$api
        .post("/equipment/getSelectedControllerList", sendData)
        .then(res => {
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
          label: item.name || item.lamppostname || item.deviceName
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
    del(row) {
      this.$Common.waring(() => {
        this.$api
          .post("/equipment/delDeviceGroup", { id: row.id })
          .then(res => {
            if (res.code === 1) {
              this.getTableList(1);
            }
          });
      });
    },
    deviceSubmit() {
      if (this.actType === "add") {
        let sendData = {
          deviceType: this.nowDevType,
          groupName: this.formItem.name
        };
        this.$api.post("/equipment/addDeviceGroup", sendData).then(res => {
          if (res.code === 1) {
            this.deviceModal = false;
            this.getTableList(1);
            this.$Message.success(res.result);
          } else {
            this.deviceModal = false;
            this.$Message.error(res.result);
          }
        });
      } else if (this.actType === "editName") {
        let sendData = { id: this.nowGroupId, groupName: this.formItem.name };
        this.$api.post("/equipment/editDeviceGroup", sendData).then(res => {
          if (res.code === 1) {
            this.deviceModal = false;
            this.getTableList(1);
            this.$Message.success(res.result);
          } else {
            this.deviceModal = false;
            this.$Message.error(res.result);
          }
        });
      } else if (this.actType === "edit") {
        let sendData = {
          deviceType: this.nowDevType, //this.nowDevType
          groupId: this.nowGroupId, //this.nowGroupId
          controllerList: this.sendDataList
        };
        this.$api
          .post("/equipment/configureControllerList", sendData)
          .then(res => {
            if (res.code === 1) {
              this.deviceModal = false;
              this.$Message.success(res.result);
            } else {
              this.deviceModal = false;
              this.$Message.error(res.result);
            }
          });
      }
    },
    // search_table() {
    //   let param = {
    //     id: this.id,
    //     deviceType: this.deviceType,
    //     pageSize: this.limit,
    //     pageNum: this.currentPage
    //   };
    //   this.$api.post("/group/findGroup", param).then(res => {
    //     if (res.code == 1) {
    //       this.tableData = res.result.list;
    //       this.total = res.result.total;
    //     }
    //   });
    //   this.pushname = [];
    // },
    // getModelMenu() {
    //   this.$api.post("/dictionaryDetails/getModelMenu").then(res => {
    //     if (res.code == 1) {
    //       this.ModelMenu = res.result;
    //     }
    //   });
    // },
    // 改变页面，current为改变后的页面
    currentChange(current) {
      this.getTableList(current);
    },
    // 改变每页的条数
    changePageSize(limit) {
      this.limit = limit;
    }
  }
};
</script>

