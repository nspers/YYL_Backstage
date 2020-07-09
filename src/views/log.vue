<template>
  <div class="newtype subMain">
    <div class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;系统日志</div>
    <Form :model="seachObj" :label-width="80">
      <FormItem label="操作时间">
          <DatePicker type="date" placeholder="选择开始时间" v-model="seachObj.startTime" style="width:180px;" />
          <span style="margin: 0 10px;text-align: center">到</span>
          <DatePicker type="date" placeholder="选择结束时间" v-model="seachObj.endTime" style="width:180px;margin-right:10px" />
          <Button type="primary" @click="search_table" icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <div class="newdevFrom">
      <Table
        ref="addPoup"
        :columns="tableColumns"
        :data="tableData.slice((currentPage - 1)*limit,currentPage*limit)"
        :loading="loading"
      ></Table>
    </div>
    <div class="account_subMain_section_footer">
      <Page
        :total="tableData.length"
        style="margin-top:0px;"
        size="small"
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
      seachObj: {},
      editIdx: 0,
      loading: false, // 控制加载数据
      poupFlag: false, // 控制弹窗的显示和隐藏
      target: "", // 判断是修改还是新增
      pagesizes: [10], // 控制每页显示多少条数据
      currentPage: 1, // 当前页
      limit: 10, // 当前每页多少条
      tableColumns: [
        {
          title: "日志类型",
          key: "user_name",
          width: 150,
          align: "center"
        },
        {
          title: "日志内容",
          key: "user_pwd",
          align: "center"
        },
        {
          title: "操作IP",
          key: "cellphone",
          align: "center"
        },
        {
          title: "操作时间",
          key: "handleTime",
          align: "center"
        }
      ],
      tableData: [
        { user_name: "登录1",  user_pwd: "pc登录",cellphone: '192.168.1.11',handleTime: "2019-7-01 12:12:12",},
        { user_name: "登录2",  user_pwd: "pc登录",cellphone: '192.168.1.11',handleTime: "2019-7-02 12:12:12",},
        { user_name: "登录3",  user_pwd: "pc登录",cellphone: '192.168.1.11',handleTime: "2019-7-03 12:12:12",},
        { user_name: "登录4",  user_pwd: "pc登录",cellphone: '192.168.1.11',handleTime: "2019-7-04 12:12:12",},
        { user_name: "登录5",  user_pwd: "pc登录",cellphone: '192.168.1.11',handleTime: "2019-7-05 12:12:12",},
        { user_name: "登录6",  user_pwd: "pc登录",cellphone: '192.168.1.11',handleTime: "2019-7-06 12:12:12",},
        { user_name: "登录7",  user_pwd: "pc登录",cellphone: '192.168.1.11',handleTime: "2019-7-07 12:12:12",},
        { user_name: "登录8",  user_pwd: "pc登录",cellphone: '192.168.1.11',handleTime: "2019-7-08 12:12:12",},
        { user_name: "登录9",  user_pwd: "pc登录",cellphone: '192.168.1.11',handleTime: "2019-7-09 12:12:12",},
        { user_name: "登录10",  user_pwd: "pc登录",cellphone: '192.168.1.11',handleTime: "2019-7-10 12:12:12",},
      ]
    };
  },
  created: function() {},
  mounted: function() {
    this.$nextTick(function() {});
  },
  methods: {
    search_table() {
        console.log(this.seachObj.startTime)
        console.log(this.seachObj.endTime)
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
.addPoupForm {
  margin-bottom: 20px;
}
.addPoupForm label {
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right: 10px;
}
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
  height: calc(100vh - 234px - 75px);
  overflow-y: auto;
}
</style>


