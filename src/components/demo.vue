<template>
    <div class="abloomy subMain">
        <ButtonGroup size="large">
            <Button @click="addRole()">
                <Icon type="ios-add-circle-outline" />
                新增设备
            </Button>
        </ButtonGroup>
        <Table :loading="loading" border :columns="columns1" :data="data1">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="info" size="small" style="margin-right: 5px" @click="editRole(index)">编辑</Button>
                <Button type="error" size="small" @click="openDelete(index)">删除</Button>
            </template>
        </Table>
        <Modal title="设备信息" v-model="showData" :loading="modalLoad" class-name="vertical-center-modal" width=620>
            <ul class="showUser">
                <li class="clearfix">
                    <strong>厂商ID：</strong>
                    <div class="editDiv">
                        <Input size="large" type="number" clearable v-model="useData.factory_id" />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>IP地址：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.ip" />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>AP设备mac地址：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.mac" />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>设备名称：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.device_name"  />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>设备方应用设备ID：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.device_id"  />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>平台设备ID：</strong>
                    <div class="editDiv">
                        <Input size="large" clearable v-model="useData.did"  />
                    </div>
                </li>
                <li class="clearfix">
                    <strong>描述：</strong>
                    <div class="editDiv">
                        <Input v-model="useData.describe" type="textarea" :rows="4"/>
                    </div>
                </li>                
            </ul>
        </Modal>
        <Modal v-model="deleteModel" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>是否确认删除此设备?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long  @click="remove()">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    name: 'App',
    data(){
        return{
            showData:false,
            modalLoad:true,
            loading:false,
            edit:false,
            deleteModel:false,
            deleteIndex:0,
            columns1: [
                {
                    title:'主键ID',
                    key:'id'
                },
                {
                    title: '厂商ID',
                    key: 'factory_id'
                },
                {
                    title: 'IP地址',
                    key: 'ip'
                },
                {
                    title: 'AP设备mac地址',
                    key: 'mac'
                },
                {
                    title: '设备名称',
                    key: 'device_name'
                },
                {
                    title: '设备方应用设备ID',
                    key: 'device_id'
                },
                {
                    title: '平台设备ID',
                    key: 'did'
                },
                {
                    title: '描述',
                    key: 'describe'
                },
                {
                    title: '操作',
                    slot: 'action'
                }
            ],
            data1: [],
            useData:{
                factory_id:0,
                ip:'',
                mac:'',
                device_name:'',
                device_id:'',
                did:'',
                describe:''
            }
        }
    },
    created:function() {
        this.updataList()
    },
    mounted:function() {
        this.$nextTick(function(){
            
        })
    },
    methods:{
        updataList(){
            var self = this
            this.loading = true
            this.$api.get('sysDevice/selectAbloomyList/').then(function(res){
                self.data1 = res.data
                self.loading = false
            })
        },
        addRole(){
            // this.socketApi.sendSock('你试着往我这里返回一些数据');  
            this.showData = true
            this.edit = false
            this.useData = {
                factory_id:null,
                ip:'',
                mac:'',
                device_name:'',
                device_id:'',
                did:'',
                describe:''
            }
        },
        openDelete(index){
            this.deleteModel = true
            this.deleteIndex = index
        },
        remove(){
            var self = this
            var index = this.deleteIndex
            this.$api.delete('sysDevice/delectAbloomy/' + this.data1[index].id).then(function(res){
                self.updataList()
                self.deleteModel = false
            })                
        },
        editRole(index){
            this.edit = true
            var self = this
            this.$api.get('sysDevice/selectAbloomyList/' + this.data1[index].id).then(function(res){
                console.log(res);
                self.showData = true
                self.useData = res.data
            })
        },
        submitUser(){
            var self = this
            if(this.edit){
                this.$api.put('sysDevice/updateAbloomy',this.useData).then(function(res){
                    console.log(res);
                    self.edit = false
                    self.showData = false
                    self.updataList()
                })
            }else{
                this.$api.post('sysDevice/saveAbloomy',this.useData).then(function(res){
                    self.showData = false
                    self.updataList()
                })                
            }
            
        }
    }
}
</script>

