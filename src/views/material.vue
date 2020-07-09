<template>
  <div class="material subMain">
    <div class="page_title">{{this.$ParentRouter}}&nbsp;&nbsp;>&nbsp;&nbsp;素材管理</div>
    <div class="material-container">
      <div class="material-left">
        <div class="titleBox">
          <span class="title">素材目录</span>
          <span class="addBtn">
            <Button type="primary" size="small" @click="editPlay">新增</Button>
          </span>
        </div>
        <div class="companyInfoBox">
          <ul class="companyInfoList">
            <li
              class="companyItem"
              :class="{active: menuId == item.id}"
              v-for="(item,index) in playDrectory"
              @click="menuClick(item.id)"
              :key="index"
            >
              <span :title="item.name">{{item.name}}</span>
              <span class="operation">
                <Icon type="md-create" class="IconFont" @click="editPlayDrectory(item)" />
                <Icon type="ios-trash" class="IconFont" @click="deletePlayDrectory(item.id)" />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="material-right">
        <Tabs @on-click="tabClick">
          <TabPane :label="type.name" :name="type.name" v-for="type of typeList" :key="type.id">
            <div class="imgTitle">{{typeText}}列表</div>
            <div class="seachBox">
              <div class>
                <Input style="width:300px;" v-model="sourceName" placeholder="Enter something..." />
                <Button type="primary" @click="search_source">搜索</Button>
                <Upload
                  multiple
                  style="width:80px"
                  class="fr"
                  name="multipartFile"
                  :data="uploadParm"
                  :action="$Common.uploadUrl"
                  :before-upload="beforeUpload"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  :format="format"
                  :on-format-error="handleFormatError"
                >
                  <Button type="primary" class="addImg">添加{{typeText}}</Button>
                </Upload>
              </div>

              <!-- <Button type="primary" class="addImg" @click="addImg">
                添加图片
                <input type="file" multiple @change="fileChanged" ref="file" />
              </Button>-->
            </div>
            <div class="imgDetailsBox">
              <Table :columns="columns12" :data="imgDetailsData">
                <template slot-scope="{ row }" slot="img">
                  <div class="imgBox">
                    <div class="img" style="    height: 80px; width: 80px;margin: 5px auto;">
                      <img
                        :src="row.path"
                        v-if="$Common.typeOfName(row.path) =='img'"
                        style="width:100%;height:100%;"
                      />
                      <video
                        width="130"
                        :src="row.path"
                        controls
                        v-else
                        style="width:100%;height:100%;"
                      />
                    </div>
                  </div>
                </template>
                <template slot-scope="{ row }" slot="handle">
                  <Button type="error" size="small" @click="remove(row)">删除</Button>
                </template>
              </Table>
            </div>
            <div class="account_subMain_section_footer">
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
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>

    <!-- 新建播放目录弹窗 -->
    <Modal
      v-model="addPlayFlag"
      width="400"
      ref="addPlayPoup"
      class-name="vertical-center-modal"
      title="新建播放目录"
      @on-ok="playSure"
    >
      <Form :model="formItem" :label-width="80">
        <FormItem label="名称">
          <Input v-model="formItem.fileName" placeholder="Enter something..." style="width:240px;" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    uploadParm() {
      return {
        type: this.type,
        materialMenuId: this.menuId
      };
    },
    format() {
      if (this.typeText == "图片") {
        return ["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"];
      }
      return [
        "mp4",
        "m3u8",
        "rmvb",
        "avi",
        "swf",
        "3gp",
        "mkv",
        "flv",
        "MP4",
        "M3U8",
        "RMVB",
        "AVI",
        "SWF",
        "3GP",
        "MKV",
        "FLV"
      ];
    }
  },
  data() {
    return {
      columns12: [
        {
          title: "预览",
          slot: "img",
          key: "name",
          align: "center"
        },
        {
          title: "文件名",
          key: "name",
          align: "center"
        },
        {
          title: "文件大小",
          key: "fileSize",
          align: "center"
        },
        {
          title: "上传时间",
          key: "creationTime",
          align: "center"
        },
        {
          title: "操作",
          slot: "handle",
          width: 150,
          align: "center"
        }
      ],
      typeFlag: false,
      menuFlag: false,
      typeList: [],
      menuId: null,
      type: null,
      typeText: "",
      sourceName: null,
      formItem: {
        fileName: ""
      },
      addPlayFlag: false,
      playTarget: "add", // 判断播放目录是编辑数据还是添加数据
      pagesizes: [10], // 控制每页显示多少条数据
      currentPage: 1, // 当前页
      limit: 10,
      total: 0,
      imgDetailsData: [],
      playDrectory: []
    };
  },
  created: function() {},
  mounted: function() {
    this.$nextTick(function() {
      this.searchType();
      this.search_menu();
      this.getFirstSource();
    });
  },
  methods: {
    handleFormatError(file) {
      this.$Spin.hide();
      if (this.format) {
        let str = this.format.slice(0, this.format.length / 2).join("、");
        this.$Message.error(" 格式不正确，请上传后缀为" + str + "的文件。");
      }
    },
    beforeUpload() {
      this.$Spin.show();
    },
    uploadSuccess(response, file, fileList) {
      if(response.code == 1){
        this.search_source();
      }else{
        this.$Message.error(response.message);
      }
      this.$Spin.hide();
    },
    uploadError(error, file, fileList) {
      this.$Spin.hide();
      // this.$Message.error('')
    },
    fileChanged() {
      let list = this.$refs.file.files;
      let param = {
        multipartFile: list,
        type: this.type,
        materialMenuId: this.menuId
      };
      this.$api.post2("/material/uploadMaterial", param).then(res => {
        if (res.code == 1) {
          this.search_source();
        }
      });

      // this.$refs.file.value = "";
      console.log("list");
      console.log(list);
    },
    menuClick(id) {
      this.menuId = id;
      this.search_source();
    },
    search_menu() {
      this.$api.post("/materialMenu/findMaterialMenu").then(res => {
        if (res.code == 1) {
          this.playDrectory = res.result;
          this.menuFlag = true;
        }
      });
    },
    getFirstSource() {
      if (this.typeFlag && this.menuFlag) {
        this.menuId = this.playDrectory[0].id;
        this.search_source();
      } else {
        setTimeout(() => {
          this.getFirstSource();
        }, 1000);
      }
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
          this.imgDetailsData = res.result.list;
          this.total = res.result.total;
        }
      });
    },
    searchType() {
      this.$api.post("/dictionaryDetails/getMaterialMenu").then(res => {
        if (res.code == 1) {
          this.typeList = res.result.filter(item => item.name != "文字");
          this.typeFlag = true;
          this.type = this.typeList[0].id;
          this.typeText = this.typeList[0].name;
        }
      });
    },
    tabClick(text) {
      this.type = this.typeList.filter(item => item.name == text)[0].id;
      console.log(this.type);
      this.typeText = text;
      this.search_source();
    },
    remove(row) {
      this.$Common.waring(() => {
        this.$api.post(`/material/removeMaterial/${row.id}`).then(res => {
          if (res.code == 1) {
            this.search_source();
          }
        });
      }, "确定要删除吗？");
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
    },
    // 添加图片
    addImg() {},
    // 添加素材
    addMaterial() {},
    // 新建播放目录
    editPlay() {
      this.playTarget = "add";
      this.formItem.fileName = "";
      this.addPlayFlag = true;
    },
    // 编辑播放目录
    editPlayDrectory(item) {
      this.playTarget = "edit";
      this.addPlayFlag = true;
      this.formItem.editId = item.id;
      this.formItem.fileName = item.name;
    },
    // 播放目录弹窗的确定按钮
    playSure() {
      if (this.playTarget == "add") {
        this.$api
          .post("/materialMenu/addMaterialMenu", {
            name: this.formItem.fileName
          })
          .then(res => {
            if (res.code == 1) {
              this.search_menu();
            }
          });
      } else if (this.playTarget == "edit") {
        this.$api
          .post("/materialMenu/updateMaterialMenu", {
            name: this.formItem.fileName,
            id: this.formItem.editId
          })
          .then(res => {
            if (res.code == 1) {
              this.search_menu();
            }
          });
      }
    },
    // 删除播放目录
    deletePlayDrectory(id) {
      this.$Common.waring(() => {
        this.$api.post(`materialMenu/removeMaterialMenu/${id}`).then(res => {
          if (res.code == 1) {
            this.search_menu();
          }
        });
      }, "确定要删除吗？");
    }
  }
};
</script>

