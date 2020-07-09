<template>
  <div class="adbook subMain clearfix">
    <p class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;短信配置</p>
    <div class="top_btn clearfix">
      <span>报警设备</span>
      <Select v-model="bjsbCode" style="width:200px;margin-left: 20px;" @on-change="smsTypeChange">
        <Option v-for="item in alertEqtList" :value="item.code" :key="item.id">{{ item.name }}</Option>
      </Select>
      <Button type="primary" @click="addBtn" style="float: right;">添加</Button>
    </div>
    <Modal v-model="alertBox" width="400" :title="aboxTitle">
      <div class="f_box" v-if="which === 'add'||which === 'edit'">
        <Form :label-width="100" ref="formItems" :model="formItems">
          <FormItem
            label="报警设备"
            prop="alertEqt"
            :rules="{required: true, validator: $Validate.notEmpty, trigger: 'blur'}"
          >
            <!-- <Select v-model="formItems.alertEqt" style="width:200px;">
              <Option v-for="item in alertEqtList" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>-->
            <p>{{bjsbName}}</p>
          </FormItem>
          <FormItem
            label="接收人"
            prop="recMan"
            :rules="{required: true, validator: $Validate.notEmpty, trigger: 'blur'}"
          >
            <Select v-model.number="formItems.receiverId" style="width:200px;" @on-change="receiverChange">
              <Option v-for="item in recManList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem
            label="短信内容"
            prop="smsContent"
            :rules="{required: true, validator: $Validate.notEmpty, trigger: 'blur'}"
          >
            <Input v-model="formItems.smsContent" type="textarea" :rows="4" placeholder="请输入短信内容" />
          </FormItem>
          <FormItem label="是否启用">
            <i-switch v-model="formItems.smsSwitch" @on-change="change" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer" class="text-c">
        <button @click="alertBox=false" type="button" class="ivu-btn ivu-btn-text ivu-btn-large">
          <span>取消</span>
        </button>
        <Button @click="poupSure('formItems')" type="primary">确定</Button>
      </div>
    </Modal>

    <Modal v-model="look" title="查看" @on-ok="ok" @on-cancel="cancel" width="300">
      <p>报警设备：{{bjsbName}}</p>
      <p>接收人：{{formItems.recMan}}</p>
      <p>短信内容：{{formItems.smsContent}}</p>
    </Modal>

    <Tabs value="name1">
      <TabPane :label="bjsbName" name="name1">
        <Table :loading="loading" :columns="columns7" :data="smsList" style="height:6rem"></Table>
      </TabPane>
    </Tabs>
    <div class="account_subMain_section_footer">
      <Page
        size="small"
        :total="total"
        style="display: inline-block;margin-top: 0;"
        show-total
        show-elevator
        :page-size="limit"
        @on-change="currentChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "sms",
  data() {
    return {
      look: false,
      bjsbCode: "",
      bjsbName: "",
      which: "",
      aboxTitle: "",
      formItems: {
        alertEqt: "",
        recMan: "",
        receiverId: -1,
        smsContent: "",
        smsSwitch: false
      },
      total: 1,
      alertBox: false,
      loading: false,
      editIdx: 0,
      limit: 10,
      currentpage: 1,
      pagesizes: [10],
      alertEqtList: [],
      recManList: [],
      smsList: [],
      columns7: [
        {
          title: "事件类型",
          key: "alarmEquipName",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.alarmEquipName);
          }
        },
        {
          title: "接收人",
          key: "receiverName",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.receiverName);
          }
        },
        {
          title: "是否启用",
          key: "isEnabled",
          align: "center",
          render: (h, params) => {
            return h("i-switch", {
              props: {
                value: params.row.isEnabled == 1 ? true : false
              },
              on: {
                "on-change": () => {
                  this.editIdx = params.index;
                  this.smsList[this.editIdx].isEnabled = !params.row.isEnabled;

                  let data = {
                    id: this.smsList[this.editIdx].id,
                    alarmEquipId: this.smsList[this.editIdx].alarmEquipId,
                    alarmEquipName: this.smsList[this.editIdx].alarmEquipName,
                    receiverId: this.smsList[this.editIdx].receiverId,
                    receiverName: this.smsList[this.editIdx].receiverName,
                    isEnabled: this.smsList[this.editIdx].isEnabled ? 1 : 0,
                    contentMessage: this.smsList[this.editIdx].contentMessage
                  };
                  this.$api
                    .post("/smsConfiguration/updateSmsConfig", data)
                    .then(res => {
                      //   console.log(res);
                      if (res.code == 1) {
                        // this.loading = true;
                        // this.smsList = [];
                        setTimeout(() => {
                          this.currentChange(this.currentpage);
                          this.loading = false;
                        }, 500);
                      }else{
                          this.currentChange(this.currentpage);
                      }
                    });
                }
              }
            });
          }
        },
        {
          title: "短信内容",
          key: "look",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.look = true;
                      this.aboxTitle = "查看";
                      this.formItems.alertEqt = params.row.alarmEquipName;
                      this.formItems.receiverId = params.row.receiverId;
                      this.formItems.recMan = params.row.receiverName;
                      // this.smsSwitch = params.row.isEnabled;
                      this.formItems.smsContent = params.row.contentMessage;
                      // this.editIdx = params.index + (this.limit * (this.currentpage - 1));
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.which = "edit";
                      this.alertBox = true;
                      this.aboxTitle = "编辑";
                      this.formItems.alertEqt = params.row.alarmEquipName;
                      this.formItems.receiverId = params.row.receiverId;
                      this.formItems.recMan = params.row.receiverName;
                      this.formItems.smsSwitch =
                        params.row.isEnabled == 1 ? true : false;
                      this.formItems.smsContent = params.row.contentMessage;
                      this.editIdx = params.index;
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$Common.waring(() => {
                        let currentIndex = params.index;
                        this.$api
                          .post(
                            "/smsConfiguration/deleteSmsConfig/" + params.row.id
                          )
                          .then(res => {
                            // console.log(res);
                            if (res.code == 1) {
                              if (currentIndex == 0) {
                                this.currentChange(1);
                              } else {
                                this.currentChange(this.currentpage);
                              }
                            }
                          });
                      }, "确定要删除吗？");
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  created: function() {
    this.$api.post("/dictionaryDetails/getAlarmType", {}).then(res => {
      if (res.code == 1) {
        this.alertEqtList = res.result;

        if (res.result.length) {
          this.bjsbCode = res.result[0].code;
          this.bjsbName = res.result[0].name;
        }

        this.currentChange(1);
      }
    });
    this.$api
      .post("/addressManagement/findAddressManagement", {
        pageNum: 1,
        pagesize: 9999999
      })
      .then(res => {
        // console.log(res);
        if (res.code == 1) {
          this.recManList = res.result.list;
        }
      });
  },
  mounted: function() {
    this.$nextTick(function() {});
  },
  methods: {
    receiverChange(val){
      this.formItems.recMan = this.recManList.find(obj=>obj.id == val).name;
    },
    addBtn() {
      this.which = "add";
      this.alertBox = true;
      this.aboxTitle = "添加";
      this.formItems.alertEqt = "led";
      this.formItems.recMan = "";
      this.formItems.smsContent = "";
      this.formItems.smsSwitch = false;
    },
    change(status) {
      this.smsSwitch = status;
    },
    poupSure(name) {
      var self = this;
      if (this.which === "add") {
        this.$refs[name].validate(valid => {
          if (valid) {
            let data = {
              alarmEquipId: this.bjsbCode,
              alarmEquipName: this.bjsbName,
              receiverId: this.formItems.receiverId,
              receiverName: this.formItems.recMan,
              contentMessage: this.formItems.smsContent,
              isEnabled: this.formItems.smsSwitch ? 1 : 0
            };
            this.$api
              .post("/smsConfiguration/insertSmsConfig", data)
              .then(res => {
                console.log(res);
                if (res.code == 1) {
                  this.currentChange(this.currentpage);
                }
              });
            this.alertBox = false;
          }
        });
      } else if (this.which === "edit") {
        this.$refs[name].validate(valid => {
          if (valid) {
            let data = {
              id: this.smsList[this.editIdx].id,
              alarmEquipId: this.smsList[this.editIdx].alarmEquipId,
              alarmEquipName: this.bjsbName,
              receiverId: this.formItems.receiverId,
              receiverName: this.formItems.recMan,
              isEnabled: this.formItems.smsSwitch ? 1 : 0,
              contentMessage: this.formItems.smsContent
            };
            this.$api.post("/smsConfiguration/updateSmsConfig", data).then(res => {
              //   console.log(res);
              if (res.code == 1) {
                this.currentChange(this.currentpage);
              }
            });
            this.alertBox = false;
          }
        });
      }
    },
    cancel() {
      this.look = false;
    },
    ok() {
      this.look = false;
    },
    smsTypeChange() {
      var self = this;
      this.bjsbName = this.alertEqtList.find(d => d.code == self.bjsbCode).name;
      this.currentChange(1);
    },
    currentChange(current) {
      this.currentpage = current;
      this.$api
        .post("/smsConfiguration/findSmsConfig", {
          alarmEquipId: this.bjsbCode,
          pageNum: current,
          pageSize: 10
        })
        .then(res => {
          if (res.code == 1) {
            this.smsList = res.result.list;
            this.total = res.result.total;
          } else {
            this.smsList = [];
            this.total = 0;
          }
        });
    }
  }
};
</script>

<style>
</style>