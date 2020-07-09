<template>
  <div class="adbook subMain clearfix">
    <p class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;通讯录管理</p>
    <div class="top_btn clearfix">
      <Button type="primary" @click="addBtn" style="float: right;">添加</Button>
    </div>
    <Modal v-model="modal1" width="400" :title="aboxTitle" :closable="false">
      <div class="f_box">
        <Form ref="formItem" :model="formItem" :rules="ruleInline" :label-width="60">
          <FormItem prop="name" label="姓名">
            <Input v-model="formItem.name" placeholder="请输入姓名" />
          </FormItem>
          <FormItem prop="telephone" label="电话">
            <Input v-model="formItem.telephone" placeholder="请输入电话" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" @click="ok">确定</Button>
      </div>
    </Modal>
    <Tabs value="name1">
      <TabPane label="通讯录列表" name="name1">
        <Table :loading="loading" :columns="adTable" :data="adList"></Table>
      </TabPane>
    </Tabs>
    <div class="account_subMain_section_footer">
      <Page
        :total="total"
        :page-size="limit"
        size="small"
        show-total
        show-elevator
        style="display: inline-block;margin-top: 0;"
        @on-change="currentChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "adbook",
  data() {
    return {
      aboxTitle: "",
      which: "",
      editIdx: 0,
      modal1: false,
      loading: false,
      total: 0,
      limit: 10,
      currentpage: 1,
      pagesizes: [10],
      formItem: {
        id: 0,
        name: "",
        telephone: ""
      },
      adTable: [
        {
          title: "姓名",
          key: "name",
          width: "180",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.name)
            ]);
          }
        },
        {
          title: "联系电话",
          key: "telephone",
          align: "center"
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
                      this.formItem.id = params.row.id;
                      this.formItem.name = params.row.name;
                      this.formItem.telephone = params.row.telephone;
                      this.editIdx =
                        params.index + this.limit * (this.currentpage - 1);
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
                        this.$api
                          .post(
                            `/addressManagement/deleteAddressManagement/${params.row.id}`,
                            {}
                          )
                          .then(res => {
                            console.log("删除" + res.message);
                            if (params.index == 0) {
                              this.currentpage = 1;
                            }
                            this.getAdlistData();
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
      ],
      adList: [],
      ruleInline: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        telephone: [
          { required: true, message: "请输入电话", trigger: "blur" }
          // { type: 'string', min: 6, message: '长度不得小于6位', trigger: 'blur' }
        ]
      }
    };
  },
  created: function() {
    this.getAdlistData();
  },
  mounted: function() {
    this.$nextTick(function() {});
  },
  methods: {
    getAdlistData() {
      this.loading = true;
      this.adList = [];
      this.$api
        .post("/addressManagement/findAddressManagement", {
          pageNum: this.currentpage
        })
        .then(res => {
          if (res.code === 1) {
            this.total = res.result.total;
            for (let item of res.result.list) {
              this.adList.push(item);
            }
            this.loading = false;
          }
        });
    },
    addBtn() {
      this.which = "add";
      this.modal1 = true;
      this.aboxTitle = "添加";
      this.formItem.id = 0;
      this.formItem.name = "";
      this.formItem.telephone = "";
    },
    ok() {
      if (this.which === "add") {
        this.$refs.formItem.validate(valid => {
          if (valid) {
            this.$api
              .post("/addressManagement/insertAddressManagement", {
                name: this.formItem.name,
                telephone: this.formItem.telephone
              })
              .then(res => {
                // console.log(res);
                this.getAdlistData();
                this.$Message.success("添加" + res.message);
              });
            this.modal1 = false;
          } else {
            this.$Message.success("添加" + res.message);
          }
        });
      } else if (this.which === "edit") {
        this.$refs.formItem.validate(valid => {
          if (valid) {
            this.$api
              .post("/addressManagement/updateAddressManagement", {
                id: this.formItem.id,
                name: this.formItem.name,
                telephone: this.formItem.telephone
              })
              .then(res => {
                // console.log('编辑'+res.message);
                this.$Message.success("编辑" + res.message);
                this.getAdlistData();
              });
            this.modal1 = false;
            // this.$Message.success(res.message);
          } else {
            // this.$Message.error(res.message);
          }
        });
      }
      this.boxLoading = false;
      setTimeout(() => {
        this.boxLoading = true;
      }, 200);
    },
    cancel() {
      this.modal1 = false;
      this.$refs.formItem.resetFields();
      // this.$Message.info('Clicked cancel');
    },
    currentChange(current) {
      this.currentpage = current;
      this.getAdlistData();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>