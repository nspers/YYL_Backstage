<template>
  <div class="deploy clearfix">
    <div class="leftNav" :class="{ 'active': count }">
      <img src="../assets/img/logo.png" height="64" width="190" />
      <Menu
        :theme="theme1"
        @on-select="change_sub_router"
        @on-open-change="test"
        :active-name="subPath"
        :open-names="tabName"
        accordion
        ref="nav"
      >
        <Submenu name="1">
          <template slot="title">
            <Icon type="md-globe" />基本信息
          </template>
          <MenuItem name="adbook">通讯录管理</MenuItem>
          <MenuItem name="sms">短信配置</MenuItem>
          <MenuItem name="site">灯杆管理</MenuItem>
        </Submenu>
        <Submenu name="2">
          <template slot="title">
            <Icon type="ios-print-outline" />设备管理
          </template>
          <!-- <MenuItem name="newtype">新增类型</MenuItem> -->
          <!-- <MenuItem name="newdev">新增设备</MenuItem> -->
          <MenuItem name="devsetting">设备配置</MenuItem>
          <MenuItem name="groupsetting">分组管理</MenuItem>
        </Submenu>
        <Submenu name="3">
          <template slot="title">
            <Icon type="ios-copy-outline" />媒体管理
          </template>
          <MenuItem name="material">素材管理</MenuItem>
          <!-- <MenuItem name="release">节目发布</MenuItem> -->
          <MenuItem name="releaseNew">节目发布</MenuItem>
          <MenuItem name="deviceGroup">设备分组</MenuItem>
          <MenuItem name="led">LED</MenuItem>
          <!-- <MenuItem name="tenon">太龙</MenuItem> -->
        </Submenu>
        <!-- <Submenu name="4">
          <template slot="title">
            <Icon type="ios-contacts" />策略管理
          </template>
          <Submenu name="5" >
            <template slot="title" to="light_rc">照明策略</template>
            <MenuItem name="5-1" to="light_rc">定时日出</MenuItem>
            <MenuItem name="5-2" to="light_rl">日出日落</MenuItem>
            <MenuItem name="5-3"  to="ploy">单灯控制</MenuItem>
            <MenuItem name="5-4"  to="ploy">单灯调光</MenuItem>
          </Submenu>
           <Submenu name="6">
            <template slot="title">LED屏策略</template>
            <MenuItem name="6-1" to="ploy">定时执行</MenuItem>
          </Submenu>
           <Submenu name="7">
            <template slot="title">LCD屏策略</template>
            <MenuItem name="7-1" to="ploy">定时执行</MenuItem>
          </Submenu>
           <Submenu name="8">
            <template slot="title">广播策略</template>
            <MenuItem name="8-1" to="ploy">定时执行</MenuItem>
          </Submenu>
        </Submenu>-->
        <Submenu name="4">
          <template slot="title">
            <Icon type="md-cloud-upload" />策略管理
          </template>
          <!-- <MenuItem name="light_rc">照明策略</MenuItem>
          <MenuItem name="led">LED屏策略</MenuItem>-->
          <MenuItem name="ploy">策略配置</MenuItem>
        </Submenu>
        <MenuItem name="zmgl" class="ivu-menu">
          <Icon type="ios-sunny" />照明管理
        </MenuItem>
        <Submenu name="5">
          <template slot="title">
            <Icon type="ios-switch" />系统管理
          </template>
          <MenuItem name="account">账号管理</MenuItem>
        </Submenu>
        <!-- <Submenu name="6">
          <template slot="title">
            <Icon type="md-cloud-upload" />系统管理
          </template>
          <MenuItem name="log">系统日志</MenuItem>
        </Submenu>-->
      </Menu>
    </div>
    <div class="right">
      <Nav></Nav>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
      <div
        class="copyright"
      >Copyright © 2019 SHUZHI · Powered by Eels. All Rights Reserved. Current version is 1.0.</div>
    </div>
  </div>
</template>
<script>
import Nav from '../components/header.vue'

export default {
  name: 'App',
  components: {
    Nav
  },
  data() {
    return {
      theme1: 'dark',
      subPath: '',
      tabName: [],
      routerArry: {
        1: ['adbook', 'sms', 'site'],
        2: ['devsetting', 'groupsetting'],
        3: ['material', 'release'],
        4: ['ploy', 'led', 'lcd'],
        5: ['account'],
        6: ['log']
      }
    }
  },
  sockets: {
    connect() {
      console.log('socket connected')
    }
  },
  computed: {
    count() {
      return this.$store.state.toggle
    }
  },
  created() {
    this.subPath = this.$router.history.current.name
    for (var key in this.routerArry) {
      for (var i = 0; i < this.routerArry[key].length; i++) {
        if (this.routerArry[key][i] == this.subPath) {
          this.tabName[0] = key
        }
      }
    }
  },
  mounted() {},
  methods: {
    getSubPath() {
      this.$nextTick(() => {
        //   this.$refs.nav.updateActiveName()
        $('.ivu-menu-child-item-active li').removeClass(
          'ivu-menu-item-active ivu-menu-item-selected'
        )
        $('.ivu-menu-child-item-active li')
          .eq(0)
          .addClass('ivu-menu-item-active ivu-menu-item-selected')
      })
    },
    change_sub_router(e) {
      console.log(e)
      // $('.ivu-menu-child-item-active li').eq(0).removeClass('ivu-menu-item-active ivu-menu-item-selected')
      this.$router.push({ name: e })
    },
    test(e) {
      this.tabName = e
      //this.$socket.emit('test', 123);
    }
  }
}
</script>
