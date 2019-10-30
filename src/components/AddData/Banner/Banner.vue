<template>
	<div class="Banner">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon-guanggao iconfont"></i>广告</el-breadcrumb-item>
                <el-breadcrumb-item>广告列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
        	<el-button type="success" @click="AddBanner" class="handle_add">新增广告</el-button>
            <el-select v-model="select_status" placeholder="状态" class="handle_select" @change="search">
                <el-option value="1" label="正常" key="1"></el-option>
                <el-option value="0" label="禁用" key="0"></el-option>
            </el-select>
			<el-input v-model="select_group" placeholder="组名" clearable class="handle-input" @keydown.enter.native="search"></el-input>
            <el-input v-model="select_name" placeholder="广告标题" clearable class="handle-input" @keydown.enter.native="search"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> 
            <el-button @click="resetSearch" >重置</el-button>
        </div>
		<el-table stripe :data="dataList" style="width: 100%">
			<el-table-column type="expand">
				<template slot-scope="scope" @toggleRowExpansion="expansion">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item label="ID"><span>{{ scope.row.id }}</span></el-form-item>
						<el-form-item label="标题"><span>{{ scope.row.name }}</span></el-form-item>
						<el-form-item label="组名"><span>{{ scope.row.group }}</span></el-form-item>
						<el-form-item label="链接"><a v-if="scope.row.url" href="scope.row.url" target="_blank">{{ scope.row.url }}</a><span v-else class="noData">暂无</span></el-form-item>
						<el-form-item label="排序"><span v-if="scope.row.level">{{ scope.row.level }}</span><span v-else class="noData">暂无</span></el-form-item>
						<el-form-item label="状态"><span v-if="scope.row.status" v-html="FormatStatus(scope.row.status)"></span><span v-else class="noData">暂无</span></el-form-item>
						<el-form-item label="创建时间"><span v-if="scope.row.created" v-html="FormatTime(scope.row.created)"></span><span v-else class="noData">暂无</span></el-form-item>
						<el-form-item label="修改时间"><span v-if="scope.row.modified" v-html="FormatTime(scope.row.modified)"></span><span v-else class="noData">暂无</span></el-form-item>
						<el-form-item label="封面"><img class="bgimg" v-if="scope.row.image" :src="scope.row.image"><span v-else class="noData">暂无</span></el-form-item>
						<!-- <el-form-item label="描述" width="100%"><span v-if="scope.row.desc">{{scope.row.desc}}</span><span v-else class="noData">暂无</span></el-form-item> -->
					</el-form>
				</template>
			</el-table-column>
			<el-table-column prop="id" label="ID" sortable width="100px"></el-table-column>
			<el-table-column prop="name" label="标题"></el-table-column>
			<el-table-column prop="url" label="链接" :formatter="format"></el-table-column>
			<el-table-column prop="group" label="组名" :formatter="format"></el-table-column>
			<el-table-column prop="level" label="排序" :formatter="format"></el-table-column>
			<el-table-column prop="status" label="状态">
				<template slot-scope="scope"><el-switch v-model="dataList[scope.$index].status"  @change="changeStatus(scope.row)" active-value="1" inactive-value="0"></el-switch></template>
			</el-table-column>
			<el-table-column label="操作" width="120" fixed="right">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" circle @click="EditBanner(scope.row)"></el-button>
					<el-button type="danger" icon="el-icon-delete" circle @click="DelBanner(scope.row)"></el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20,30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

		<el-dialog ></el-dialog>
	</div>
</template>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 70px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
<script>
	import API from '../../../api/api';
	import  util  from '../../../api/util.js';
	export default {
		name: 'Banner',
		data() {
			return {
				status:true,
				dataList:[],
				select_status:'',
				select_name:'',
				select_group:'',
				total:10,
				currentPage:1,
				size:10,
			}
		},
		methods: {
			FormatStatus(value){
				return value == 1 ? '正常' : '禁用' ;
			},
			FormatTime(value){
				return util.format(value,'yyyy-MM-dd hh:mm:ss');
			},
			format(row,column,cellValue){
				return cellValue == null ? '—' : cellValue;
			},
			changeStatus(row){
		        API.BannerEdit(row).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.erroe(rs.msg);}}).catch(() => {console.log('BannerEdit is error')});
			},
			callbacks(value){
				return util.format(value,'yyyy-MM-dd hh:mm:ss')
			},
			DelBanner(row){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'
		        }).then(() => {
		        	API.BannerDel({id:row.id}).then(rs => {if(rs.code == 1){this.$message.success('删除成功！'); this.getBannerlist({page:this.currentPage, rows:this.size})}else{this.$message.erroe(rs.msg);}}).catch(() =>{console.log('BannerDel is error!')});  	
		        }).catch(() => {});
			},
			AddBanner(){
				this.$router.push({path:'/user/Banner/addBanner'});
			},
			EditBanner(row){
				this.$router.push({path:'/user/Banner/editBanner/'+row.id});
			},
			getBannerlist(params){
				API.BannerList(params).then(rs => {
					this.dataList = rs.rows;
					this.total = Number(rs.total);
				})
			},
			search(){
				const param = {page:this.currentPage, rows:this.size};
				if(this.select_name){
					param.name = this.select_name;
				}
				if(this.select_status){
					param.status = this.select_status;
				}
				if(this.select_group){
					param.group = this.select_group;
				}
				// console.log(param);
				this.getBannerlist(param);
			},
			resetSearch(){
				this.select_status = '';
				this.select_name = '';
				this.select_group = '';
				this.getBannerlist({page:this.currentPage, rows:this.size});
			},
			handleSizeChange(val){
				this.size = val;
				this.getBannerlist({page:this.currentPage, rows:this.size});
			},
			handleCurrentChange(val){
				this.currentPage = val;
				this.getBannerlist({page:this.currentPage, rows:this.size});
			},
		},
		mounted:function(){
			this.getBannerlist({page:this.currentPage, rows:this.size});
		}

	}
</script>
<style scoped>
	.el-table {border:1px solid #eee; margin-top:20px;}
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

	.demo-table-expand {
	    font-size: 0;
	  }

	.el-form-item__label { width: 90px;color: #99a9bf;}
	  .demo-table-expand .el-form-item {
	    margin-right: 0;
	    margin-bottom: 0;
	    width: 30%;
	  }
	  .demo-table-expand .el-form-item:last-child{width:100%;}
	 .bgimg {width:130px; height: 130px; border:1px solid #eee;}
	 .noData {color:red;}
</style>