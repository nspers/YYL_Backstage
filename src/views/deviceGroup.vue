<template>
  <div class="material subMain">
    <div class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;设备分组</div>
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
        <Button type="primary" @click="addGroup">新增分组</Button>
      </span>
    </div>

    <Tabs value="name1">
      <TabPane :label="selectLabel+'发布记录'" name="name1">
        <div class="material-container">
          <div class="material-right">
            <Table :columns="columns12" :data="tableData">
              <template slot-scope="{ row }" slot="handle">
                <Button type="primary" size="small" @click="edit(row)">编辑</Button>
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

    <Modal v-model="deviceModal" :title="addText+'分组'" class-name="vertical-center-modal">
      <Form :model="formItem" :label-width="80">
        <FormItem label="分组名称">
          <Input v-model="formItem.name" style="width:360px" />
        </FormItem>
      </Form>
      <div class="equipmentContent" style="padding-left:20px">
        <Transfer
          :data="deviceList"
          :target-keys="deviceIds"
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
      addText: "新增",
      pushname: [],
      deviceList: [
        {
          key: "1",
          label: "Content 1Content 1Content 1Content 1"
        }
      ],
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
          title: "分组名称",
          key: "name",
          align: "center"
        },
        {
          title: "设备名称",
          key: "deviceName",
          align: "center"
        },
        {
          title: "操作",
          slot: "handle",
          width: 150,
          align: "center"
        }
      ],
      formItem: {}
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
    addGroup() {
      this.deviceList = [];
      this.$api
        .post(`/group/getDeviceMenu/${this.deviceType}`)
        .then(res => {
          if (res.code == 1) {
            this.deviceList = res.result.map(item => {
              item.key = item.id;
              item.deviceName = item.deviceName;
              item.label = item.deviceName;
              return item;
            });
          }
        })
        .then(res => {
          if (this.deviceList.length > 0) {
            this.addText = "新增";
            this.formItem.id = null;
            this.formItem.name = "";
            this.deviceIds = [];
            this.deviceModal = true;
          } else {
            this.$Message.info("已无可选设备");
          }
        });
    },
    transChange(newdeviceIds) {
      this.deviceIds = newdeviceIds;
    },
    deviceSubmit() {
      this.formItem.deviceType = this.deviceType;
      this.formItem.deviceIds = this.deviceIds;
      if (this.formItem.name!="") {
        for (let i = 0; i < this.deviceList.length; i++) {
          for (let j = 0; j < this.deviceIds.length; j++) {
            if (this.deviceList[i].id == this.deviceIds[j]) {
              this.pushname.push(this.deviceList[i].label);
            }
          }
        }
      this.formItem.deviceNames = this.pushname;
      }
      let url =
        this.addText == "新增" ? "/group/addGroup" : "/group/updateGroup";
      this.$api.post(url, this.formItem).then(res => {
        if (res.code == 1) {
          this.deviceModal = false;
          this.search_table();
        }
      });
    },
    getDeviceList() {
      this.deviceList = [];
      this.$api.post(`/group/getDeviceMenu/${this.deviceType}`).then(res => {
        if (res.code == 1) {
          this.deviceList = res.result.map(item => {
            item.key = item.id;
            item.label = item.deviceName;
            return item;
          });
        }
      });
    },
    equipmentTypeChange(obj) {
      this.getDeviceList();
      this.search_table();
    },
    search_table() {
      let param = {
        id: this.id,
        deviceType: this.deviceType,
        pageSize: this.limit,
        pageNum: this.currentPage
      };
      this.$api.post("/group/findGroup", param).then(res => {
        if (res.code == 1) {
          this.tableData = res.result.list;
          this.total = res.result.total;
        }
      });
      this.pushname = [];
    },
    getRecordsMenu() {
      this.$api.post("/dictionaryDetails/getRecordsMenu").then(res => {
        if (res.code == 1) {
          this.RecordsMenu = res.result;
          this.deviceType = res.result[0].id;
          this.selectLabel = res.result[0].name;
          this.search_table();
          this.getDeviceList();
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
    // 改变页面，current为改变后的页面
    currentChange(current) {
      this.currentPage = current;
      this.search_table();
    },
    // 改变每页的条数
    changePageSize(limit) {
      this.limit = limit;
    },
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
      let obj = {
        id: param.id,
        deviceType: this.deviceType,
        deviceId: this.deviceType
      };
      this.$api
        .post(`/group/getDeviceMenu/${this.deviceType}`)
        .then(res => {
          if (res.code == 1) {
            this.deviceList = res.result.map(item => {
              item.key = item.id;
              item.label = item.deviceName;
              return item;
            });
          }
        })
        .then(res1 => {
          this.$api.post("/group/findGroup", obj).then(res => {
            if (res.code == 1) {
              var arr = res.result.map(item => {
                item.key = item.id;
                item.label = item.deviceName;
                return item;
              });

              var deviceList = new Set([
                ...arr.map(item => JSON.stringify(item)),
                ...this.deviceList.map(item => JSON.stringify(item))
              ]);
              this.deviceList = Array.from(deviceList).map(item =>
                JSON.parse(item)
              );
              this.deviceIds = res.result.map(item => item.id);
            }
          });
        });
    }
  }
};
</script>

