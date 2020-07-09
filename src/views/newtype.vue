<template>
  <div class="newtype subMain">
    <div class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;新增类型</div>
    <div class="btnBox">
      <Button type="primary" class="addTypeBtn" @click="addEquipment">新增类型</Button>
    </div>
    <Tabs value="name1">
      <TabPane label="设备管理" name="name1">
        <div class="newdevFrom">
          <Table
            ref="addPoup"
            :columns="columns12"
            :data="data6.slice((currentPage - 1)*limit,currentPage*limit)"
            :loading="loading"
          >
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
              <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
          </Table>
        </div>
      </TabPane>
    </Tabs>
    <!-- 弹窗 -->
    <Modal
      v-model="poupFlag"
      title="新增类型"
      class-name="vertical-center-modal"
      @on-ok="poupSure"
      @on-cancel="poupCancel"
    >
      <Form :model="formItem" :label-width="80">
        <FormItem label="名称">
          <Input v-model="formItem.name" placeholder="Enter something..." />
        </FormItem>
        <FormItem label="名称">
          <Select v-model="formItem.type">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
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
      loading: false, // 控制加载数据
      poupFlag: false, // 控制弹窗的显示和隐藏
      target: "", // 判断是修改还是新增
      pagesizes: [10], // 控制每页显示多少条数据
      currentPage: 1, // 当前页
      limit: 10, // 当前每页多少条
      formItem: {
        name: "",
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
          title: "设备类型",
          key: "type",
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
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "LED屏幕",
          type: "LCD屏",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "LCD屏幕",
          type: "LED屏",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "集中控制器",
          type: "LED屏",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "集中控制器",
          type: "LCD屏",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "集中控制器",
          type: "LCD屏",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "集中控制器",
          type: "LCD屏",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "集中控制器",
          type: "LCD屏",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "集中控制器",
          type: "LCD屏",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "集中控制器",
          type: "LCD屏",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "集中控制器",
          type: "LCD屏",
          remark: "New York No. 1 Lake Park"
        },
        {
          name: "集中控制器",
          type: "LCD屏",
          remark: "New York No. 1 Lake Park"
        }
      ],
      cityList: [
        {
          value: "照明",
          label: "照明"
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
        }
      ]
    };
  },
  created: function() {},
  mounted: function() {
    this.$nextTick(function() {});
  },
  methods: {
    addEquipment() {
      this.target = "add";
      this.poupFlag = true;
      this.formItem.name = "";
      this.formItem.type = "";
      this.formItem.remark = "";
    },
    edit(index) {
      this.target = "edit";
      this.poupFlag = true;
      this.formItem.name = this.data6.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )[index].name;
      this.formItem.type = this.data6.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )[index].type;
      this.formItem.remark = this.data6.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )[index].remark;
      this.$refs.addPoup.Index = index; // 将当前选中数据的索引绑定到弹窗上面
      // this.$Modal.info({
      //   title: "User Info",
      //   content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].type}<br>Address：${this.data6[index].remark}`
      // });
    },
    remove(index) {
      // let data = this.data6.slice(
      //   (this.currentPage - 1) * this.limit,
      //   this.currentPage * this.limit
      // );
      // data.splice(index, 1);
      this.$Common.waring(() => {
        let currentIndex = index + (this.currentPage - 1) * this.limit;
        this.data6.splice(currentIndex, 1);
      },'确定要删除吗？');
    },
    poupSure() {
      //   this.$Message.info("Clicked ok");
      if (this.target == "add") {
        this.data6.push({
          name: this.formItem.name,
          type: this.formItem.type,
          remark: this.formItem.remark
        });
      } else if (this.target == "edit") {
        let index = this.$refs.addPoup.Index;
        let data = this.data6.slice(
          (this.currentPage - 1) * this.limit,
          this.currentPage * this.limit
        )[index];
        data.name = this.formItem.name;
        data.type = this.formItem.type;
        data.remark = this.formItem.remark;
      }
    },
    poupCancel() {
      this.$Message.info("Clicked cancel");
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

<style scoped lang="scss">
.newtype {
  .btnBox {
    height: 50px;
    .addTypeBtn {
      float: right;
      margin-top: 8px;
    }
  }
}
.newdevFrom {
  height: calc(100vh - 234px - 130px);
  overflow-y: auto;
}
</style>


