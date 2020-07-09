<template>
    <div class="nav">
        <Icon type="ios-apps" @click="toggleLeft" />
        <span>杨雁路物联网管控平台后台</span>
		<div class="leftBottom">
            <Icon type="ios-contact" />{{userName}} <a href="javascript:void(0)" @click="signout()">登出</a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'App',
    data(){
        return{
            userName:sessionStorage.userName
        }
    },
    methods:{
        toggleLeft(){
            this.$store.commit('toggleNav')
            console.log(this.$store.state.toggle)
        },
        signout(){
            var self = this
            this.$api.post2('user/logout').then(function(res){
                sessionStorage.clear()
                self.$router.push({name:"login"})
                location.reload()
            })
        }
    }
}
</script>
