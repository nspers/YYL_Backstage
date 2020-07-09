var gettype = Object.prototype.toString;
let Validate= {
    isObj: function (o) {
        return gettype.call(o) == "[object Object]";
    },

    isArray: function (o) {
        return gettype.call(o) == "[object Array]";
    },

    isNULL: function (o) {
        return gettype.call(o) == "[object Null]";
    },

    isUndefined: function (o) {
        return gettype.call(o) == "[object Undefined]";
    },

    isBoolean: function (o) {
        return gettype.call(o) == "[object Boolean]";
    },

    isString: function (o) {
        return gettype.call(o) == "[object String]";
    },
    isEmpty: (value) => {
        let str = value+'';
        if (str=='' || str=='undefined' || str=='null') return true;
        return false;
    },
    isSpace: (value) => {
        var re = /(^\s)|(\s$)/g;
        if (re.test(value)) return true;
        return false;
    },
    //非空验证
    notEmpty: (rule, value, callback) => {
        if (Validate.isEmpty(value)) {
            callback(new Error('不能为空'));
        } else if (Validate.isSpace(value)) {
            callback(new Error('不能输入空格'));
        }  else {
            callback();
        }
    },
    //数字
    number: (rule, value, callback) => {
        if (Validate.isEmpty(value)) {
            callback(new Error('不能为空'));
        } else if (Validate.isSpace(value)) {
            callback(new Error('不能输入空格'));
        } else if (isNaN(value - 0)) {
            callback(new Error('必须是数字'));
        } else {
            callback();
        }
    },
    //比例
    percentage: (rule, value, callback) => {
        if (Validate.isEmpty(value)) {
            callback(new Error('不能为空'));
        } else if (Validate.isSpace(value)) {
            callback(new Error('不能输入空格'));
        } else if (isNaN(value - 0)) {
            callback(new Error('必须是数字'));
        } else if (value < 0 || value > 100) {
            callback(new Error('请输入正常比例'));
        } else {
            callback();
        }
    },
    // 手机号
    phone:(rule,value,callback) => {
        if(/^1[34578]\d{9}$/.test(value)){
            callback();
        }else{
            callback(new Error('请输入正确的手机号'));
        }
    },
    //汉字
    chinaWord:(rule,value,callback) => {
        if(/^[\u4e00-\u9fa5]+$/.test(value)){
            callback();
        }else{
            callback(new Error('请输入汉字'));
        }
    },
    //汉字、字母
    chinaAndEnglish:(rule,value,callback) => {
        if(/^([A-Za-z]|[\u4e00-\u9fa5])+$/.test(value)){
            callback();
        }else{
            callback(new Error('请输入汉字、字母'));
        }
    },
    //code编码 ^[A-Za-z0-9]+$  数字字母
    numberAndWord:(rule,value,callback) => {
        if(/^[A-Za-z0-9]+$/.test(value)){
            callback();
        }else{
            callback(new Error('请输入数字、字母'));
        }
    },
    //email ^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$
    email:(rule,value,callback) => {
        if(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)){
            callback();
        }else{
            callback(new Error('请输入正确的邮箱'));
        }
    },

};
export default Validate;
