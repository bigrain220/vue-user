<template>
    <div>
        <div class="handle-box">
        	<el-button type="success" @click="addNews" class="handle_add">新增{{catsKey.name}}</el-button>
			<el-cascader v-model="selectCid" placeholder="模块分类" :clearable="true" :options="options" :props="props"   change-on-select  @change="handClick"></el-cascader>
            <el-select v-model="select_status" placeholder="状态" class="handle_select" @change="search">
                <el-option value="1" label="正常" key="1"></el-option>
                <el-option value="0" label="禁用" key="0"></el-option>
            </el-select>
            <el-input v-model="select_name" placeholder="标题搜索" clearable class="handle-input" @keydown.enter.native="search"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> 
            <el-button @click="resetSearch" >重置</el-button>
        </div>
        <el-table stripe :data="dataList" style="width: 100%" v-loading="loading">
        	<el-table-column prop="id" label="ID" sortable width="120"></el-table-column>
        	<el-table-column prop="name" :label="labelName"></el-table-column>
        	<el-table-column prop="cat_name" label="分类名称" width="120"></el-table-column>
        	<el-table-column prop="created" label="创建时间" width="180" :formatter="formatCreate"></el-table-column>
            <el-table-column prop="recommend" label="推荐" width="120">
				<template slot-scope="scope"><el-switch v-model="dataList[scope.$index].recommend"  @change="changeRecommend(scope.row)"  active-value="1" inactive-value="0"></el-switch></template>
			</el-table-column>
            <el-table-column prop="status" label="状态" width="120">
				<template slot-scope="scope"><el-switch v-model="dataList[scope.$index].status"  @change="changeStatus(scope.row)"  active-value="1" inactive-value="0"></el-switch></template>
			</el-table-column>
        	<el-table-column label="操作" width="220">
              	<template slot-scope="scope">
                  <el-button v-if="scope.row.status == 0" size="mini" type="success" disabled icon="el-icon-view"></el-button>
                  <el-button v-else size="mini" type="success" @click="lookClick(scope.row)" icon="el-icon-view"></el-button>
                  <el-button size="mini" type="primary" @click="editClick(scope.row)" icon="el-icon-edit"></el-button>
                  <el-button size="mini" type="danger" @click="deleteClick(scope.row)" icon="el-icon-delete"></el-button>
				</template>
          </el-table-column>
        </el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[ 10,20, 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        
	</div>
</template>

<script>
    import API from '../../api/api';
	import  util  from '../../api/util.js';
    export default {
        props: {
            catsKey:{type:Object,required:true}
        },
        data() {
            return {
                disabled:false,
                dataList:[],
				total:10,
				currentPage:1,
				size:10,
				select_name:'',
				select_status:'',
				slelect_cid:'',
				selectCid:[],
				options:[],
				props: {
					value: 'id',
					label:'name',
					children: 'children'
                },
                
                labelName:this.catsKey.name + '标题',
                loading:true,
            }
        },
        methods: {
            async lookClick(row){
                var url = 'http://'+ this.$store.state.userMsg.username +'.'+ API.DomainName + '/'+this.catsKey.id + '/show-' + row.id + '.html';
                window.open(url);
            },
            changeStatus(row){
                let params = {id:row.id , status: row.status}
				switch(this.catsKey.id){
                    case 'product':
                            API.ProductEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功!');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                    case 'news':
                             API.newsEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功!');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                           
                    case 'case':
                             API.CaseEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功!');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                         
                    case 'download':
                             API.DownEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功!');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                           
                    case 'video':
                             API.VideoEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功!');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                           
                    case 'jobs':
                             API.JobEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功!');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                            
                    case 'support':
                             API.SupportEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功!');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                       
                    default: break;
                }
            },
            changeRecommend(row){
                let params = {id:row.id , recommend: row.recommend}
				switch(this.catsKey.id){
                    case 'product':
                             API.ProductEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                    case 'news':
                             API.newsEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                           
                    case 'case':
                             API.CaseEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                         
                    case 'download':
                             API.DownEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                           
                    case 'video':
                             API.VideoEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                           
                    case 'jobs':
                             API.JobEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                            
                    case 'support':
                             API.SupportEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                       
                    default: break;
                }
			},
            addNews(){
                switch(this.catsKey.id){
                    case 'product':
                            this.$router.push({path: '/user/Product/1/addProduct'});  break;
                    case 'news':
                            this.$router.push({path: '/user/News/1/addNews'});  break;
                    case 'case':
                            this.$router.push({path: '/user/Case/1/addCase'});  break;
                    case 'download':
                            this.$router.push({path: '/user/Down/1/addDown'});  break;
                    case 'video':
                            this.$router.push({path: '/user/Video/1/addVideo'});  break;
                    case 'jobs':
                            this.$router.push({path: '/user/Job/1/addJob'});  break;
                    case 'support':
                            this.$router.push({path: '/user/Support/1/addSupport'});  break;
                    default: break;
                }
			},
			handClick(val){
				if(val.length == 0){
					this.select_cid = '0';
				}else{
					this.select_cid = val[val.length - 1];
				}
				this.search();
			},
			search(){
				const param = {};
				if(this.select_cid){
					param.cid = this.select_cid;
				}
				if(this.select_name){
					param.name = this.select_name;
				}
				if(this.select_status){
					param.status = this.select_status;
				}
				this.getList(param);
			},
			resetSearch(){
				this.select_cid = '';
				this.selectCid = [];
				this.select_status = '';
				this.select_name = '';
                // this.getList({page:this.currentPage, rows:this.size});
                this.search();
			},
			getList(param){
                // document.getElementById('icon').classList.add(this.catsKey.icon);
                param.page = this.currentPage;
                param.rows = this.size;
                switch(this.catsKey.id){
                    case 'product':
                        API.ProductList(param).then((rs) => {
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                            this.getCats();
                        }).catch(error => {console.log(error)}); break;
                    case 'news':
                        API.newsList(param).then((rs) => {
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                            this.getCats();
                        }).catch(error => {console.log(error)}); break;
                    case 'case':
                        API.CaseList(param).then((rs) => {
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                            this.getCats();
                        }).catch(error => {console.log(error)}); break;
                    case 'download':
                        API.DownList(param).then((rs) => {
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                            this.getCats();
                        }).catch(error => {console.log(error)}); break;
                    case 'video':
                        API.VideoList(param).then((rs) => {
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                            this.getCats();
                        }).catch(error => {console.log(error)}); break;
                    case 'jobs':
                        API.JobList(param).then((rs) => {
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                            this.getCats();
                        }).catch(error => {console.log(error)}); break;
                    case 'support':
                        API.SupportList(param).then((rs) => {
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                            this.getCats();
                        }).catch(error => {console.log(error)}); break;
                    default: break;
                }
				
			},
			getCats(){
                if(this.options.length == 0){
                switch(this.catsKey.id){
                    case 'product':
                        API.ProductcatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    case 'news':
                        API.NewscatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    case 'case':
                        API.CasecatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    case 'download':
                        API.DownloadcatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    case 'video':
                        API.VideocatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    case 'jobs':
                        API.JobscatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    case 'support':
                        API.SupportcatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    default: break;
                }
                }
			},
			formatCreate(row,column,cellValue){
				return util.format(cellValue,'yyyy-MM-dd hh:mm');
			},
			editClick(row){
                switch(this.catsKey.id){
                    case 'product':
                            this.$router.push({path: '/user/Product/editProduct/'+row.id});  break;
                    case 'news':
                            this.$router.push({path: '/user/News/editNews/'+row.id});  break;
                    case 'case':
                            this.$router.push({path: '/user/Case/editCase/'+row.id});  break;
                    case 'download':
                            this.$router.push({path: '/user/Down/editDown/'+row.id});  break;
                    case 'video':
                            this.$router.push({path: '/user/Video/editVideo/'+row.id});  break;
                    case 'jobs':
                            this.$router.push({path: '/user/Job/editJob/'+row.id});  break;
                    case 'support':
                            this.$router.push({path: '/user/Support/editSupport/'+row.id});  break;
                    default: break;
                }
				
			},
			deleteClick(row){
				this.$confirm('将永久删除id为'+row.id+'的此条内容, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
                    switch(this.catsKey.id){
                        case 'product':
                                API.ProductDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除此条数据！');this.getList({});}
                                    else{this.$message.error(rs.msg)}
                                }).catch(error => {console.log(error)});  break;
                        case 'news':
                                API.newsDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除此条数据！');this.getList({});}
                                    else{this.$message.error(rs.msg)}
                                }).catch(error => {console.log(error)});  break;
                        case 'case':
                                API.CaseDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除此条数据！');this.getList({});}
                                    else{this.$message.error(rs.msg)}
                                }).catch(error => {console.log(error)});  break;
                        case 'download':
                                API.DownDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除此条数据！');this.getList({});}
                                    else{this.$message.error(rs.msg)}
                                }).catch(error => {console.log(error)});  break;
                        case 'video':
                                API.VideoDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除此条数据！');this.getList({});}
                                    else{this.$message.error(rs.msg)}
                                }).catch(error => {console.log(error)});  break;
                        case 'jobs':
                                API.JobDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除此条数据！');this.getList({});}
                                    else{this.$message.error(rs.msg)}
                                }).catch(error => {console.log(error)});  break;
                        case 'support':
                                API.SupportDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除此条数据！');this.getList({});}
                                    else{this.$message.error(rs.msg)}
                                }).catch(error => {console.log(error)});  break;
                        default: break;
                    }
		        	
		        }).catch(error => {console.log(error)});
			},
			handleSizeChange(val){
				this.size = val;
				this.getList({});
			},
			handleCurrentChange(val){
				this.currentPage = val;
				this.getList({});
			},
        },
        mounted:function(){
            // this.getList({});
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
</style>