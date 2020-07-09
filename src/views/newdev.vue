<template>
  <div class="newtype subMain">
    <div class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;新增设备</div>
    <div class="btnBox">
      <Select v-model="equipmentType" style="width:200px">
        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button type="primary" class="newBtn" @click="modal2 = true">批量添加设备</Button>
      <Button type="primary" class="newBtn" @click="addEquipment">新增设备</Button>
    </div>

    <!-- 表格 -->
    <Tabs value="name1">
      <TabPane :label="equipmentType" name="name1">
        <div class="newdevFrom">
          <Table
            :columns="columns12"
            :data="data6.slice((currentPage - 1)*limit,currentPage*limit)"
            :loading="loading"
          >
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, column, index }" slot="switch">
              <i-switch v-model="row.useing" @on-change="changeSwitch(index)" />
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
              <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
          </Table>
        </div>
      </TabPane>
    </Tabs>

    <!-- 新增设备弹窗 -->
    <Modal
      v-model="modal1"
      title="新增设备"
      class-name="vertical-center-modal"
      ref="addPoup"
      @on-ok="poupSure"
      @on-cancel="poupCancel"
    >
      <Form :model="formItem" :label-width="80">
        <FormItem label="设备名称">
          <Select v-model="formItem.name">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="设备编码">
          <Input v-model="formItem.code" placeholder="Enter something..." />
        </FormItem>
        <FormItem label="设备类型">
          <Input v-model="formItem.type" placeholder="Enter something..." />
        </FormItem>
        <FormItem label="是否启用">
          <i-switch v-model="formItem.useing" @on-change="changePoupSwitch" />
        </FormItem>
        <FormItem label="描述">
          <Input
            v-model="formItem.remark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="Enter something..."
          />
        </FormItem>
      </Form>
    </Modal>

    <!-- 批量设备弹窗 -->
    <Modal
      v-model="modal2"
      title="批量添加设备"
      class-name="vertical-center-modal"
      @on-ok="upSure"
      @on-cancel="upCancel"
    >
      <Upload action="//jsonplaceholder.typicode.com/posts/">
        <Button icon="ios-cloud-upload-outline">Upload files</Button>
      </Upload>
      <Button type="primary" class="downBtn">下载模版</Button>
    </Modal>
    <div class="account_subMain_section_footer">
      <Page
        size="small"
        :total="data6.length"
        style="margin-top:0px;"
        show-total
        show-elevator
        :page-size-opts="pagesizes"
        :page-size="limit"
        @on-change="currentChange"
        @on-page-size-change="changePageSize"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      equipmentType: "照明管理", // 设备类型
      target: "", // 判断新增还是编辑
      loading: false, // 控制加载数据
      modal1: false, // 控制添加设备弹窗
      modal2: false, // 控制批量添加设备弹窗
      pagesizes: [10], // 控制每页显示多少条数据
      currentPage: 1, // 当前页
      limit: 10,
      formItem: {
        useing: true, // 新增时是否启用
        name: "",
        code: "",
        type: "",
        remark: ""
      },
      columns12: [
        {
          title: "设备名称",
          slot: "name",
          align: "center"
        },
        {
          title: "设备编号",
          key: "code",
          align: "center"
        },
        {
          title: "设备类型",
          key: "type",
          align: "center"
        },
        {
          title: "是否启用",
          slot: "switch",
          width: 150,
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      data6: [
        {
          name: "集中控制器",
          type: "照明",
          useing: false,
          code: "3456346t345",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "LED屏",
          type: "LCD屏",
          useing: false,
          code: "3456346t345",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "LCD屏",
          type: "LED屏",
          useing: true,
          code: "3456346t345",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "集中控制器",
          type: "LED屏",
          useing: false,
          code: "3456346t345",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "集中控制器",
          type: "LCD屏",
          useing: true,
          code: "3456346t345",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "LED屏",
          type: "LCD屏",
          useing: false,
          code: "3456346t345",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "LED屏",
          type: "LCD屏",
          useing: false,
          code: "3456346t345",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "LED屏",
          type: "LCD屏",
          useing: false,
          code: "3456346t345",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "LED屏",
          type: "LCD屏",
          useing: false,
          code: "3456346t345",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "LED屏",
          type: "LCD屏",
          useing: false,
          code: "3456346t345",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "LED屏",
          type: "LCD屏",
          useing: true,
          code: "3456346t345",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "LED屏",
          type: "LCD屏",
          useing: false,
          code: "3456346t345",
          remark: "New York No. 1 Lake Park"
        }
      ],
      cityList: [
        {
          value: "照明管理",
          label: "照明管理"
        },
        {
          value: "LCD屏",
          label: "LCD屏"
        },
        {
          value: "LED屏",
          label: "LED屏"
        },
        {
          value: "用电管理",
          label: "用电管理"
        },
        {
          value: "集中控制器",
          label: "集中控制器"
        }
      ]
    };
  },
  created: function() {},
  mounted: function() {
    this.$nextTick(function() {});
  },
  methods: {
    edit(index) {
      // this.$Modal.info({
      //   title: "User Info",
      //   content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      // });
      this.modal1 = true;
      this.target = "edit";
      this.formItem.name = this.data6.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )[index].name;
      this.formItem.type = this.data6.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )[index].type;
      this.formItem.useing = this.data6.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )[index].useing;
      this.formItem.code = this.data6.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )[index].code;
      this.formItem.remark = this.data6.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )[index].remark;
      this.$refs.addPoup.Index = index; // 将当前选中数据的索引绑定到弹窗上面
    },
    remove(index) {
      this.$Common.waring(() => {
        let currentIndex = index + (this.currentPage - 1) * this.limit;
        this.data6.splice(currentIndex, 1);
      },'确定要删除吗？');
    },
    poupSure() {
      if (this.target == "add") {
        this.data6.push({
          name: this.formItem.name,
          type: this.formItem.type,
          remark: this.formItem.remark,
          useing: this.formItem.useing,
          code: this.formItem.code
        });
      } else if (this.target == "edit") {
        let index = this.$refs.addPoup.Index;
        let data = this.data6.slice(
          (this.currentPage - 1) * this.limit,
          this.currentPage * this.limit
        )[index];
        data.name = this.formItem.name;
        data.type = this.formItem.type;
        data.useing = this.formItem.useing;
        data.code = this.formItem.code;
        data.remark = this.formItem.remark;
      }
    },
    poupCancel() {
      // this.$Message.info("Clicked cancel");
    },
    upSure() {
      // this.$Message.info("Clicked ok");
    },
    upCancel() {
      // this.$Message.info("Clicked cancel");
    },
    // 表格中开关控制
    changeSwitch(index) {
      this.data6.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )[index].useing = !this.data6.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )[index].useing;
    },
    // 弹窗中的开关，
    changePoupSwitch() {
      let index = this.$refs.addPoup.Index;
      this.data6.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )[index].useing = !this.data6.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )[index].useing;
    },
    addEquipment() {
      this.modal1 = true;
      this.target = "add";
      this.formItem.name = "";
      this.formItem.code = "";
      this.formItem.type = "";
      this.formItem.remark = "";
    },
    // 改变页面，current为改变后的页面
    currentChange(current) {
      this.currentPage = current;
    },
    // 改变每页的条数
    changePageSize(limit) {
      this.limit = limit;
    }
  }
};
</script>

<style scoped>
.ivu-btn {
  cursor: pointer;
}
.btnBox {
  height: 40px;
  line-height: 40px;
}
.newtype .newBtn {
  float: right;
  margin-top: 8px;
  margin-left: 10px;
}
.downBtn {
  position: absolute;
  left: 150px;
  top: 67px;
}
.newdevFrom {
  height: calc(100vh - 234px - 130px);
  overflow-y: auto;
}
</style>


