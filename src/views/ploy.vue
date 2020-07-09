<template>
  <div class="ploy subMain">
    <p class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;策略记录</p>
    <!-- <div>{{this.data2}}</div> -->
    <div class="top_btn clearfix">
      <Select
        v-model="deviceType"
        style="width:200px;"
        label-in-value
        @on-change="equipmentTypeChange"
      >
        <Option v-for="item in ploySelect" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <Button type="primary" @click="addBtn" style="float: right;">新增策略</Button>
    </div>

    <Modal
      v-model="alertBox"
      :mask-closable="maskClosable"
      :title="aboxTitle"
      @on-cancel="close"
      width="660"
    >
      <div class="step_bar">
        <Steps :current="curStep">
          <Step title="策略信息"></Step>
          <Step title="执行目标"></Step>
          <Step title="完成"></Step>
        </Steps>
      </div>

      <div v-if="curStep === 0" class="abox_content">
        <Form
          :model="formItem1"
          :rules="ruleValidate"
          ref="formValidate"
          :label-width="100"
          :hide-required-mark="false"
        >
          <FormItem label="策略名称" prop="pName">
            <Input v-model="formItem1.pName" placeholder="请输入策略名称" style="width:180px;" />
          </FormItem>
          <FormItem label="开始时间">
            <Row>
              <Col span="11">
                <FormItem prop="sdate">
                  <DatePicker
                    type="date"
                    placeholder="Select date"
                    :value="formItem1.sdate"
                    format="yyyy-MM-dd"
                    @on-change="formItem1.sdate=$event"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <FormItem prop="stime">
                  <TimePicker type="time" placeholder="Select time" v-model="formItem1.stime"></TimePicker>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="结束时间">
            <Row>
              <Col span="11">
                <FormItem prop="edate">
                  <DatePicker
                    type="date"
                    placeholder="Select edate"
                    :value="formItem1.edate"
                    format="yyyy-MM-dd"
                    @on-change="formItem1.edate=$event"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <FormItem prop="etime">
                  <TimePicker type="time" placeholder="Select etime" v-model="formItem1.etime"></TimePicker>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="是否启用">
            <i-switch :value="formItem1.pSwitch" @on-change="change" />
          </FormItem>
          <FormItem label="控制方式">
            <Select
              v-model="formItem1.controlMode"
              style="width:200px;"
              :label-in-value="true"
              @on-change="changeid"
            >
              <Option
                v-for="item in formItem1.control"
                :value="item.code"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem v-if="formItem1.controlMode == '0'" label="执行时间" prop="pExeDate">
            <TimePicker v-model="formItem1.pExeDate" type="time" placeholder="Select"></TimePicker>
          </FormItem>
          <FormItem
            v-if="formItem1.controlMode == '1' || formItem1.controlMode == '2'"
            :label="formItem1.controlMode == '1' ? '日出偏移量' : '日落偏移量'"
            prop="ofSet"
          >
            <Input v-model="formItem1.ofSet" style="width: 100px" />&nbsp;分钟
          </FormItem>
          <FormItem prop="pCheckbox">
            <CheckboxGroup v-model="formItem1.pCheckbox" style="width:422px;">
              <Checkbox label="1">周一</Checkbox>
              <Checkbox label="2">周二</Checkbox>
              <Checkbox label="3">周三</Checkbox>
              <Checkbox label="4">周四</Checkbox>
              <Checkbox label="5">周五</Checkbox>
              <Checkbox label="6">周六</Checkbox>
              <Checkbox label="7">周日</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Form>
      </div>

      <div v-if="curStep === 1" class="abox_content2">
        <Form :model="formItem2" :rules="ruleValidatee" ref="formValidatee">
          <div class="y-title">选择设备</div>
          <div style="height: 242px;overflow-y: scroll;">
            <Tree :data="data2" ref="tree" show-checkbox multiple @on-check-change="choice"></Tree>
          </div>
          <FormItem label="执行动作" prop="exeAction">
            <RadioGroup v-model="formItem2.exeAction">
              <Radio label="0">断开回路</Radio>
              <Radio label="1">开启回路</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>

      <div v-if="curStep === 2" class="abox_content3">
        <Icon type="md-checkmark-circle-outline" />
        <span>策略{{finishText}}完成</span>
      </div>

      <div slot="footer">
        <Button @click="abCancel" v-if="curStep === 0">取消</Button>
        <Button @click="abPrev" v-if="curStep > 0">上一步</Button>
        <Button @click="abNext('formValidate')" type="primary" v-if="curStep ==0">下一步</Button>
        <Button @click="abNext('formValidatee')" type="primary" v-if="curStep ==1">下一步</Button>
        <Button @click="abFinish" type="primary" v-if="curStep === 2">完成</Button>
      </div>
    </Modal>

    <Tabs value="name1">
      <TabPane :label="selectLabel" name="name1">
        <Table :loading="loading" :columns="ployTable" :data="ployList" style="height:6rem"></Table>
      </TabPane>
    </Tabs>

    <div class="account_subMain_section_footer">
      <Page
        size="small"
        :total="total"
        style="display: inline-block;margin-top: 0;"
        show-total
        show-elevator
        :page-size-opts="pagesizes"
        :page-size="limit"
        @on-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
