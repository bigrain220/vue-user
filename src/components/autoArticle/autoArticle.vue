<template>
    <div class="article">
        <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick" v-if="showContent1">
            <el-tab-pane label="词库" name="first">
                <autoKeywords ref="keywords"></autoKeywords>
            </el-tab-pane>
            <el-tab-pane label="文章" name="second">
                <autoPublished ref="published"></autoPublished>
            </el-tab-pane>
            <el-tab-pane label="发布" name="third">
                <autoSetting ref="setting"></autoSetting>
            </el-tab-pane>
        </el-tabs>
        <div v-if="showContent2">
            <el-card class="box-card">
                    <div slot="header">
                        <span>你尚未开通自动优化功能，请先开通 (1000币/年)</span>
                    </div>
                    <div>
                          开通续费： <el-input-number v-model="year" :min="1" :max="10" label="描述文字"></el-input-number><span style="margin-left:20px;">年</span>
                    </div>
                    <div class="buy-btn">
                        <el-button type="primary" @click="buyClick">点击开通</el-button>
                    </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import autoKeywords from './autoKeywords.vue'
    import autoPublished from './autoPublished.vue'
    import autoSetting from './autoSetting.vue'
    import API from "../../api/api.js";
    export default {
        components:{autoKeywords,autoPublished,autoSetting},
        data() {
            return {
              activeName:'first',
              showContent1:false,
              showContent2:false,
              year:"",
            }
        },
        methods: {
            handleClick(){
                switch (this.activeName) {
                    case 'first' :  this.$refs.keywords.init({}); break ;
                    case 'second' :  this.$refs.published.init({}); break ;
                    case 'third' :  this.$refs.setting.init({}); break ;
                    default: break;
                }
            },
            isBought(){
               API.seoGet().then(rs=>{
                   if(rs!==null){
                        this.showContent1=true;
                        this.showContent2=false;
                   }else{
                        this.showContent1=false;
                        this.showContent2=true;
                   }
               })
            },
            buyClick(){
                this.$confirm('将消耗 '+ Number(this.year)*1000+' 币购买 '+ this.year+' 年,确认购买', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type:"warning",
                            callback: action => {
                                if(action==="confirm"){
                                   const _loading = this.$loading({
                                        lock: true,
                                        text: '正在购买,请稍等...',
                                        spinner: 'el-icon-loading',
                                        background: 'rgba(0, 0, 0, 0.7)'
                                    });
                                    API.seoBuy({year:this.year}).then(rs=>{
                                        // console.log(rs,"seobuy")
                                        _loading.close();
                                        if(rs.msg=="ILLEGAL_COIN_NOT_ENOUGH"){
                                           this.$confirm('购买失败，您的币种余额不足', '提示', {confirmButtonText: '充值钻石',cancelButtonText: '取消',type: 'warning'
                                            }).then(() => {
                                                window.open('//www.g3wei.com/user/pay/index');
                                            }).catch(error => {});
                                        }else if(rs.code==1){
                                            this.$message.success('购买成功！');
                                            this.showContent1=true;
                                            this.showContent2=false;
                                        }else{
                                            this.$alert('购买失败，请重试', '购买失败', {
                                                confirmButtonText: '确定',
                                                type: 'error',
                                                callback: action => {
                                                //    this.init({});
                                                }
                                            });
                                        }
                                    }).catch(err => console.log(err))
                                }
                            }
                });
               
            },
        
        },
        created(){
            this.isBought();
        }
    }
</script>

<style scoped>
    .el-tabs__active-bar {display:none;}
    .buy-btn{margin-top: 30px;}
</style>
<style>
.tabs .el-tabs__item {padding:0 5px; margin:0 10px;}
.tabs .el-tabs__item::after {content:''; background:url('../../assets/img/arrow-right.png') no-repeat center;    position: absolute;right: -27px;top: 0;width: 100%;height: 100%;}
.tabs .el-tabs__item:last-child::after {display:none;}
.tabs .el-tabs__active-bar {display:none;}
.tabs .el-tabs__item:nth-child(1) {margin-left:0;}
.tabs .el-tabs__header {margin:0 0 25px;}
.tabs .el-table {margin-top:10px;}
.tabs .handle_add {margin:0;}
.el-tabs__item.is-active {font-size:18px; font-weight:bold;}
</style>
<style>
    .tabs .el-table td {padding:5px 0 !important;}
    .el-loading-mask .el-loading-spinner i{color: #fff;font-size: 32px;}
    .el-loading-mask .el-loading-spinner .el-loading-text{color: #fff;margin-top: 10px;}
</style>