<style lang="scss" scoped>
.material {
  .material-container {
    padding: 5px;
    // background-color: rgb(244, 243, 245);
    overflow: hidden;
    height: calc(100vh - 141px - 60px);

    .material-left {
      width: 25%;
      height: 100%;
      background-color: #fff;
      float: left;
      padding: 0px;
      overflow-y: auto;
      border: 1px solid #ccc;

      .titleBox {
        border-bottom: 1px solid #e9eaec;
        padding: 14px 16px;
        font-weight: bold;
        .addBtn {
          float: right;
        }
      }

      .companyInfoBox {
        .companyInfoList {
          // padding:0 10px;
          .companyItem.active {
            background-color: #515a6e;
            color: #f7f7f7;
          }
          .companyItem {
            transition: all 0.3s ease-in;
            cursor: pointer;
            line-height: 40px;
            height: 40px;

            // &:hover {
            //   background-color: #515a6e;
            //   color: #f7f7f7;
            // }

            span {
              display: inline-block;
              margin-left: 10px;
              width: 33%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .operation {
              float: right;

              .IconFont {
                margin-right: 30px;
                font-size: 20px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }

    .material-right {
      padding: 10px;
      width: 74%;
      height: 100%;
      background-color: #fff;
      float: right;
      overflow-y: auto;
      border: 1px solid #ccc;
      .imgTitle {
        line-height: 40px;
      }

      .seachBox {
        overflow: hidden;
        margin-bottom: 20px;
        height: 40px;

        .seach {
          width: 300px;
          float: left;
        }

        .addImg {
          float: right;
        }
      }
    }
  }
}
</style>
