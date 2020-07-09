<template>
    <div class="tenon">
        <span class="close" @click="close">X</span>

        <iframe src="http://119.23.23.14/login" frameborder=0></iframe>
    </div>
</template>
<script>
    export default {
        created(){
            
        },
        methods:{
            close(){
                this.$router.push({ name: "material" });
                this.$parent.getSubPath()
            }
        }
    }
</script>
<style scoped>
    .tenon{width:100vw;height:100vh;position: fixed;left:0;top: 0;z-index: 99999;background: #fff;}
    iframe{width:100vw;height:100vh;position: fixed;left:0;top: 0;}
    .close{position: absolute;right: .5vw;top: .5vh;background: red;color: #fff;z-index: 99999;border-radius: 10px;width: 20px;height: 20px;text-align: center;line-height: 20px;font-weight: bold;cursor: pointer;}
</style>