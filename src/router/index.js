import Vue from 'vue'
import store from '../store'
import Router from 'vue-router'

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: 'backstage',
    routes: [{
        path: '/login',
        name: 'login',
        component: (resolve) => require(['@/views/login2'], resolve)
    },
    {
        path: '/deploy',
        name: 'deploy',
        component: (resolve) => require(['@/views/deploy'], resolve),
        children: [{
            path: '/demo',
            name: 'demo',
            component: (resolve) => require(['@/components/demo'], resolve)
        },
        {
            path: '/adbook',
            name: 'adbook',
            parent: '基本信息',
            component: (resolve) => require(['@/views/adbook'], resolve)
        },
        {
            path: '/sms',
            name: 'sms',
            parent: '基本信息',
            component: (resolve) => require(['@/views/sms'], resolve)
        },
        {
            path: '/site',
            name: 'site',
            parent: '基本信息',
            component: (resolve) => require(['@/views/site'], resolve)
        },
        {
            path: '/newtype',
            name: 'newtype',
            component: (resolve) => require(['@/views/newtype'], resolve)
        },
        {
            path: '/newdev',
            name: 'newdev',
            component: (resolve) => require(['@/views/newdev'], resolve)
        },
        {
            path: '/devsetting',
            name: 'devsetting',
            parent: '设备管理',
            component: (resolve) => require(['@/views/devsetting'], resolve)
        },
        {
            path: '/groupsetting',
            name: 'groupsetting',
            parent: '设备管理',
            component: (resolve) => require(['@/views/groupsetting'], resolve)
        },

        {
            path: '/material',
            name: 'material',
            parent: '媒体管理',
            component: (resolve) => require(['@/views/material'], resolve)
        },
        {
            path: '/release',
            name: 'release',
            component: (resolve) => require(['@/views/release'], resolve)
        },
        {
            path: '/releaseNew',
            name: 'releaseNew',
            parent: '媒体管理',
            component: (resolve) => require(['@/views/releaseNew'], resolve)
        },
        {
            path: '/deviceGroup',
            name: 'deviceGroup',
            parent: '媒体管理',
            component: (resolve) => require(['@/views/deviceGroup'], resolve)
        },
        {
            path: '/ploy',
            name: 'ploy',
            parent: '策略管理',
            component: (resolve) => require(['@/views/ploy'], resolve)
        },
        {
            path: '/account',
            name: 'account',
            parent: '系统管理',
            component: (resolve) => require(['@/views/account'], resolve)
        },
        {
            path: '/log',
            name: 'log',
            component: (resolve) => require(['@/views/log'], resolve)
        },
        {
            path: '/tenon',
            name: 'tenon',
            component: (resolve) => require(['@/views/tenon'], resolve)
        },
        {
            path: '/light_rc',
            name: 'light_rc',
            component: (resolve) => require(['@/views/CL_con/light_rc.vue'], resolve) //照明  定时日出
        },
        {
            path: '/light_dg',
            name: 'light_dg',
            component: (resolve) => require(['@/views/CL_con/light_dg.vue'], resolve) //照明  单灯调光
        },
        {
            path: '/LED_zx',
            name: 'LED_zx',
            component: (resolve) => require(['@/views/CL_con/LED_zx.vue'], resolve) //LED  定时执行
        },
        {
            path: '/LCD_zx',
            name: 'LCD_zx',
            component: (resolve) => require(['@/views/CL_con/LCD_zx.vue'], resolve) //LCD 定时执行
        },
        {
            path: '/borad_zx',
            name: 'borad_zx',
            component: (resolve) => require(['@/views/CL_con/borad_zx.vue'], resolve) //广播定时执行
        },
        {
            path: '/zmgl',
            name: 'zmgl',
            parent: '照明管理',
            component: (resolve) => require(['@/views/zmgl'], resolve)
        },
        {
            path: '/led',
            name: 'led',
            component: (resolve) => require(['@/views/led.vue'], resolve) //led
        },
        {
            path: '/lcd',
            name: 'lcd',
            component: (resolve) => require(['@/views/lcd.vue'], resolve) //lcd
        }]
    },
    {
        path: "*",
        name: "error",
        component: (resolve) => require(['@/views/error'], resolve)
    }
    ]
});



router.beforeEach((to, form, next) => {
    console.log(to, form)
    for (let index = 0; index < router.options.routes[1].children.length; index++) {
        if (to.name == router.options.routes[1].children[index].name) {
            Vue.prototype.$ParentRouter = router.options.routes[1].children[index].parent
        }

    }
    if (to.path != '/login') {
        if (sessionStorage.loginYYLBC != undefined && sessionStorage.loginYYLBC == 'true') {
            next()
        } else {
            next('/login')
        }
    } else if (sessionStorage.loginYYLBC != undefined && sessionStorage.loginYYLBC == 'true') {
        next('/deploy')
    } else {
        next()
    }
})

export default router