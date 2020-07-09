const axios = require('axios')
import Vue from 'vue'
import qs from 'qs'
import iView from 'iview'
import { baseUrl } from './env'
axios.default.timeout = 5000
axios.default.baseUrl = baseUrl
// axios.default.baseUrl = 'http://118.190.55.119:9101'
// axios.default.baseUrl = 'http://192.168.7.70:9101'
// axios.default.baseUrl = '/api'
//axios.defaults.withCredentials = true
//axios.default.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

//请求拦截
// axios.interceptors.request.use(
//     config => {
//         const token = store.state.token;
//         token && (config.headers.Authorization = token);
//         return config;
//     },
//     error => {
//         return Promise.error(error);
//     }
// )

//响应拦截
axios.interceptors.response.use(
    response => {
        if (response.data.code != 1) {
            iView.Message.destroy()
            iView.Message.error(response.data.message);
        }
        if (response.data.code == 7) {
            sessionStorage.removeItem('token')
            window.location = '/'
        }
        // 没有权限
        if (response.data.code == 403) {
            iView.Message.error(response.data.message);
            return Promise.reject(response);
        }
        if (response.status === 200) {
            if ((response.data.code && response.data.code == 502) || (response.code && response.code == 502)) {
                iView.Message.error('登录信息已过期，请重新登录！');
                sessionStorage.clear()
                setTimeout(() => {
                    location.reload()
                }, 3000)
                return
            }
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        if (error) {
            // switch (error.response.status) {
            //     case 401:
            //     //
            //     break;
            //     default:
            //     //
            // }
            console.log(error.response);
            if (error.response.data.code === 501) {
                Vue.prototype.$Message.error('登录信息已过期，请重新登录！');
                sessionStorage.clear()
                setTimeout(() => {
                    location.reload()
                }, 2000)
                return
            } else if (error.response.data.code === 500) {
                Vue.prototype.$Message.error(error.response.data.message);
                return Promise.reject(error);
            } else if (error.response.data == '坏的凭证') {
                Vue.prototype.$Message.error('账号密码错误！请重试');
                return Promise.reject(error);
            }
            Vue.prototype.$Message.error('服务器错误，请重试！')
            return Promise.reject(error);
        } else {
            console.log(error);
        }
    }
);

// 自定义判断元素类型JS
function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
    for (var key in o) {
        if (o[key] === null) {
            delete o[key]
        }
        if (toType(o[key]) === 'string') {
            o[key] = o[key].trim()
        } else if (toType(o[key]) === 'object') {
            o[key] = filterNull(o[key])
        } else if (toType(o[key]) === 'array') {
            o[key] = filterNull(o[key])
        }
    }
    return o
}

function apiAxios(method, url, params, isFilterNull = true) {
    return new Promise((resolve, reject) => {
        if (params && isFilterNull) {
            params = filterNull(params)
        }
        axios({
            method: method,
            url: url,
            data: method === 'POST' || method === 'PUT' ? params : null,
            params: method === 'GET' || method === 'DELETE' ? params : null,
            baseURL: axios.default.baseUrl,
            withCredentials: true
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

// 返回在vue模板中的调用接口
export default {
    get: function (url, params) {
        return apiAxios('GET', url, params)
    },
    post: function (url, params) {
        return apiAxios('POST', url, params)
    },
    post2: function (url, params) {
        return apiAxios('POST', url, qs.stringify(params), false)
    },
    put: function (url, params) {
        return apiAxios('PUT', url, params)
    },
    delete: function (url, params) {
        return apiAxios('DELETE', url, params)
    }
}