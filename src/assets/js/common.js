import validate from './validate'
import iView from 'iview'
import { baseUrl } from '../../config/env'
let Common = {
    // uploadUrl:'/api/material/uploadMaterial',//测试环境
    uploadUrl: baseUrl + '/material/uploadMaterial',
    // uploadUrl:'http://192.168.10.144:9100/material/uploadMaterial',
    waring(callback,aText){
        var aText = aText || '请确认是否删除？'
        iView.Modal.confirm({
            title: '警告',
            content: `<p style="padding: 20px 0 10px 100px">${aText}</p>`,
            onOk: () => {
                callback();
            }
        });
    },
    trim(val) {//去除首尾空格
        var re = /(^\s*)|(\s*$)/g;
        if (validate.isObj) {
            for (var item in val) {
                val[item] = val[item].replace(re, '')
            }
            return val;
        }
        return val.replace(re, "");
    },
    formatDate(date, isShowHours) {//格式化日期 xxxx-xx-xx;
        if (date === "" || !date) {
            return null;
        } else {
            let today = new Date(date);
            let year = today.getFullYear();
            let month = ('0' + (today.getMonth() + 1)).slice(-2);
            let day = ('0' + today.getDate()).slice(-2);
            let hours = ('0' + today.getHours()).slice(-2);
            let minutes = ('0' + today.getMinutes()).slice(-2);
            let second = ('0' + today.getSeconds()).slice(-2);
            if (isShowHours === true) {
                return `${year}-${month}-${day} ${hours}:${minutes}:${second}`;
            }
            return `${year}-${month}-${day}`;
        }
    },
    // 获取当前时间
    getCurrentDate(time) {
        let date = time ? new Date(time) : new Date();
        let Y = date.getFullYear() + "-";
        let M =
            (date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1) + "-";
        let D = ('0' + date.getDate()).slice(-2) + " ";
        let h = ('0' + date.getHours()).slice(-2) + ":";
        let m = ('0' + date.getMinutes()).slice(-2) + ":";
        let s = ('0' + date.getSeconds()).slice(-2);
        return Y + M + D + h + m + s;
    },
    /**
     * 获取当前月的第一天
     */
    getCurrentMonthFirst() {
        var date = new Date();
        date.setDate(1);
        return this.formatDate(date);
    },
    /**
     * 获取当前月的最后一天
     */
    getCurrentMonthLast() {
        var date = new Date();
        var currentMonth = date.getMonth();
        var nextMonth = ++currentMonth;
        var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
        var oneDay = 1000 * 60 * 60 * 24;
        return this.formatDate(new Date(nextMonthFirstDay - oneDay));
    },
    typeOfName(name) {
        if(!name){
            return false;
        } 
        var format = (name + "").split(".").reverse()[0];
        let type = "img";
        if (["mp4", "m3u8", "rmvb", "avi", "swf", "3gp", "mkv", "flv"].indexOf(format) > -1) {
            type = "video";
        }
        return type;
    },
};
export default Common;