var mixinApi = {
  // 集中控制器
  "9": {
    find: "/strategy/findStrategy",
    add: "/strategy/addStrategy",
    edit: "/strategy/updateStrategy",
    del: "/strategy/deleteStrategyById/",
    tree: "/strategy/findDevice/"
  },
  // 回路控制
  "10": {
    find: "/strategy/findStrategy",
    add: "/strategy/addStrategy",
    edit: "/strategy/updateStrategy",
    del: "/strategy/deleteStrategyById/",
    tree: "/strategy/findDevice/"
  },
  // 单灯控制
  "11": {
    find: "/strategy/findStrategy",
    add: "/strategy/addStrategy",
    edit: "/strategy/updateStrategy",
    del: "/strategy/deleteStrategyById/",
    tree: "/strategy/findDevice/"
  },
  // 所有照明
  "17": {
    find: "/strategy/findStrategy",
    add: "/strategy/addStrategy",
    edit: "/strategy/updateStrategy",
    del: "/strategy/deleteStrategyById/",
    tree: "/strategy/findDevice/"
  },
  // led
  "ploy": {
    find: "/strategy/findLedStrategy",
    add: "/strategy/insertLedStrategy",
    edit: "/strategy/updateLedStrategy",
    del: "/strategy/deleteLedStrategy/",
    tree: "/strategy/findLedDid"
  }
};
export default {
  name: "App",
  data() {
    return {
      editTreeData: [],
      treeAll: false,
      data2: [
        {
          title: "全选",
          expand: true,
          checked: false,
          children: []
        }
      ],
      selectLabel: "",
      istrue: "",
      list: [],
      map: {},
      action: 0,
      status: 0,
      copydata: [],
      selectid: "",
      which: "",
      param: {},
      deviceType: null,
      aboxTitle: "",
      finishText: "",
      alertBox: false,
      maskClosable: false,
      loading: false,
      editIdx: 0,
      devEditIdx: 0,
      curStep: 0,
      limit: 10,
      pagesizes: [10],
      total: 0,
      aa: 0,
      bb: 0,
      nowpage: 1,
      clCurPage: 1,
      clPagesizes: [5],
      ploySelect: [],
      valueid: "",
      object: "",
      formItem1: {
        id: "",
        pName: "",
        sdate: "",
        stime: "",
        edate: "",
        etime: "",
        pSwitch: false,
        control: [
          { id: 14, name: "定时执行", code: "0" },
          { id: 15, name: "日出策略", code: "1" },
          { id: 16, name: "日落策略", code: "2" }
        ],
        pExeDate: "",
        pCheckbox: [],
        controlMode: "0",
        executionWeek: [],
        num: 0,
        ofSet: ""
      },

      ruleValidate: {
        pName: [
          {
            required: true,
            message: "策略名称不能为空",
            trigger: "change"
          }
        ],
        sdate: [
          {
            required: true,
            type: "string",
            message: "请选择日期",
            trigger: "change"
          }
        ],
        stime: [
          {
            required: true,
            type: "string",
            message: "请选择时间",
            trigger: "change"
          }
        ],
        edate: [
          {
            required: true,
            type: "string",
            message: "请选择日期",
            trigger: "change"
          }
        ],
        etime: [
          {
            required: true,
            type: "string",
            message: "请选择时间",
            trigger: "change"
          }
        ],
        pExeDate: [
          {
            required: true,
            type: "string",
            message: "执行时间不能为空",
            trigger: "change"
          }
        ],
        ofSet: [
          {
            required: true,
            type: "string",
            message: "此项不能为空",
            trigger: "change"
          }
        ],
        pCheckbox: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "此项为必选项",
            trigger: "change"
          },
          {
            type: "array",
            max: 7,
            message: "此项为必选项",
            trigger: "change"
          }
        ]
      },
      formItem2: {
        exeAction: "0"
      },
      ruleValidatee: {
        exeAction: [
          { required: true, message: "Please select gender", trigger: "change" }
        ]
      },
      ployTable: [
        {
          title: "策略名称",
          key: "name",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.name);
          }
        },
        {
          title: "动作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.action == 0 ? "关闭" : "开启");
          }
        },
        {
          title: "生效时间",
          key: "startTime",
          width: 170,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.startTime);
          }
        },
        {
          title: "失效时间",
          key: "endTime",
          width: 170,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.endTime);
          }
        },
        {
          title: "是否启用",
          key: "statusb",

          align: "center",
          render: (h, params) => {
            return h("i-switch", {
              props: {
                type: "primary",
                value: params.row.status == 1 ? true : false
              },
              on: {
                "on-change": value => {
                  this.editIdx = params.index;
                  this.ployList[this.editIdx].status = params.row.status == 1 ? 0 : 1;

                  if (this.isType == "led") {
                    let taskDevice = [];
                    params.row.taskDevice.forEach(item => {
                      taskDevice.push({ did: item.did });
                    });
                    this.param = {
                      type: this.deviceType,
                      id: params.row.id,
                      name: params.row.name,
                      status: !params.row.statusb ? 1 : 0,
                      start_time: params.row.startTime,
                      end_time: params.row.endTime,
                      control_mode: Number(params.row.controlMode),
                      execution_time: params.row.executionTime,
                      execution_week: params.row.executionWeek,
                      action: Number(params.row.action),
                      taskDevice: taskDevice
                    };
                  } else if (
                    this.isType == "control" ||
                    this.isType == "loop" ||
                    this.isType == "single"
                  ) {
                    this.param = {
                      id: params.row.id,
                      name: params.row.name,
                      status: !params.row.statusb ? 1 : 0,
                      startTime: params.row.startTime,
                      endTime: params.row.endTime,
                      controlMode: Number(params.row.controlMode),
                      executionTime: params.row.executionTime,
                      executionWeek: params.row.executionWeek,
                      action: Number(params.row.action),
                      taskDevice: params.row.taskDevice
                    };
                  }
                  this.$api
                    .post(mixinApi[this.$route.name].edit, this.param)
                    .then(res => {
                      if (res.code == 1) {
                        this.alertBox = false;
                        // this.loading = true;
                        // this.ployList = [];
                        setTimeout(() => {
                          this.search_table();
                          this.loading = false;
                        }, 500);
                        this.curStep = 0;
                        this.clear();
                      }else{
                          this.search_table();
                      }
                    });
                }
              }
            });
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
                      this.$refs.formValidate.resetFields();
                      console.log(params.row);
                      this.which = "edit";
                      this.curStep = 0;
                      this.aboxTitle = "编辑策略";
                      this.clCurPage = 1;
                      this.alertBox = true;
                      this.formItem1.id = params.row.id;
                      this.formItem1.pName = params.row.name;
                      this.formItem1.sdate = params.row.startTime.split(" ")[0];
                      this.formItem1.stime = params.row.startTime.split(" ")[1];
                      this.formItem1.edate = params.row.endTime.split(" ")[0];
                      this.formItem1.etime = params.row.endTime.split(" ")[1];
                      this.formItem1.controlMode = params.row.controlMode.toString();
                      this.formItem1.ofSet = params.row.ofSet
                        ? params.row.ofSet.toString()
                        : "";
                      this.formItem1.pSwitch = params.row.statusb;
                      this.formItem1.pExeDate = params.row.executionTime;
                      this.formItem1.pCheckbox = params.row.executionWeek.split(
                        ","
                      );
                      if (this.isType == "led") {
                        this.editTreeData = params.row.taskDevice;
                        params.row.taskDevice.forEach(item => {
                          this.data2[0].children.forEach(ele => {
                            if (item.did == ele.gatewayId) {
                              ele.checked = true;
                            }
                          });
                        });
                      } else if (
                        this.isType == "control" ||
                        this.isType == "single"
                      ) {
                        this.editTreeData = params.row.taskDevice;
                        params.row.taskDevice.forEach(item => {
                          this.data2[0].children.forEach(ele => {
                            if (this.isType == "control") {
                              if (item.gatewayId == ele.gatewayId) {
                                ele.checked = true;
                              }
                            } else if (this.isType == "single") {
                              if (item.deviceId == ele.gatewayId) {
                                ele.checked = true;
                              }
                            }
                          });
                        });
                      } else if (this.isType == "loop") {
                        this.editTreeData = params.row.taskDevice;
                        params.row.taskDevice.forEach(item => {
                          this.data2[0].children.forEach(ele => {
                            if (item.gatewayId == ele.gatewayId) {
                              let loops = item.loopId.split(",");
                              loops.forEach(m => {
                                ele.children.forEach(n => {
                                  if (m == n.gatewayId) {
                                    n.checked = true;
                                  }
                                });
                              });
                            }
                          });
                        });
                      }

                      // console.log(params.row.action);
                      this.formItem2.exeAction = params.row.action.toString();

                      this.finishText = "编辑";
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
                        this.formItem1.id = params.row.id;
                        if (params.index == 0) {
                          this.nowpage = 1;
                        }
                        this.delete(this.formItem1.id);
                      }, "确定要删除吗？");
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      ployList: [],
      treeData: {
        subdata: [],
        power: [],
        isTree: false
      }
    };
  },
  computed: {
    isType: function() {
      if (this.deviceType == 12) {
        return "led";
      } else if (this.deviceType == 9) {
        return "control";
      } else if (this.deviceType == 10) {
        return "loop";
      } else if (this.deviceType == 11) {
        return "single";
      } else if (this.deviceType == 17) {
        return "allLight";
      }
    }
  },
  watch: {
    // data2(cval, oval) {
    //   console.log(cval, oval);
    // },
    ployList(cval, oval) {}
    // exeAction(newValue, oldValue) {
    //   console.log("new: %s, old: %s", newval, oldVal); //这里面可以执行一旦监听的值发生变化你想做的操作
    // }
    // controlMode(cval, oval) {}
  },
  created: function() {
    this.getRecordsMenu(); //初始化下拉框
    this.selectop(); //控制方式下拉框
  },
  mounted: function() {
    this.$nextTick(function() {});
  },
  methods: {
    getRecordsMenu() {
      this.$api.post("/dictionaryDetails/getStrategyDeviceMenu").then(res => {
        if (res.code == 1) {
          this.ploySelect = res.result;
          this.deviceType = res.result[0].id;
          this.selectLabel = res.result[0].name;
          this.search_table(); //初始化列表
          this.tree(); //tree
        }
      });
    },
    selectop() {
      this.$api.post("/dictionaryDetails/getControlMenu").then(res => {
        if (res.code == 1) {
          if (this.isType == "led") {
            this.formItem1.control = [res.result[0]];
            this.formItem1.controlMode = res.result[0].code;
          } else {
            this.formItem1.control = res.result;
            this.formItem1.controlMode = res.result[0].code;
          }
        }
      });
    },
    search_table() {
      let param = {
        deviceType: this.deviceType,
        pageSize: this.limit,
        pageNum: this.nowpage
      };
      this.$api.post(mixinApi[this.$route.name].find, param).then(res => {
        if (res.code == 1) {
          // console.log(res.result.list.sort((a, b) => b.id - a.id));
          this.ployList = res.result.list;
          this.total = res.result.total;
        }
      });
    },

    // 集中控制器的数据
    tree() {
      var that = this;
      if (this.isType == "led") {
        this.$api.get(mixinApi[this.$route.name].tree).then(res => {
          if (res.code == 1) {
            var list = res.result;
            for (let i = 0; i < list.length; i++) {
              this.object = {
                title: list[i].deviceName,
                gatewayId: list[i].id,
                expand: false,
                checked: false,
                children: []
              };
              this.data2[0].children.push(this.object);
            }
            // console.log(this.data2);
            this.copydata = this.data2;
          }
        });
      } else if (
        this.isType == "control" ||
        this.isType == "loop" ||
        this.isType == "single"
      ) {
        this.$api
          .get(mixinApi[this.$route.name].tree + this.deviceType)
          .then(res => {
            if (res.code == 1) {
              var list = res.result;
              for (let i = 0; i < list.length; i++) {
                let obj = {
                  title: list[i].name,
                  gatewayId: list[i].id,
                  expand: true,
                  checked: false,
                  children: []
                };
                if (this.isType == "loop") {
                  list[i].loops.forEach(item => {
                    obj.children.push({
                      title: item.name,
                      gatewayId: item.id,
                      expand: false,
                      checked: false
                    });
                  });
                }
                this.data2[0].children.push(obj);
              }
            }
          });
      }
    },
    // 获取树形空控件选中的数据
    choice() {
      this.treeData.isTree = true;
      // this.choice = this.dg(this.$refs.tree.data2);
      this.treeData.subdata = this.$refs.tree.getCheckedAndIndeterminateNodes(); //获取半选和全选的
      this.treeData.power = this.treeData.subdata.filter(item => {
        return item.children && item.title != "全选"; //因为filter只会返回true的布尔值，所以这里把没有子集的，也就是单个的权限返回出去，用this.treeData.power接收
      });
      console.log("power", this.treeData.power);
    },

    equipmentTypeChange(obj) {
      this.selectLabel = obj.label;
      this.deviceType = obj.value;
      this.data2[0].children = [];
      this.selectop();
      this.search_table();
      this.tree(); //tree
      this.clear();
    },
    changeid(obj) {
      this.formItem1.controlMode = obj ? obj.value : "0";
    },
    addBtn() {
      setTimeout(() => {
        this.$refs["formValidate"].resetFields();
        this.aboxTitle = "新增策略";
        this.alertBox = true;
        this.curStep = 0;
        this.formItem1.pName = "";
        this.formItem1.sdate = "";
        this.formItem1.stime = "";
        this.formItem1.edate = "";
        this.formItem1.etime = "";
        this.formItem1.pSwitch = false;
        this.formItem1.controlMode = 0;
        this.formItem1.pExeDate = "";
        this.formItem1.fExeDate = "";
        this.formItem1.pCheckbox = [];
        this.formItem1.executionWeek = [];
        this.formItem2.exeAction = "";
        this.data2[0].checked = false;
        this.data2[0].children.forEach(item => {
          item.checked = false;
          if (item.children) {
            item.children.forEach(ele => {
              ele.checked = false;
            });
          }
        });
        this.data2[0].indeterminate = false;
        this.which = "add";
      }, 500);
    },
    // 下一步
    abNext(name) {
      if (this.curStep === 0) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.curStep++;
            this.formItem1.executionWeek = [];
            for (let i = 0; i < this.formItem1.pCheckbox.length; i++) {
              this.formItem1.executionWeek.push(this.formItem1.pCheckbox[i]);
            }
            this.formItem1.executionWeek = this.formItem1.executionWeek.join();
            this.$Message.success("Success!");
          } else {
            this.$Message.error("Fail!");
            return;
          }
        });
      } else if (this.curStep === 1) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.curStep++;
            this.$Message.success("Success!");
          } else {
            this.$Message.error("请设置执行动作");
            return;
          }
        });
      }
    },
    // 上一步
    abPrev() {
      if (this.curStep > 0) {
        this.curStep--;
        this.clCurPage = 1;
      }
      if (this.curStep == 0) {
        this.formItem1.executionWeek = this.formItem1.executionWeek.split(",");
      }
    },
    // 完成
    abFinish() {
      if (this.which == "add") {
        this.bb = this.formItem1.pSwitch ? 1 : 0;
        this.formItem2.exeAction == "开启回路"
          ? this.action == 1
          : this.action == 0;
        if (this.isType == "led") {
          let taskDevice = [];
          this.treeData.power.forEach(item => {
            taskDevice.push({ did: item.gatewayId });
          });
          this.param = {
            type: this.deviceType,
            name: this.formItem1.pName,
            status: this.bb,
            start_time: this.formItem1.sdate + " " + this.formItem1.stime,
            end_time: this.formItem1.edate + " " + this.formItem1.etime,
            control_mode: Number(this.formItem1.controlMode),
            execution_time: this.formItem1.pExeDate,
            execution_week: this.formItem1.executionWeek,
            action: Number(this.formItem2.exeAction),
            taskDevice: taskDevice
          };
        } else if (
          this.isType == "control" ||
          this.isType == "loop" ||
          this.isType == "single"
        ) {
          let taskDevice = [];
          if (this.isType == "control" || this.isType == "single") {
            this.treeData.power.forEach(item => {
              taskDevice.push({
                id: "",
                taskId: "",
                deviceId: this.isType == "single" ? item.gatewayId : "",
                gatewayId: this.isType == "control" ? item.gatewayId : "",
                loopId: ""
              });
            });
          } else if (this.isType == "loop") {
            this.treeData.power.forEach(item => {
              let str = "";
              item.children.forEach(ele => {
                if (ele.checked) {
                  str += str ? "," + ele.gatewayId : ele.gatewayId;
                }
              });
              taskDevice.push({
                id: "",
                taskId: "",
                deviceId: "",
                gatewayId: item.gatewayId,
                loopId: str
              });
            });
          }
          this.param = {
            type: this.deviceType,
            name: this.formItem1.pName,
            status: this.bb,
            startTime: this.formItem1.sdate + " " + this.formItem1.stime,
            endTime: this.formItem1.edate + " " + this.formItem1.etime,
            controlMode: Number(this.formItem1.controlMode),
            executionTime: this.formItem1.pExeDate,
            executionWeek: this.formItem1.executionWeek,
            action: Number(this.formItem2.exeAction),
            taskDevice: taskDevice,
            ofSet: this.formItem1.ofSet
          };
        }
        this.$api.post(mixinApi[this.$route.name].add, this.param).then(res => {
          if (res.code == 1) {
            this.alertBox = false;
            this.search_table();
            this.curStep = 0;
            this.clear();
          }
        });
        console.log(this.param);
      } else if (this.which == "edit") {
        if (!this.treeData.isTree) this.treeData.power = this.editTreeData;
        this.aa = this.formItem1.pSwitch ? 1 : 0;
        if (this.isType == "led") {
          let taskDevice = [];
          this.treeData.power.forEach(item => {
            taskDevice.push({
              did: !this.treeData.isTree ? item.did : item.gatewayId
            });
          });
          this.param = {
            type: this.deviceType,
            id: this.formItem1.id,
            name: this.formItem1.pName,
            status: this.aa,
            start_time: this.formItem1.sdate + " " + this.formItem1.stime,
            end_time: this.formItem1.edate + " " + this.formItem1.etime,
            control_mode: Number(this.formItem1.controlMode),
            execution_time: this.formItem1.pExeDate,
            execution_week: this.formItem1.executionWeek,
            action: Number(this.formItem2.exeAction),
            taskDevice: taskDevice
          };
        } else if (
          this.isType == "control" ||
          this.isType == "loop" ||
          this.isType == "single"
        ) {
          let taskDevice = [];
          if (this.isType == "control" || this.isType == "single") {
            this.treeData.power.forEach(item => {
              if (!this.treeData.isTree) {
                taskDevice.push({
                  id: "",
                  taskId: "",
                  deviceId: this.isType == "single" ? item.id : "",
                  gatewayId: this.isType == "control" ? item.id : "",
                  loopId: ""
                });
              } else {
                taskDevice.push({
                  id: "",
                  taskId: "",
                  deviceId: this.isType == "single" ? item.gatewayId : "",
                  gatewayId: this.isType == "control" ? item.gatewayId : "",
                  loopId: ""
                });
              }
            });
          } else if (this.isType == "loop") {
            this.treeData.power.forEach(item => {
              if (!this.treeData.isTree) {
                taskDevice.push({
                  id: "",
                  taskId: "",
                  deviceId: "",
                  gatewayId: item.gatewayId,
                  loopId: item.loopId
                });
              } else {
                let str = "";
                item.children.forEach(ele => {
                  if (ele.checked) {
                    str += str ? "," + ele.gatewayId : ele.gatewayId;
                  }
                });
                taskDevice.push({
                  id: "",
                  taskId: "",
                  deviceId: "",
                  gatewayId: item.gatewayId,
                  loopId: str
                });
              }
            });
          }
          this.param = {
            type: this.deviceType,
            id: this.formItem1.id,
            name: this.formItem1.pName,
            status: this.aa,
            startTime: this.formItem1.sdate + " " + this.formItem1.stime,
            endTime: this.formItem1.edate + " " + this.formItem1.etime,
            controlMode: Number(this.formItem1.controlMode),
            executionTime: this.formItem1.pExeDate,
            executionWeek: this.formItem1.executionWeek,
            action: Number(this.formItem2.exeAction),
            taskDevice: taskDevice
          };
        }
        this.$api.post(mixinApi[this.$route.name].edit, this.param).then(res => {
          if (res.code == 1) {
            this.alertBox = false;
            this.search_table();
            this.curStep = 0;
            this.clear();
          }
        });
      }
      this.clear();
      this.treeData.isTree = false;
    },
    // 删除
    delete(deleteid) {
      this.$api.post(mixinApi[this.$route.name].del + deleteid, {}).then(res => {
        if (res.code == 1) {
          this.search_table(); //初始化列表
        }
      });
    },
    formatDevListCheck() {
      for (let dev of this.devList) {
        dev._checked = false;
      }
    },

    clear() {
      setTimeout(() => {
        // this.$refs["formValidate"].resetFields();
        this.alertBox = false;
        this.curStep = 0;
        this.formItem1.pName = "";
        this.formItem1.sdate = null;
        this.formItem1.stime = "";
        this.formItem1.edate = null;
        this.formItem1.etime = "";
        // this.formItem1.pSwitch = false;
        this.formItem1.controlMode = 0;
        this.formItem1.pExeDate = "";
        this.formItem1.fExeDate = "";
        this.formItem1.pCheckbox = [];
        this.formItem1.executionWeek = [];
        this.formItem2.exeAction = "";
        this.data2[0].checked = false;
        this.data2[0].children.forEach(item => {
          item.checked = false;
          if (item.children) {
            item.children.forEach(ele => {
              ele.checked = false;
            });
          }
        });
        this.data2[0].indeterminate = false;
        // this.data2 = [];
      }, 500);
    },
    abCancel() {
      this.$refs["formValidate"].resetFields();

      this.clear();
    },
    right() {
      this.$refs["formValidate"].resetFields();

      this.clear();
    },
    close() {
      if ((this.curStep = 0)) {
        this.$refs["formValidate"].resetFields();
      }
      this.clear();
    },
    change(status) {
      this.formItem1.pSwitch = !this.formItem1.pSwitch;
    },
    currentChange(current) {
      this.nowpage = current;
      this.search_table();
    }
  }
};
</script>

<style lang="scss">
.y-title {
  font-size: 16px;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
.step_bar {
  overflow: hidden;
  margin: 20px 0 30px 70px;
  width: 600px;
  box-sizing: border-box;
}
.abox_content,
.abox_content2,
.abox_content3 {
  margin: auto;
  width: 500px;
  height: 390px;
}
.abox_content2 {
  width: 90%;
  .page_box {
    width: 100%;
    text-align: right;
  }
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
.ivu-form-item {
  margin-bottom: 20px;
}
</style>
