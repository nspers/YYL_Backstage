<template>
  <div class="adbook subMain clearfix">
    <p class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;灯杆管理</p>
    <div class="top_btn clearfix">
      <Input v-model="keyword" placeholder="请输入灯杆名称..." style="width: 200px" />
      <Button type="primary" @click="currentChange(1)">搜索</Button>
      <Button type="primary" @click="addBtn" style="float: right;">新增灯杆</Button>
    </div>
    <Modal
      v-model="modal1"
      width="400"
      :title="aboxTitle"
      :closable="false"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <div class="f_box">
        <Form :label-width="100" :model="formItem" :rules="ruleValidate" ref="formValidate">
          <FormItem label="灯杆名称" prop="lamppostname">
            <Input v-model="formItem.lamppostname" placeholder="Enter something..." />
          </FormItem>
          <FormItem label="位置">
            <Row>
              <Col span="19">
                <FormItem prop="longitude">
                  <Input type="text" v-model="formItem.longitude" placeholder="Enter something..."></Input>
                </FormItem>
              </Col>
              <Col span="4" offset="1">经度</Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <Col span="19">
                <FormItem prop="latitude">
                  <Input type="text" v-model="formItem.latitude" placeholder="Enter something..."></Input>
                </FormItem>
              </Col>
              <Col span="4" offset="1">纬度</Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <Col span="19">
                <FormItem prop="height">
                  <Input type="text" v-model="formItem.height" placeholder="Enter something..."></Input>
                </FormItem>
              </Col>
              <Col span="4" offset="1">高度</Col>
            </Row>
          </FormItem>
        </Form>
      </div>

      <div slot="footer">
        <Button type="text" @click="cancel('formValidate')">取消</Button>
        <Button type="primary" @click="ok('formValidate')">保存</Button>
      </div>
    </Modal>
    <Tabs value="name1">
      <TabPane label="灯杆列表" name="name1">
        <Table :loading="loading" :columns="columns7" :data="siteList"></Table>
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
  name: "site",
  data() {
    return {
      keyword: "",
      formItem: {
        lamppostname: "",
        longitude: "",
        latitude: "",
        height: 0
      },
      id: 0,
      aboxTitle: "",
      modal1: false,
      loading: false,
      limit: 10,
      total: 0,
      nowpage: 1,
      currentpage: 1,
      pagesizes: [10],
      siteList: [],
      ruleValidate: {
        lamppostname: [
          {
            required: true,
            message: "此项不能为空",
            trigger: "blur"
          }
        ],
        longitude: [
          {
            required: true,
            message: "此项不能为空",
            trigger: "blur"
          }
        ],
        latitude: [
          {
            required: true,
            message: "此项不能为空",
            trigger: "blur"
          }
        ],
        height: [
          {
            required: true,
            message: "此项不能为空",
            trigger: "blur"
          }
        ]
      },
      columns7: [
        {
          title: "灯杆名称",
          key: "lamppostname",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.lamppostname);
          }
        },
        {
          title: "灯杆经度",
          key: "longitude",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.longitude);
          }
        },
        {
          title: "灯杆纬度",
          key: "latitude",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.latitude);
          }
        },
        {
          title: "高度",
          key: "height",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.height);
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
                      this.modal1 = true;
                      this.aboxTitle = "编辑";
                      this.formItem.lamppostname = params.row.lamppostname;
                      this.formItem.latitude = params.row.latitude;
                      this.formItem.longitude = params.row.longitude;
                      this.formItem.height = params.row.height;
                      this.id = params.row.id;
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
                          .post(`/lighpole/removeLamppostById/${params.row.id}`)
                          .then(res => {
                            if (res.code == 0) {
                              // 有设备绑定不让删除提示
                              this.$Message.error(res.message);
                            } else if (res.code == 1) {
                              if (currentIndex == 0) {
                                this.nowpage = 1;
                              }
                              this.gettablelist();
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
  watch: {
    siteList(cval, oval) {}
  },
  created: function() {
    this.gettablelist();
  },
  mounted: function() {
    this.$nextTick(function() {});
  },
  methods: {
    gettablelist() {
      let param = {
        lamppostname: this.keyword,
        pageSize: this.limit,
        pageNum: this.nowpage
      };
      this.$api.post("/lighpole/findLamppost", param).then(res => {
        if (res.code == 1) {
          this.siteList = res.result.list;
          this.total = res.result.total;
        }
      });
    },
    addBtn() {
      this.which = "add";
      this.$refs["formValidate"].resetFields();
      this.aboxTitle = "新增灯杆";
      this.modal1 = true;
      this.formItem.lamppostname = "";
      this.formItem.longitude = "";
      this.formItem.longitude = "";
      this.formItem.height = "";
    },
    change1(status) {},
    change2(status) {},
    ok(name) {
      var that = this;
      if (this.which === "add") {
        this.$refs[name].validate(valid => {
          if (valid) {
            let params = {
              lamppostname: this.formItem.lamppostname,
              longitude: Number(this.formItem.longitude),
              latitude: Number(this.formItem.latitude),
              height: this.formItem.height
            };
            this.$api
              .post("/lighpole/addOrupdateLamppost", params)
              .then(res => {
                if (res.code == 1) {
                  this.gettablelist();
                }
              });
            this.$Message.success("Success");
            this.modal1 = false;
          } else {
            this.$Message.error("Fail!");
          }
        });
      } else if (this.which === "edit") {
        let params = {
          id: this.id,
          lamppostname: this.formItem.lamppostname,
          longitude: Number(this.formItem.longitude),
          latitude: Number(this.formItem.latitude),
          height: this.formItem.height
        };
        this.modal1 = false;
        this.stations = [];
        this.$api.post("/lighpole/updateLamppost", params).then(res => {
          if (res.code == 1) {
            this.gettablelist();
          }
        });
      }
    },
    cancel(name) {
      this.modal1 = false;
      this.$refs[name].resetFields();
      // this.$emit('on-cancel')
    },
    currentChange(current) {
      this.nowpage = current;
      this.gettablelist();
    }
  }
};
</script>

<style>
.sa_input {
  margin-left: 10px;
}
</style>