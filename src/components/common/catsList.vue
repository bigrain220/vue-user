<template>
    <div>
        <div class="handle-box">
        	<el-button type="success" @click="addcats" class="handle_add">添加分类</el-button>
            <el-input v-model="select_name" placeholder="输入分类名查找" clearable class="handle-input" @keydown.enter.native="search"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> 
            <el-button @click="resetSearch" >重置</el-button>
        </div>
        <el-table stripe :data="dataList" style="width: 100%" v-loading="loading">
        	<el-table-column prop="id" label="id" width="120"></el-table-column>
        	<el-table-column prop="name" label="分类名称" width="240">
				<template slot-scope="scope">
					 <i v-if="dataList[scope.$index].child == '1' && dataList[scope.$index].isOpen == false" class="el-icon-caret-right" @click="getChildCats(scope)" status='close'></i>
					 <template v-else> 
						<i v-if="dataList[scope.$index].child == '1' && dataList[scope.$index].isOpen == true" class="el-icon-caret-bottom" @click="getChildCats(scope)" status='close'></i>
						<i v-else style="width:14px; height:14px; display:inline-block;"></i>
					</template>					 
					 <span class="mediaName">{{scope.row.name}}</span>
				</template>
			</el-table-column>
        	<el-table-column prop="level" label="排序"></el-table-column>
        	<el-table-column prop="created" label="创建时间" width="240" :formatter="formatCreate"></el-table-column>
        	<el-table-column prop="count" :label="lableName"></el-table-column>
        	 <el-table-column prop="status" label="状态">
				<template slot-scope="scope"><el-switch v-model="dataList[scope.$index].status"  @change="changeStatus(scope.row)"  active-value="1" inactive-value="0"></el-switch></template>
			</el-table-column>
        	<el-table-column label="操作" width="180">
              <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="editClick(scope.row)" icon="el-icon-edit"></el-button>
             	  <el-button v-if="scope.row.count == 0" size="mini" type="danger" @click="deleteClick(scope.row)" icon="el-icon-delete"></el-button>
             	  <el-button v-else size="mini" type="danger"  disabled @click="deleteClick(scope.row)" icon="el-icon-delete"></el-button>
			  </template>
          </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import API from '../../api/api';
	import  util  from '../../api/util.js';
    export default {
        props: {
            catsKey2:{type:Object,required:true}
        },
        data() {
            return {
               dataList:[],
				total:10,
                select_name:'',
                lableName:this.catsKey2.name+'数',
                loading: true,
            }
        },
        methods: {
            changeStatus(row){
                let params = {id:row.id , status: row.status}
				switch(this.catsKey2.id){
                    case 'product':

                             API.ProductcatsEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                    case 'news':
                             API.newscatsEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                           
                    case 'case':
                             API.CasecatsEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                         
                    case 'download':
                             API.DowncatsEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                           
                    case 'video':
                             API.VideocatsEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                           
                    case 'jobs':
                             API.JobcatsEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                            
                    case 'support':
                             API.SupportcatsEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});break;
                       
                    default: break;
                }
			},
            formatCreate(row,column,cellValue){
				return util.format(cellValue,'yyyy-MM-dd hh:mm:ss');
			},
			formatStatus(row,column,cellValue){
				return cellValue == '1' ? '正常' : '禁用' ;
            },
            getcatsList(param){
                switch (this.catsKey2.id){
                    case 'product':
                        API.ProductcatsList(param).then((rs) => {
                            rs.rows.forEach(ele => {if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}});
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                        }).catch(error => {console.log('error');}); break;

                        case 'news':
                        API.newscatsList(param).then((rs) => {
                            rs.rows.forEach(ele => {if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}});
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                        }).catch(error => {console.log('error');}); break;

                        case 'case':
                        API.CasecatsList(param).then((rs) => {
                            rs.rows.forEach(ele => {if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}});
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                        }).catch(error => {console.log('error');}); break;

                        case 'download':
                        API.DowncatsList(param).then((rs) => {
                            rs.rows.forEach(ele => {if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}});
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                        }).catch(error => {console.log('error');}); break;

                        case 'video':
                        API.VideocatsList(param).then((rs) => {
                            rs.rows.forEach(ele => {if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}});
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                        }).catch(error => {console.log('error');}); break;

                        case 'jobs':
                        API.JobcatsList(param).then((rs) => {
                            rs.rows.forEach(ele => {if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}});
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                        }).catch(error => {console.log('error');}); break;

                        case 'support':
                        API.SupportcatsList(param).then((rs) => {
                            rs.rows.forEach(ele => {if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}});
                            this.dataList = rs.rows;
                            this.total = Number(rs.total);
                            this.loading = false;
                        }).catch(error => {console.log('error');}); break;

                        default: break;
                }
				
            },
            search(){
				const param = { name:""};
				param.name = this.select_name;
				this.getcatsList(param);	
            },
            resetSearch(){
				this.select_name = '';
                this.search();
			},
            editClick(row){
                switch (this.catsKey2.id){
                    // case 'product': this.$router.push({path: '/user/Productcats/editProductcats/'+row.id});break;
                    // case 'news': this.$router.push({path: '/user/newscats/editNewscats/'+row.id});break;
                    // case 'case': this.$router.push({path: '/user/casecats/editCasecats/'+row.id});break;
                    // case 'download': this.$router.push({path: '/user/Downcats/editDowncats/'+row.id});break;
                    // case 'video': this.$router.push({path: '/user/Videocats/editVideocats/'+row.id});break;
                    // case 'jobs': this.$router.push({path: '/user/Jobcats/editJobcats/'+row.id});break;
                    // case 'support': this.$router.push({path: '/user/Supportcats/editSupportcats/'+row.id});break;
                    // default: break;
                    case 'product': this.$router.push({path: '/user/Product/editProductcats/'+row.id});break;
                    case 'news': this.$router.push({path: '/user/news/editNewscats/'+row.id});break;
                    case 'case': this.$router.push({path: '/user/case/editCasecats/'+row.id});break;
                    case 'download': this.$router.push({path: '/user/Down/editDowncats/'+row.id});break;
                    case 'video': this.$router.push({path: '/user/Video/editVideocats/'+row.id});break;
                    case 'jobs': this.$router.push({path: '/user/Job/editJobcats/'+row.id});break;
                    case 'support': this.$router.push({path: '/user/Support/editSupportcats/'+row.id});break;
                    default: break;
                }
            },
            deleteClick(row){
				this.$confirm('将永久删除'+row.name+', 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
                    switch (this.catsKey2.id){
                        case 'product':
                                API.ProductcatsDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除！');this.getcatsList({});}
                                    else{this.$message.error(rs.msg)}
                                }); break; 
                        case 'news':
                                API.newscatsDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除！');this.getcatsList({});}
                                    else{this.$message.error(rs.msg)}
                                }); break; 
                        case 'case':
                                API.CasecatsDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除！');this.getcatsList({});}
                                    else{this.$message.error(rs.msg)}
                                }); break; 
                        case 'download':
                                API.DowncatsDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除！');this.getcatsList({});}
                                    else{this.$message.error(rs.msg)}
                                }); break; 
                        case 'video':
                                API.VideocatsDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除！');this.getcatsList({});}
                                    else{this.$message.error(rs.msg)}
                                }); break; 
                        case 'jobs':
                                API.JobcatsDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除！');this.getcatsList({});}
                                    else{this.$message.error(rs.msg)}
                                }); break; 
                        case 'support':
                                API.SupportcatsDel({id:row.id}).then(rs => {
                                    if(rs.code == 1){this.$message.success('已删除！');this.getcatsList({});}
                                    else{this.$message.error(rs.msg)}
                                }); break; 

                        default: break;
                    }
		        	
		        	
		        }).catch(() => {
		         	// this.$message.info('取消删除');       
		        });
            },
            addcats(){
                switch (this.catsKey2.id){
                    // case 'product': this.$router.push({path: '/user/Productcats/addProductcats'}); break;
                    // case 'news': this.$router.push({path: '/user/newscats/addNewscats'});break;
                    // case 'case': this.$router.push({path: '/user/casecats/addCasecats'});break;
                    // case 'download': this.$router.push({path: '/user/Downcats/addDowncats'});break;
                    // case 'video': this.$router.push({path: '/user/Videocats/addVideocats'});break;
                    // case 'jobs': this.$router.push({path: '/user/Jobcats/addJobcats'});break;
                    // case 'support': this.$router.push({path: '/user/Supportcats/addSupportcats'});break;
                    // default: break;
                    case 'product': this.$router.push({path: '/user/Product/2/addProductcats'}); break;
                    case 'news': this.$router.push({path: '/user/News/2/addNewscats'});break;
                    case 'case': this.$router.push({path: '/user/Case/2/addCasecats'});break;
                    case 'download': this.$router.push({path: '/user/Down/2/addDowncats'});break;
                    case 'video': this.$router.push({path: '/user/Video/2/addVideocats'});break;
                    case 'jobs': this.$router.push({path: '/user/Job/2/addJobcats'});break;
                    case 'support': this.$router.push({path: '/user/Support/2/addSupportcats'});break;
                    default: break;
                }
            },
            getChildCats(scopes){
				const id = scopes.row.id;			
                if(scopes.row.isOpen == false){//展开
                    switch (this.catsKey2.id){
                        case 'product':
                                API.ProductcatsList({parentid:id}).then(rs => {
                                    rs.forEach((ele,index) => {
                                        if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}
                                        this.dataList.splice((scopes.$index+index+1),0,ele);
                                    });	
                                }).catch(() => {console.log('error!');}); break;
                        case 'news':
                                API.newscatsList({parentid:id}).then(rs => {
                                    rs.forEach((ele,index) => {
                                        if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}
                                        this.dataList.splice((scopes.$index+index+1),0,ele);
                                    });	
                                }).catch(() => {console.log('error!');}); break;
                        case 'case':
                                API.CasecatsList({parentid:id}).then(rs => {
                                    rs.forEach((ele,index) => {
                                        if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}
                                        this.dataList.splice((scopes.$index+index+1),0,ele);
                                    });	
                                }).catch(() => {console.log('error!');}); break;
                        case 'download':
                                API.DowncatsList({parentid:id}).then(rs => {
                                    rs.forEach((ele,index) => {
                                        if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}
                                        this.dataList.splice((scopes.$index+index+1),0,ele);
                                    });	
                                }).catch(() => {console.log('error!');}); break;
                        case 'video':
                                API.VideocatsList({parentid:id}).then(rs => {
                                    rs.forEach((ele,index) => {
                                        if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}
                                        this.dataList.splice((scopes.$index+index+1),0,ele);
                                    });	
                                }).catch(() => {console.log('error!');}); break;
                        case 'jobs':
                                API.JobcatsList({parentid:id}).then(rs => {
                                    rs.forEach((ele,index) => {
                                        if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}
                                        this.dataList.splice((scopes.$index+index+1),0,ele);
                                    });	
                                }).catch(() => {console.log('error!');}); break;
                        case 'support':
                                API.SupportcatsList({parentid:id}).then(rs => {
                                    rs.forEach((ele,index) => {
                                        if(ele.child == '1'){ele = Object.assign(ele,{isOpen:false});}
                                        this.dataList.splice((scopes.$index+index+1),0,ele);
                                    });	
                                }).catch(() => {console.log('error!');}); break;

                        default: break;
                    }
					
					scopes.row.isOpen = true;
				}else{//收起
					const arr = [];
					for(var i = this.dataList.length - 1; i>=0; i--){
						if(this.dataList[i].arrparentid.indexOf(id) != -1){
							this.dataList.splice(i,1);
						}
					}
					scopes.row.isOpen = false;
				}
			}
        },
        mounted:function(){
            // this.getcatsList({})
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
	.el-icon-caret-right {cursor: pointer; color:#333;}
	.el-icon-caret-right:hover, .el-icon-caret-bottom {color:#19aa8d}

</style>