<template>
    <div class="login">
        <Card>
            <form @submit.prevent="register()" class="clearfix">
                <Divider orientation="left"><img src="../assets/img/logo.png" /></Divider>
                <!-- <Input v-model="id" size="large" placeholder="User Name" clearable />
                <Input v-model="pd" size="large" type="password" placeholder="Password" clearable /> -->

                <div class="ivu-input-wrapper ivu-input-wrapper-large ivu-input-type">
                    <input v-model="id" autocomplete="off" spellcheck="false" placeholder="User Name" type="text" class="ivu-input ivu-input-large" required>
                </div>

                <div class="ivu-input-wrapper ivu-input-wrapper-large ivu-input-type">
                    <input v-model="pd" autocomplete="off" spellcheck="false" placeholder="Password" type="password" class="ivu-input ivu-input-large" required>
                </div>
                <p style="color:red;" v-if="code4">用户名密码错误！</p>
                <button type="submit" class="ivu-btn ivu-btn-primary ivu-btn-long ivu-btn-large"><span>Login</span></button>
                <!-- <Input v-model="captchaInp" size="large" placeholder="Captcha" clearable style="width:186px;" />
                <img :src="captcha" alt="captcha" @click="captcha = captcha + Math.floor(Math.random()*10 + 1)"> -->
                <!-- <Button type="primary" long size="large" @click="register()">Login</Button> -->
            </form>
        </Card>
    </div>
</template>
<script>


export default {
    name: 'App',
    data(){
        return{
            loading:false,
            code4:false,
            id: 'zgk5',
            pd: '123456',
            // captcha:'http://localhost:3000/captcha?',
            // captchaInp:''
        }
    },
    created:function() {
        if(this.$route.params.reload){
            location.reload()
        }
        var lett = this;
        document.onkeydown = function(e) {
            var key = window.event.keyCode;
            if (key == 13) {
                lett.register();
            }
        }
    },
    mounted(){
    },
    components:{
    },
    methods:{
        register(){
            this.$api.post2('/user/login',{username:this.id,password:this.pd},{emulateJSON:true,withCredentials:true}).then((res) => {
                if(res.code == 1){
                    // window.sessionStorage.setItem('token','Eels')
                    this.$router.push({path:'/material'})
                }
            })
            // let socket = io('http://localhost:80');
            // // socket.emmit()用户客户端向服务端发送消息，服务端与之对应的是socket.on()来接收信息。
            // socket.emmit('client message', {msg:'hi, server'});
            // // socket.on()用于接收服务端发来的消息
            // socket.on('connect',  ()=>{
            //     console.log('client connect server');
            // });
            // socket.on('disconnect', ()=>{
            //     console.log('client disconnect');
            // });
            // sessionStorage.setItem('token','eels')
            // this.$router.push({name:'common',params:{reload:1}})
        }
    }
    }
</script>
