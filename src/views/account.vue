<template>
  <div class="newtype subMain">
    <div class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;账号管理</div>
    <div class="btnBox">
      <Button type="primary" class="addTypeBtn" @click="addEquipment">新增账号</Button>
    </div>
    <Tabs value="name1">
      <TabPane label="子账号" name="name1">
        <div class="newdevFrom">
            <!-- {{tableData.slice((currentPage - 1)*limit,currentPage*limit)}} -->
          <Table
            ref="addPoup"
            :columns="tableColumns"
            :data="tableData"
            :loading="loading"
          >
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
              <Button type="warning" size="small" style="margin-right: 5px" @click="edit(index,1)">密码修改</Button>
              <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
          </Table>
        </div>
      </TabPane>
    </Tabs>
    <!-- 弹窗 -->
    <Modal v-model="poupFlag" :title="modalName+'账号'" width="400" @on-cancel="poupCancel">
      <Form ref="formItems" :model="formItems"  :label-width="80" style="padding-right:30px" :rules="ruleCustom">
        <FormItem v-if="target != 'change'" label="登录名" prop="userName" :rules="{required: true, validator: $Validate.notEmpty, trigger: 'blur'}">
          <Input v-model="formItems.userName" />
        </FormItem>
        <FormItem v-if="target == 'add' || target == 'change'" label="密码" prop="password">
          <Input v-model="formItems.password" type="password" />
        </FormItem>
        <FormItem v-if="target == 'change'" label="确认密码" prop="repassword">
          <Input v-model="repassword" type="password" />
        </FormItem>
        <FormItem v-if="target != 'change'" label="手机号码" prop="phone" :rules="{required: true, validator: $Validate.phone, trigger: 'blur'}">
          <Input v-model="formItems.phone" />
        </FormItem>
        <FormItem v-if="target != 'change'" label="邮箱" prop="email" :rules="{required: true, validator: $Validate.email, trigger: 'blur'}">
          <Input v-model="formItems.email" />
        </FormItem>
        <!-- <FormItem label="是否启用">
          <i-switch :value="formItems.isEnabled" @on-change="isStartChange" />
        </FormItem> -->
        <!-- <FormItem v-if="target != 'change'" label="仅查看">
          <i-switch :value="formItems.isAdmin" @on-change="isSeeChange" />
        </FormItem> -->
      </Form>
      <div slot="footer" class="text-c" >
        <button @click="poupFlag=false" type="button" class="ivu-btn ivu-btn-text ivu-btn-large"><!----> <!----> <span>取消</span></button>
				<Button @click="poupSure('formItems')" type="primary">提交</Button>
			</div>
    </Modal>
    <div class="account_subMain_section_footer">
      <Page
        :total="total"
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
    const validatePassCheck = (rule, value, callback) => {        
        if (this.repassword === '') {
            callback(new Error('请再次输入密码'));
        } else if (this.repassword !== this.formItems.password) {
            callback(new Error('两次输入密码不一致!'));
        } else {
            callback();
        }
    };
    const validatePassword = (rule, value, callback) => {
      var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}');
      if (!pwdRegex.test(value)) {
      　　callback(new Error('密码中必须包含大小写字母、数字、特殊字符'))
      }else{
          callback()
      }
    };
    return {
        password1:'',
      repassword:'',
      modalName:'新增',
      editIdx:0,
      loading: false, // 控制加载数据
      poupFlag: false, // 控制弹窗的显示和隐藏
      target: "", // 判断是修改还是新增
      pagesizes: [10], // 控制每页显示多少条数据
      currentPage: 1, // 当前页
      limit: 10, // 当前每页多少条
      name: "",
      type: "",
      remark: "",
      total:0,
      formItems: {
        loginName: "",
        // password: "",
        phone: "",
        email: "",
        isEnabled: true,
        isAdmin: false
      },
      tableColumns: [
        {
          title: "登录名",
          key: "loginName",
          width: 150,
          align: "center"
        },
        {
          title: "手机号码",
          key: "phone",
          align: "center"
        },
        {
          title: "邮箱",
          key: "email",
          align: "center"
        },
        // {
        //   title: "启用状态",
        //   key: "isEnabled",
        //   width: 150,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("i-switch", {
        //       props: {
        //         value: params.row.isEnabled
        //       },
        //       on: {
        //         "on-change": () => {
                  
        //           this.editIdx =
        //             params.index + this.limit * (this.currentPage - 1);
        //           this.tableData[this.editIdx].isEnabled = !params.row.isEnabled;
            
        //         }
        //       }
        //     });
        //   }
        // },
        // {
        //   title: "仅查看",
        //   key: "isAdmin",
        //   width: 150,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("i-switch", {
        //       props: {
        //         value: params.row.isAdmin
        //       },
        //       on: {
        //         "on-change": () => {
        //             // this.editIdx =
        //             // params.index + this.limit * (this.currentPage - 1);
        //             this.changeSwitch(params.index)
        //             // this.tableData[this.editIdx].isAdmin = !params.row.isAdmin;
        //         }
        //       }
        //     });
        //   }
        // },
        {
          title: "操作",
          slot: "action",
          width: 300,
          align: "center"
        }
      ],
      tableData: [],
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
      ],
      ruleCustom:{
          repassword:[
              {
                validator: validatePassCheck,
                trigger: 'blur',
                required: true
              }
          ],
          password:[
              {
                validator: validatePassword,
                trigger: 'blur',
                required: true
              }
          ]
      }
    };
  },
  created: function() {
    var self = this
    this.$api.get('/user/findUser',{pageNum:this.currentPage,pageSize:this.limit}).then(res => {
        self.tableData = res.result.list     
        self.total = res.result.total  
    });
  },
  mounted: function() {
    this.$nextTick(function() {
    });
  },
  methods: {
    isStartChange(){
      this.formItems.isEnabled=!this.formItems.isEnabled
    },
    isSeeChange(){
      this.formItems.isAdmin=!this.formItems.isAdmin
    },
    addEquipment() {
      this.modalName = '新增';
      this.target = "add";
      this.poupFlag = true;
     
      this.formItems={
        userName: "",
        password: "",
        phone: "",
        email: "",
        isEnabled: true,
        isAdmin: true
      }
    },
    edit(index,change) {
        this.formItems={
        userName: "",
        password: "",
        phone: "",
        email: "",
        isEnabled: true,
        isAdmin: true
      }
      this.modalName = '编辑'
      this.target = "edit";
      this.poupFlag = true;
    //   this.formItems =Object.assign({},this.tableData.slice(
    //     (this.currentPage - 1) * this.limit,
    //     this.currentPage * this.limit
    //   )[index]);
        
      this.formItems = JSON.parse(JSON.stringify(this.tableData[index]));
      this.$refs.formItems.Index = index; // 将当前选中数据的索引绑定到弹窗上面
      if(change){
        this.target = "change";
        this.formItems.password = ''
      }
    },
    remove(index) {
        var self = this
        this.$Common.waring(()=>{
            // let currentIndex = index + (this.currentPage - 1) * this.limit;
            // this.tableData.splice(currentIndex, 1);
            self.$api.get('/user/removeUser/' + self.tableData[index].userId).then(res => {
                if(res.code == 1){
                    self.$Message.success(res.message);
                    self.$api.get('/user/findUser',{pageNum:self.currentPage,pageSize:self.limit}).then(res => {
                        if(res.result.list == '' && self.currentPage > 1){
                            self.currentPage--;
                            self.$api.get('/user/findUser',{pageNum:self.currentPage,pageSize:self.limit}).then(res => {
                                self.tableData = res.result.list
                                self.total = res.result.total
                            })
                        }
                        self.tableData = res.result.list
                        self.total = res.result.total
                    }); 
                }
                
            });
        },'确定要删除吗？')
    },
    poupSure(name) {
        var self = this
        this.$refs[name].validate(valid => {
            if (valid) {
                if (this.target == "add") {
                    this.formItems.loginName = this.formItems.userName
                    // this.formItems.password = this.password1
                    // this.tableData.push(Object.assign({},this.formItems) );                    
                    this.$api.post('/registered',this.formItems).then(res => {
                        if(res.code == 1){
                            self.$Message.success(res.message);
                            self.$api.get('/user/findUser',{pageNum:self.currentPage,pageSize:10}).then(res => {
                                self.tableData = res.result.list      
                                self.total = res.result.total    
                            });
                        }
                    });
                } else if (this.target == "edit" || this.target == "change") {
                    let index = this.$refs.formItems.Index;
                    let currentIndex = index + (this.currentPage - 1) * this.limit;
                    console.log(this.formItems);
                    let Data = {
                        userId:this.formItems.userId,
                        userName:this.formItems.userName,
                        phone:this.formItems.phone,
                        email:this.formItems.email,
                        isEnabled:this.formItems.isEnabled,
                        loginName:this.formItems.userName,
                        isAdmin:this.formItems.isAdmin,
                    }
                    if(this.target == "change"){
                        Data.password = this.formItems.password
                    }
                    this.$api.post('/user/updateUser',Data).then(res => {
                        if(res.code == 1){
                            self.$Message.success(res.message);
                            self.$api.get('/user/findUser',{pageNum:self.currentPage,pageSize:self.limit}).then(res => {
                                self.tableData = res.result.list     
                                self.total = res.result.total  
                            });
                        }                        
                    });
                }
                this.poupFlag=false                
            }else{
                this.$Message.info("请按提示正确输入")
            }
        });

    },
    poupCancel() {
    //   this.$Message.info("Clicked cancel");
        this.$refs['formItems'].resetFields();
        this.repassword = ''
    },
    // 改变页面，current为改变后的页面
    currentChange(current) {
        var self = this
        this.currentPage = current;
        this.$api.get('/user/findUser',{pageNum:this.currentPage,pageSize:this.limit}).then(res => {
            self.tableData = res.result.list     
            self.total = res.result.total  
        });
    },
    // 改变每页的条数
    changePageSize(limit) {
      this.limit = limit;
    },
    changeSwitch(index){
        var self = this
        console.log(this.tableData);
        
        this.tableData[index].isAdmin = !this.tableData[index].isAdmin;
        // console.log(this.tableData[index]);
        this.$api.post('/user/updateUser',this.tableData[index]).then(res => {
            if(res.code == 1){
                self.$Message.success(res.message);
                self.$api.get('/user/findUser',{pageNum:self.currentPage,pageSize:self.limit}).then(res => {
                    self.tableData = res.result.list
                    self.total = res.result.total  
                });
            }                        
        });
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
  height: calc(100vh - 234px - 130px);
  overflow-y: auto;
}
</style>


