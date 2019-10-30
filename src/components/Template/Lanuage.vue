<template>
    <div class="Lanuage" v-loading="TemplateVisible"
    element-loading-text="语言购买中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-moban"></i>模板</el-breadcrumb-item>
                <el-breadcrumb-item>语言列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-table stripe :data="dataList" style="width: 100%" v-loading="loading" >
            <el-table-column  prop="id" label="ID"></el-table-column>
            <el-table-column  prop="name" label="名称"></el-table-column>
            <el-table-column  prop="price" label="价格"></el-table-column>
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <el-button size="mini" type="success" @click="buyClick(scope.row)">购买</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import API from '@/api/api.js'
    export default {
        name:'Lanuage',
        data() {
            return {
               dataList : [],
               loading : true, 
               TemplateVisible : false ,
            }
        },
        methods: {
            formatStatus(row,column,cellValue){
                return cellValue == 1 ? '正常' : '禁用';
            },
            getLanuage(){
                API.languageGet().then(rs => {
                    this.loading = false;
                    rs.map((item , index) => {
                        item.price = '￥1000';
                    })
                    this.dataList = rs;
                }).catch(err => console.log(err))
            },
            buyClick(row){
                this.$confirm('您确定购买 '+row.name+' 语言吗？', '语言订单提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                     this.TemplateVisible = true;
                    API.languageBuy({id : row.id}).then(rs => {
                        this.TemplateVisible = false;
                        if(rs.code == 1){
                            this.$message.success(row.name + '语言购买成功');
                        }else if(rs.msg == 'ILLEGAL_COIN_NOT_ENOUGH'){
                            this.$confirm('您的币种余额不足', '提示', {confirmButtonText: '充值钻石',cancelButtonText: '取消',type: 'warning'
                                }).then(() => {
                                    window.open('//www.g3wei.com/user/pay/index');
                                }).catch(error => {});
                        }else if(rs.msg == 'ILLEGAL_LANGUAGE_EXISTS'){
                            this.$alert('您已购买'+row.name+'语言,可不用重复购买', '提示', {confirmButtonText: '确定'}).then(() => {
                            }).catch(error => {console.log(error)});
                        }else if (rs.msg == 'ILLEGAL_LANGUAGE_NOT_EXIST'){
                            this.$alert(id+'此语言已下架', '提示', {confirmButtonText: '确定'}).then(() => {
                            }).catch(error => {console.log(error)});
                        }else{
                            this.$alert(rs.msg, '提示', {confirmButtonText: '确定'}).then(() => {
                            }).catch(error => {console.log(error)});
                        }
                        }).catch(err => console.log(err));
                }).catch(err => console.log(err))
            },
        },
        mounted: function(){
            this.getLanuage();
        }
    }
</script>

<style scoped>

</style>