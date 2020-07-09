<template>
  <div class="ploy subMain">
    <p class="page_title">策略记录</p>
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
        <Form :model="formItem1" :rules="ruleValidate" ref="formValidate" :label-width="80">
          <FormItem label="策略名称" prop="pName">
            <Input v-model="formItem1.pName" placeholder="请输入策略名称" style="width:180px;" />
          </FormItem>
          <FormItem label="开始时间">
            <Row>
              <Col span="11">
                <FormItem prop="sdate">
                  <DatePicker type="date" placeholder="Select date" v-model="formItem1.sdate"></DatePicker>
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
                  <DatePicker type="date" placeholder="Select edate" v-model="formItem1.edate"></DatePicker>
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

          <!-- <FormItem label="控制方式" prop="control">
            <Select  style="width:200px;" label-in-value @on-change="changeid">
              <Option
                v-for="item in formItem1.control"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>-->
          <FormItem label="控制方式">
            <Select
              v-model="formItem1.controlMode"
              style="width:200px;"
              label-in-value
              @on-change="changeid"
            >
              <Option
                v-for="item in formItem1.control"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>

            <!-- <Select v-model="formItem1.control" placeholder="Select your city">
               <Option
                v-for="item in formItem1.control"
                :value="item.name"
            >{{ item.name }}</Option>-->
          </FormItem>

          <FormItem label="执行时间" prop="pExeDate">
            <TimePicker v-model="formItem1.pExeDate" type="time" placeholder="Select"></TimePicker>
          </FormItem>

          <FormItem prop="pCheckbox">
            <CheckboxGroup v-model="formItem1.pCheckbox" style="width:380px;margin-top: 12px;">
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
          <div class="y-title">选择集控器</div>
          <div style="height: 242px;    overflow-y: scroll;">
            <Tree :data="data2" ref="tree" show-checkbox multiple></Tree>
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
        <Table :loading="loading" :columns="ployTable" :data="ployList"></Table>
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
export default {
  name: "App",
  data() {
    return {
      data2: [],
      selectLabel: "",
      istrue: "",
      list: [],
      dest: [],
      map: {},
      action: 0,
      status: 0,
      copydata:[],
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
        control: [],
        pExeDate: "",
        pCheckbox: [],
        controlMode: 0,
        executionWeek: [],
        num: 0
      },

      ruleValidate: {
        pName: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        sdate: [
          {
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
          }
        ],
        stime: [
          {
            required: true,
            type: "string",
            message: "Please select time",
            trigger: "change"
          }
        ],
        edate: [
          {
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
          }
        ],
        etime: [
          {
            required: true,
            type: "string",
            message: "Please select time",
            trigger: "change"
          }
        ],
        // control: [
        //   {
        //     required: true,
        //     message: "Please select the city",
        //     trigger: "change"
        //   }
        // ],
        pExeDate: [
          {
            required: true,
            type: "string",
            message: "Mailbox cannot be empty",
            trigger: "change"
          }
        ],
        // fExeDate: [
        //   {
        //     required: true,
        //     type: "string",
        //     message: "Please select time",
        //     trigger: "change"
        //   }
        // ],
        pCheckbox: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "Choose at least one hobby",
            trigger: "change"
          },
          {
            type: "array",
            max: 7,
            message: "Choose two hobbies at best",
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
        // {
        //   title: "是否启用",
        //   key: "status",

        //   align: "center",
        //   render: (h, params) => {
        //     return h("i-switch", {
        //       // props: {
        //       //   type: "primary",
        //       //   value: params.row.status == 1
        //       // },
        //       on: {
        //         "on-change": value => {
        //           this.which = "editstatus";
        //           this.formItem1.id = params.row.id;
        //           this.formItem1.pName = params.row.name;

        //           // this.editIdx = params.index + this.limit * (this.nowpage - 1);
        //           // this.ployList[this.editIdx].status = !params.row.status;
        //           // console.log(this.ployList[this.editIdx].status);
        //           console.log(params.row.status);
        //           params.row.status == 1
        //             ? (this.status = 0)
        //             : (this.status = 1);
        //           this.formItem1.sdate = params.row.startTime.split(" ")[0];
        //           this.formItem1.stime = params.row.startTime.split(" ")[1];
        //           this.formItem1.edate = params.row.endTime.split(" ")[0];
        //           this.formItem1.etime = params.row.endTime.split(" ")[1];
        //           this.formItem1.controlMode = params.row.controlMode;
        //           this.formItem1.pExeDate = params.row.executionTime;
        //           this.formItem1.executionWeek = params.row.executionWeek;
        //           this.formItem2.exeAction = params.row.action;
        //           this.dest = params.row.loops;

        //           this.editstatus();
        //         }
        //       }
        //     });
        //   }
        // },
        {
          title: "是否启用",
          key: "statusb",

          align: "center",
          render: (h, params) => {
            return h("i-switch", {
              props: {
                type: "primary",
                value: params.row.statusb
              },
              on: {
                "on-change": value => {
                  this.which = "editstatus";
                  this.formItem1.id = params.row.id;
                  this.formItem1.pName = params.row.name;
                  this.formItem1.sdate = params.row.startTime.split(" ")[0];
                  this.formItem1.stime = params.row.startTime.split(" ")[1];
                  this.formItem1.edate = params.row.endTime.split(" ")[0];
                  this.formItem1.etime = params.row.endTime.split(" ")[1];
                  this.formItem1.pSwitch = !params.row.statusb;
                  this.formItem1.value = params.row.controlMode;
                  this.formItem1.pExeDate = params.row.executionTime;
                  this.formItem1.executionWeek = params.row.executionWeek;
                  this.formItem2.exeAction = params.row.action;
                  this.dest = params.row.ttaskRecordLoop;

                  this.editstatus();
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
                      this.formItem1.value = params.row.controlMode;
                      this.formItem1.pSwitch = params.row.statusb;
                      this.formItem1.pExeDate = params.row.executionTime;
                      this.formItem1.pCheckbox = params.row.executionWeek.split(
                        ","
                      );
                      this.dest = params.row.ttaskRecordLoop;
                      // this.formItem2.exeAction =1
                      //   ? this.action == 1
                      //   : this.action == 0,
                      console.log(params.row.action);
                      this.formItem2.exeAction =(params.row.action).toString();
                     console.log(typeof(this.formItem2.exeAction) )

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
      ployList: []
    };
  },
  computed: {
    // exeAction() {
    //   return this.formItem2.exeAction;
    // }
  },
  watch: {
    data2(cval, oval) {
      console.log(cval, oval);
    },
    ployList(cval, oval) {},
    // exeAction(newValue, oldValue) {
    //   console.log("new: %s, old: %s", newval, oldVal); //这里面可以执行一旦监听的值发生变化你想做的操作
    // }
    // controlMode(cval, oval) {}
  },
  created: function() {
    console.log(typeof(this.formItem2.exeAction) )
    this.getRecordsMenu(); //初始化下拉框
    this.selectop(); //下拉框
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
          this.formItem1.control = res.result;
          this.formItem1.controlMode = res.result[0].id;
        }
      });
    },
    search_table() {
      let param = {
        deviceType: this.deviceType,
        pageSize: this.limit,
        pageNum: this.nowpage
      };
      this.$api.post("/strategy/findStrategy", param).then(res => {
        if (res.code == 1) {
          this.ployList = res.result.list;
          this.total = res.result.total;
        }
      });
    },
    tree() {
      this.data2 = [];
      var that = this;
      this.$api.post("/strategy/findGateway/" + this.deviceType).then(res => {
        if (res.code == 1) {
          var list = res.result;
          for (let i = 0; i < list.length; i++) {
            this.object = {
              title: list[i].name,
              gatewayId: list[i].gatewayId,
              expand: false,
              children: list[i].loop
            };

            this.data2.push(this.object);
          }
          for (let i = 0; i < this.data2.length; i++) {
            for (let j = 0; j < this.data2[i].children.length; j++) {
              this.data2[i].children[j].title = this.data2[i].children[j].name;
            }
          }
          console.log(this.data2);
          this.copydata=this.data2;
          // this.data2=list;
          // console.log(this.data2)
          // for (let i = 0; i < list.length; i++) {
          //   for (let j = 0; j < list[i].loop.length; j++) {
          //     this.object = {
          //       title: list[i].name,
          //       gatewayId: list[i].gatewayId,
          //       expand: false,
          //       children: [
          //         {
          //           title: list[i].loop[j].name,
          //           number: list[i].loop[j].number
          //         }
          //       ]
          //     };
          //     this.data2.push(this.object);
          //     console.log(this.data2);
          //   }
          // }
        }
      });
    },
    equipmentTypeChange(obj) {
      this.selectLabel = obj.label;
      this.deviceType = obj.value;
      console.log(this.deviceType);
      this.tree(); //tree
      this.search_table();
    },
    changeid(obj) {
      console.log(obj);
      console.log(this.formItem1.controlMode);

      this.formItem1.controlMode = obj.value;
      console.log(this.formItem1.controlMode);
    },
    addBtn() {
      console.log(this.formItem1);
      this.which = "add";
      this.curStep == 0;
      this.$refs["formValidate"].resetFields();
      this.alertBox = true;
    },
    abNext(name) {
      if (this.curStep === 0) {
        console.log(this.data2);
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
    abPrev() {
      if (this.curStep > 0) {
        this.curStep--;

        this.clCurPage = 1;
      }
      if (this.curStep == 0) {
        this.formItem1.executionWeek = this.formItem1.executionWeek.split(",");
      }
    },
    abFinish() {
      if (this.which == "add") {
        this.bb = this.formItem1.pSwitch ? 1 : 0;
        var d = new Date(this.formItem1.sdate);
        var startTime =
          d.getFullYear() +
          "-" +
          (d.getMonth() + 1) +
          "-" +
          d.getDate() +
          " " +
          this.formItem1.stime;
        var s = new Date(this.formItem1.edate);
        var endTime =
          s.getFullYear() +
          "-" +
          (s.getMonth() + 1) +
          "-" +
          s.getDate() +
          " " +
          this.formItem1.etime;

        this.formItem2.exeAction == "开启回路"
          ? this.action == 1
          : this.action == 0,
          //       {

          //     "name": "9月4号测试定时开灯",
          //     "status": 1,
          //     "action": 1,
          //     "startTime": "2019-09-04 10:13:46",
          //     "endTime": "2019-09-06 10:13:46",
          //     "controlMode": 0,
          //     "executionTime": "10:13:46",
          //     "executionWeek": "1,2,3,5",
          //     "loops": [
          //         {
          //             "did": 23,
          //             "gatewayDid":23,
          //             "loop":"1,2,3"

          //         }
          //     ]
          // }
          this.filter();
        this.param = {
          name: this.formItem1.pName,
          status: this.bb,
          startTime: startTime,
          endTime: endTime,
          controlMode: this.formItem1.controlMode,
          executionTime: this.formItem1.pExeDate,
          executionWeek: this.formItem1.executionWeek,
          action: this.formItem2.exeAction,
          loops: this.dest
        };
        this.$api.post("/strategy/addStrategy", this.param).then(res => {
          if (res.code == 1) {
            this.alertBox = false;
            this.search_table();
            this.curStep = 0;
            this.clear();
          }
        });
        console.log(this.param);
      } else if (this.which == "edit") {
        console.log(this.formItem2.exeAction);
        this.aa = this.formItem1.pSwitch ? 1 : 0;
        var d = new Date(this.formItem1.sdate);
        var startTime =
          d.getFullYear() +
          "-" +
          (d.getMonth() + 1) +
          "-" +
          d.getDate() +
          " " +
          this.formItem1.stime;
        var s = new Date(this.formItem1.edate);
        var endTime =
          s.getFullYear() +
          "-" +
          (s.getMonth() + 1) +
          "-" +
          s.getDate() +
          " " +
          this.formItem1.etime;
        this.param = {
          id: this.formItem1.id,
          name: this.formItem1.pName,
          status: this.aa,
          startTime: startTime,
          endTime: endTime,
          controlMode: this.formItem1.value,
          executionTime: this.formItem1.pExeDate,
          executionWeek: this.formItem1.executionWeek,
          action: this.formItem2.exeAction,
          loops: this.dest
        };
        this.edit(this.param);
      }
    },
    edit(objparam) {
      this.$api.post("/strategy/updateStrategy", objparam).then(res => {
        if (res.code == 1) {
          this.alertBox = false;
          this.search_table();
          this.curStep = 0;
          this.clear();
        }
      });
    },

    editstatus() {
      if (this.which == "editstatus") {
        this.status = this.formItem1.pSwitch ? 1 : 0;
        var d = new Date(this.formItem1.sdate);
        var startTime =
          d.getFullYear() +
          "-" +
          (d.getMonth() + 1) +
          "-" +
          d.getDate() +
          " " +
          this.formItem1.stime;
        var s = new Date(this.formItem1.edate);
        var endTime =
          s.getFullYear() +
          "-" +
          (s.getMonth() + 1) +
          "-" +
          s.getDate() +
          " " +
          this.formItem1.etime;
        this.param = {
          id: this.formItem1.id,
          name: this.formItem1.pName,
          status: this.status,
          startTime: startTime,
          endTime: endTime,
          controlMode: this.formItem1.value,
          executionTime: this.formItem1.pExeDate,
          executionWeek: this.formItem1.executionWeek,
          action: this.formItem2.exeAction,
          loops: this.dest
        };
        this.edit(this.param);
      }
    },
    filter() {
      this.list = [];
      (this.dest = []), (this.map = {});
      for (let i = 0; i < this.data2.length; i++) {
        if (this.data2[i].checked) {
          for (let j = 0; j < this.data2[i].children.length; j++) {
            this.list.push({
              did: this.data2[i].gatewayId,
              gatewayDid: this.data2[i].gatewayId,
              loop: this.data2[i].children[j].number
            });
          }
        } else {
          for (let j = 0; j < this.data2[i].children.length; j++) {
            if (this.data2[i].children[j].checked) {
              this.list.push({
                did: this.data2[i].gatewayId,
                gatewayDid: this.data2[i].gatewayId,
                loop: this.data2[i].children[j].number
              });
            }
          }
        }
      }
      for (var i = 0; i < this.list.length; i++) {
        var ai = this.list[i];
        if (!this.map[ai.did]) {
          this.dest.push({
            did: ai.did,
            gatewayDid: ai.gatewayDid,
            loop: ai.loop
          });
          this.map[ai.did] = ai;
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
    },
    delete(deleteid) {
      this.$api.post("/strategy/deleteStrategyById/" + deleteid).then(res => {
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
      // setTimeout(() => {
      //   this.alertBox = false;
      //   this.curStep = 0;
      //   this.formItem1.pName = "";
      //   this.formItem1.sdate = null;
      //   this.formItem1.stime = "";
      //   this.formItem1.edate = null;
      //   this.formItem1.etime = "";
      //   this.formItem1.pSwitch = false;
      //   this.formItem1.control = "";
      //   this.formItem1.pExeDate = "";
      //   this.formItem1.fExeDate = "";
      //   this.formItem1.pCheckbox = [];
      //   this.formItem1.executionWeek = [];
      //   this.formItem2.exeAction = "";
      //   this.data2 = [];
      // }, 500);
      this.formItem1.pSwitch = false;
      this.alertBox = false;
      this.dest = [];
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
