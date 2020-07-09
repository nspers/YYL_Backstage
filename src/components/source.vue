<template>
  <Modal v-model="modalShow" width="1000" :title="'添加'+typeText" :styles="{top: '20px'}" :mask-closable="false">
    <div class="y-material-container">
      <div class="material-left">
        <div class="titleBox">
          <span class="title">素材目录</span>
        </div>
        <div class="companyInfoBox">
          <ul class="companyInfoList">
            <li
              class="companyItem"
              :class="{active: item.id == menuId }"
              v-for="(item,index) in playDrectory"
              @click="menuClick(item.id)"
              :key="index"
            >
              <span :title="item.name">{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="material-right">
        <Tabs>
          <TabPane :label="typeText">
            <!-- <div class="seachBox">
            <div class>
              <Input style="width:300px;" v-model="sourceName" placeholder="Enter something..." />
              <Button type="primary" @click="search_source">搜索</Button>
            </div>
            </div>-->
            <div class="y-source">
              <label class="y-source-item" v-for="(item,index) in imgDetailsData" :key="index">
                <div class="img-wrap">
                                 <img :src="item.path"  v-if="$Common.typeOfName(item.path) =='img'"/>
                                       <video width="100%" :src="item.path" controls  v-else/>
                </div>
                <div class="y-sourc-name">
                  <Checkbox
                    @on-change="checkChange(item)"
                    v-model="item.check"
                  >{{item.name | filterName}}</Checkbox>
                </div>
              </label>
            </div>
            <!-- <div class="account_subMain_section_footer">
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
            </div>-->
          </TabPane>
        </Tabs>
      </div>
    </div>
		  <div slot="footer">
        <Button @click="cancelModal">取消</Button>
        <Button @click="emitIds" type="primary">确定</Button>
      </div>
  </Modal>
</template>
<script>
export default {
  name: "App",
  props: ["type", "typeText"],
  computed: {
    uploadParm() {
      return {
        type: this.type,
        materialMenuId: this.menuId
      };
    }
  },
  filters: {
    filterName(value) {
      if (!value) return "";
      if ((value + "").length > 10) return (value + "").slice(0, 10) + "...";
      return value;
    }
  },
  data() {
    return {
      modalShow: false,
      selectList: [],
      typeList: [],
      menuId: null,
      sourceName: null,
      formItem: {
        fileName: ""
      },
      playTarget: "add", // 判断播放目录是编辑数据还是添加数据
      pagesizes: [10], // 控制每页显示多少条数据
      currentPage: 1, // 当前页
      limit: 10000,
      total: 0,
      imgDetailsData: [],
      playDrectory: []
    };
  },
  created: function() {},
  mounted: function() {
    this.$nextTick(function() {
      this.search_menu();
    });
  },
  methods: {
    clearSource(){
      this.selectList =[];
      this.imgDetailsData = [];
    },
		showSourceModal(list){
      this.selectList = list;
      this.imgDetailsData = this.formatData(list);
			this.modalShow = true;
      if(this.playDrectory.length > 0){
        this.menuClick(this.playDrectory[0].id);
      }
		},
		emitIds(){
			this.$emit("getSourceList",this.selectList)
			this.modalShow=false;
		},
		cancelModal(){
			this.modalShow=false;
		},
    checkChange(item) {
      if (item.check) {
        this.selectList.push(item);
      } else {
				var index = this.selectList.findIndex(res => res.id==item.id)
        this.selectList.splice(index, 1);
      }
    },
    menuClick(id) {
      this.menuId = id;
      this.search_source();
    },
    search_menu() {
      this.$api.post("/materialMenu/findMaterialMenu").then(res => {
        if (res.code == 1) {
          this.playDrectory = res.result;
          // this.menuId = this.playDrectory[0].id;
          // this.search_source();
        }
      });
    },
    search_source() {
      let parm = {
        id: null,
        pageSize: this.limit,
        pageNum: this.currentPage,
        materialMenuId: this.menuId,
        name: this.sourceName,
        type: this.type
      };
      this.$api.post("/material/findMaterial", parm).then(res => {
        if (res.code == 1) {
          this.imgDetailsData = this.formatData(res.result.list);
          this.total = res.result.total;
        }
      });
    },
    formatData(data) {
      return data.map(item => {
        if (this.selectList.findIndex(res => res.id==item.id) > -1) {
          item.check = true;
        } else {
          item.check = false;
        }
        return item;
      });
    },
    // 改变页面，current为改变后的页面
    currentChange(current) {
      this.currentPage = current;
      this.search_source();
    },
    // 改变每页的条数
    changePageSize(limit) {
      this.limit = limit;
      this.search_source();
    }
  }
};
</script>



