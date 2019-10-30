<template>
	<div class="Consume">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-moban"></i>模板</el-breadcrumb-item>
                <el-breadcrumb-item>订单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-select v-model="select_tid" placeholder="类型" class="handle_select" @change="search">
                <el-option value="1" label="语言"   key="1"></el-option>
                <el-option value="2" label="模板"   key="2"></el-option>
				<el-option value="3" label="小程序" key="3"></el-option>
				<el-option value="4" label="优化"   key="4"></el-option>
            </el-select>
			<el-select v-model="select_status" placeholder="状态" class="handle_select" @change="search">
                <el-option value="1" label="处理中" key="1"></el-option>
                <el-option value="2" label="已完成" key="2"></el-option>
            </el-select>
            <el-input v-model="select_order" placeholder="订单号" clearable class="handle-input" @keydown.enter.native="search"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> 
            <el-button @click="resetSearch" >重置</el-button>
        </div>
       	<el-table :data="dataList" style="width: 100%">
       		<el-table-column prop="id" label="ID" sortable width="120"></el-table-column>
       		<el-table-column prop="order_no" label="订单编号"></el-table-column>
       		<el-table-column prop="tid" label="类型" :formatter="formatBalance"></el-table-column>
       		<el-table-column prop="amount" label="消耗币"></el-table-column>
			<el-table-column prop="created" label="创建日期">
				<template slot-scope="scope">
				<div>{{scope.row.created}}</div>
				</template>
			</el-table-column>
       		<el-table-column prop="comments" label="备注"></el-table-column>
       		<el-table-column prop="status" label="状态">
				   <template slot-scope="scope">
					   	<div slot="reference" class="name-wrapper">
							<el-tag v-if="scope.row.status == 1" size="medium">处理中</el-tag>
							<el-tag v-else size="medium" type="success">已完成</el-tag>
						</div>
				   </template>
			</el-table-column>
       	</el-table>
       	<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[ 10, 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
	</div>
</template>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  </style>
<script>
	import API from '../../api/api.js'
	import  util  from '../../api/util.js';
	export default {
		name: 'Consumes',
		data() {
			return {
				dataList:[],
				select_status:'',
				total:10,
				currentPage:1,
				size:10,
				select_tid:'',
				select_status:'',
				select_order:'',
			}
		},
		methods: {
			formatType(row,column,cellValue){
				return row.type == '1' ? '交易' : cellValue == '2' ? '充值' : '提现';
			},
			formatBalance(row,column,cellValue){
				return row.tid == '1' ? '语言' : row.tid == '2' ? '模板' : row.tid == '3'?'小程序': '优化'
			},
			getComsumeList(param){
				API.ConsumeList(param).then(rs => {
					this.dataList = rs.rows;
					this.total = Number(rs.total);
					// console.log(rs.rows);
					rs.rows.map((item , index) => { 
                        item.created = util.format(item.created,'yyyy-MM-dd hh:mm');
                    })
				}).catch(() =>{console.log('get ConsumeList is error!')});
			},
			search(){
				this.currentPage=1;this.size=10;
				const params = {order_no:this.select_order,status:this.select_status,tid:this.select_tid,page:this.currentPage, rows:this.size};
				this.getComsumeList(params);
			},
			resetSearch(){
				this.select_order = '';  this.select_status = ''; this.select_tid = '';
				this.currentPage=1;this.size=10;
				// this.getComsumeList({});
				this.getComsumeList({page:this.currentPage, rows:this.size});
			},
			handleSizeChange(val){
				this.size = val;
				this.getComsumeList({page:this.currentPage, rows:this.size,tid:this.select_tid});
			},
			handleCurrentChange(val){
				this.currentPage = val;
				this.getComsumeList({page:this.currentPage, rows:this.size,tid:this.select_tid});
			},
		},
		mounted:function(){
			this.getComsumeList({page:this.currentPage, rows:this.size});
		}

	}
</script>
<style scoped>
.el-form {width:100%; overflow: hidden;padding-top:30px;}
.el-form-item {width:40%; }
.el-form-item:nth-child(6){width:80%;}

.demo-table-expand {
   font-size: 0;
   padding: 0;
}
.demo-table-expand label {
width: 90px;
color: #99a9bf;
}
.demo-table-expand .el-form-item {
margin-right: 0;
margin-bottom: 0;
width: 30%;
}
.handle-box{
    margin-bottom: 20px;
	}
	.handle_select{
	    width: 120px;
	}
	.handle-input{
	    width: 250px;
	    display: inline-block;
	}

</style>