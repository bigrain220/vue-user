<template>
	<div class="Single">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon-danye iconfont"></i>单页</el-breadcrumb-item>
                <el-breadcrumb-item>单页列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
        	<el-button type="success" @click="addSingle" class="handle_add">新增单页</el-button>
            <el-select v-model="select_status" placeholder="状态" class="handle_select" @change="search">
                <el-option value="1" label="正常" key="1"></el-option>
                <el-option value="0" label="禁用" key="0"></el-option>
            </el-select>
            <el-input v-model="select_name" placeholder="搜索单页标题" clearable class="handle-input" @keydown.enter.native="search"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> 
            <el-button @click="resetSearch" >重置</el-button>
        </div>
        <el-table stripe :data="dataList" style="width: 100%">
        	<el-table-column prop="id" label="ID" sortable width="120"></el-table-column>
        	<el-table-column prop="name" label="标题" ></el-table-column>
        	<el-table-column prop="tpl_name" label="模板名" ></el-table-column>
        	<el-table-column prop="created" label="创建"  :formatter="formatCreate"></el-table-column>
        	<el-table-column prop="level" label="排序"></el-table-column>
        	 <el-table-column prop="status" label="状态">
				<template slot-scope="scope"><el-switch v-model="dataList[scope.$index].status"  @change="changeStatus(scope.row)"  active-value="1" inactive-value="0"></el-switch></template>
			</el-table-column>
        	<el-table-column label="操作"  width="120" fixed="right">
              	<template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" circle @click="editClick(scope.row)"></el-button>
                  <el-button v-if="scope.row.id < 5" type="danger" icon="el-icon-delete" circle disabled  @click="deleteClick(scope.row)"></el-button>
                  <el-button v-else type="danger" icon="el-icon-delete" circle  @click="deleteClick(scope.row)"></el-button>
				</template>
          </el-table-column>
        </el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[ 10,20, 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
	</div>
</template>
<script>
	// import { SingleDel , SingleList , SinglecatsList} from '../../../api/api';
	import API from '../../../api/api';
	import  util  from '../../../api/util.js';
	export default {
		name: 'Single',
		data() {
			return {
				select_status:'',
				select_name:'',
				total:10,
				currentPage:1,
				size:10,
				dataList:[],
			}
		},
		methods: {
			changeStatus(row){
				let params = {id:row.id , status: row.status}
				 API.SingleEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});
			},
			formatCreate(row,column,cellValue){
				return util.format(cellValue,'yyyy-MM-dd hh:mm');
			},
			formatStatus(row,column,cellValue){
				return cellValue == '1' ? '正常' : '禁用' ;
			},
			getSingleList(param){
				param.page = this.currentPage;
				param.rows = this.size;
				API.SingleList(param).then(rs => {
					console.log(param)
					this.dataList = rs.rows;
					this.total = Number(rs.total);
				}).catch(() => {console.log('get SingleList is error!')})
			},
			search(){
				// const params = {name:this.select_name,status:this.select_status};
				var params={};
				if(this.select_name){
					params.name = this.select_name
				}
				if(this.select_status){
					params.status = this.select_status
				}
				this.getSingleList(params);
			},
			resetSearch(){
				this.select_name = '' ;
				this.select_status = '' ;
				this.search();
			},
			handleSizeChange(val){
				this.size = val;
				this.getConsumeList({});
			},
			handleCurrentChange(val){
				this.currentPage = val;
				this.getConsumeList({});
			},
			editClick(row){
				this.$router.push({path: '/user/Single/editSingle/'+row.id});
			},
			deleteClick(row){
				this.$confirm('将永久删除id为'+row.id+'的此条单页, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	API.SingleDel({id:row.id}).then(rs => {
		        		if(rs.code == 1){
		        			this.$message.success('删除成功！');
		        			this.getSingleList({});
		        		}else{
		        			this.$message.error(rs.msg)
		        		}
		        	})
		        }).catch(() => {});
			},
			addSingle(){
				this.$router.push({path: '/user/Single/addSingle'});
			},
		},
		mounted:function(){
			this.getSingleList({});
		}

	}
</script>
<style scoped>
	
	.el-pagination {text-align: center; margin:20px 0;}
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	}
	.avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	}
	.avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
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
	.handle_add {margin-right: 20px;}
</style>