"use strict";

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import VueI18n from 'vue-i18n'
import iView from 'iview'
import router from './router'
// import Element from 'element-ui'
// import VueSocketio from 'vue-socket.io'
import VueForm from 'vue-form'
import store from './store'
import api from './config'

//import * as socketApi from './config/ws'
//Vue.prototype.socketApi = socketApi

import 'iview/dist/styles/iview.css'
import './assets/css/reset.css'
import './assets/css/components.scss'

import common from './assets/js/common.js';
import Validate from './assets/js/validate.js';

Vue.prototype.$Common = common;
Vue.prototype.$Validate = Validate;
Vue.prototype.$api = api
Vue.config.productionTip = false
Vue.config.devtools = true


// Vue.use(new VueSocketio({
//     debug: true,
//     connection: 'http://192.168.8.63:9000/webSocket' //地址+端口，由后端提供
// }));

// Vue.use(VueSocketio, 'http://192.168.8.63:9000/webSocket');

Vue.use(api)

// Vue.use(Element)
// Vue.use(VueI18n)
Vue.use(iView)
Vue.use(VueForm)

// const i18n = new VueI18n({
//     //locale: navigator.language,
//     locale:'en-US',
//     messages: {
//         'zh-CN': require('./common/lang/zh'),
//         'en-US': require('./common/lang/en')
//     }
// })


// const app = new Vue({ i18n })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // i18n,
  iView,
  store,
  VueForm,
  // Element,
  components: { App },
  template: '<App/>'
  // sockets: {
  //   connect: function () {
  //     console.log('socket connected');
  //   },
  //   res: function (val) {
  //     console.log('接收到服务端消息', val);
  //   }
  // }
}).$mount('#app')
