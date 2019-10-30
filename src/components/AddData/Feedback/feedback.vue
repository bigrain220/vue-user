<template>
    <div class="feedback">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon-message iconfont"></i>留言</el-breadcrumb-item>
                <el-breadcrumb-item>留言列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-table stripe :data="dataList" style="width: 100%" v-loading="loading" >
            <el-table-column  prop="id" label="ID" width="100px"></el-table-column>
            <!-- <el-table-column  prop="uid" label="UID"></el-table-column> -->
            <el-table-column  prop="nickname" label="联系人" width="220px"></el-table-column>
            <el-table-column  prop="phone" label="联系电话" :formatter="format" width="220px"></el-table-column>
            <el-table-column  prop="email" label="邮箱" :formatter="format" width="220px"></el-table-column>
            <el-table-column  prop="content" label="留言内容" ></el-table-column>
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="lookClick(scope.row)" icon="el-icon-view"></el-button>
                    <el-button size="mini" type="danger" @click="delClick(scope.row)" icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[ 10,20, 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        <el-dialog :visible.sync="Visible"  width="800px" title="查看留言">
            <ul>
                <li><span>id：</span><span>{{message.id}}</span></li>
                <li><span>用户id：</span><span>{{message.uid}}</span></li>
                <li><span>联系人：</span><span>{{message.nickname}}</span></li>
                <li><span>联系电话：</span><span>{{message.phone}}</span></li>
                <li><span>联系邮箱：</span><span>{{message.email}}</span></li>
                <li><span>创建时间：</span><span>{{message.addtime}}</span></li>
                <li><span>留言内容：</span><span>{{message.content}}</span></li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
    import API from '@/api/api.js'
    import util from '@/api/util.js'
    export default {
        name:'Feedback',
        data() {
            return {
                dataList:[],
                currentPage:1,
                size:10,
                total:0,
                loading:true,
                Visible:false,
                message:{id:'',uid:'',nickname:'',email:'',phone:'',content:'',addtime:''}
            }
        },
        methods: {
            format(row,column,cellValue){
				return cellValue == null ? '—' : cellValue;
			},
           getFeedbackList(){
               const param = {};
               param.page = this.currentPage;
               param.rows = this.size;
               API.FeedbackList(param).then(rs => {
                   this.loading = false;
                   this.total = Number(rs.total);
                   this.dataList = rs.rows;

               }).catch(err => console.log(err))
           }, 
           handleSizeChange(val){
               this.size = val;
               this.page = 1;
               this.getFeedbackList();
           },
           handleCurrentChange(val){
               this.currentPage = val;
               this.getFeedbackList();
           },
           delClick(row){
               console.log(row);
               API.FeedbackDel({id:row.id}).then(rs => {
                   if(rs.code == 1){
                       this.getFeedbackList();
                       this.$message.success('删除成功');
                   }
               }).catch(err => console.log(err))
           },
           lookClick(row){
               row.addtime =  util.format(row.addtime,'yyyy-MM-dd hh:mm');
               if(row.email == ""){row.email = '暂无'}
               if(row.phone == ""){row.phone = '暂无'}
               this.message = row;
               this.Visible = true;
           },
        },
        mounted:function(){
            this.getFeedbackList()
        }
    }
</script>

<style scoped>
    ul {margin:0; padding:0; }
    ul li {display: flex; margin-bottom: 30px;}
    ul li span:first-child {display:block; width:100px; text-align: right; margin-right: 20px; color:#99a9bf; }
    ul li span:last-child {display: block; width:100%; flex:1;}
</style>