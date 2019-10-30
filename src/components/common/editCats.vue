<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-anliguanli"></i> {{catsKey.name}}模块</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/'+catsKey.path+'/2' }">{{catsKey.name}}分类</el-breadcrumb-item>
                <el-breadcrumb-item>分类编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :model="Editform" :rules="rules" label-width="150px" ref="Editform" id="editform"> 
				<el-collapse v-model="activeName">
                    <el-collapse-item title="网页优化" name="1">
                        <el-form-item label="网页标题" prop="title">
                            <el-input v-model="Editform.title"></el-input>	
                        </el-form-item>
                        <el-form-item label="关键字" prop="word">
                            <el-input v-model="Editform.word"></el-input>	
                        </el-form-item>
                        <el-form-item label="描述" prop="intro">
                            <el-input type="textarea"  v-model="Editform.intro" :rows="5"></el-input>	
                        </el-form-item>
                    </el-collapse-item>
                    <el-collapse-item title="添加内容" name="2">
                        <el-form-item label="父级分类" prop="parentid">
                            <el-cascader v-model="parentid" :clearable="true" placeholder="-- 顶级分类 --" :options="options" :props="props"   change-on-select  @change="handClick"></el-cascader>
                        </el-form-item>
                        <el-form-item label="分类名" prop="name">
                            <el-input v-model="Editform.name"></el-input>
                        </el-form-item>
                        <el-form-item label="图标" prop="icon" class="icon">
                            <div class="icon img">
                                <div v-if="Editform.icon" class="img">
                                    <img :src="Editform.icon">
                                    <div id="mask">
                                        <i class="el-icon-circle-plus" @click="appendIcon"></i>
                                        <i class="el-icon-delete"  @click="Editform.icon = ''"></i>
                                    </div>
                                </div>
                                <i v-else @click="appendIcon" class="el-icon-plus avatar-uploader-icon"></i>
                            </div>
                        </el-form-item>
                        <el-form-item label="封面" prop="image" class="icon">
                            <div class="icon img">
                                <div v-if="Editform.image" class="img">
                                    <img :src="Editform.image">
                                    <div id="mask">
                                        <i class="el-icon-circle-plus" @click="appendImage"></i>
                                        <i class="el-icon-delete"  @click="Editform.image = ''"></i>
                                    </div>
                                </div>
                                <i v-else @click="appendImage" class="el-icon-plus avatar-uploader-icon"></i>
                            </div>
                            <editorImage @successCBK="imageSuccessCBK" ref="images" v-bind:Keys = 'Keys'></editorImage>
                        </el-form-item>
                        <el-form-item label="内容" prop="content" class="contents">
                            <el-input type="textarea" :rows="5" v-model="Editform.content"></el-input>
                        </el-form-item>
                        <el-form-item label="排序" prop="level" class="level">
                            <el-input-number :min="0" v-model="Editform.level" controls-position="right"></el-input-number>
                            <span>数字越大排位越靠前</span>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-switch
                                v-model="Editform.status"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="正常"
                                inactive-text="禁用"
                                active-value="1"
                                inactive-value="0">
                            </el-switch>
                        </el-form-item>
                    </el-collapse-item>
                </el-collapse>
			 	<el-form-item class="last-item">
				    <el-button type="primary" @click="submitForm('Editform')" style="margin-right:20px;" :disabled="disabled">修改</el-button>
				    <el-button  @click="back" id="back">返回</el-button>
			  	</el-form-item>
		</el-form>
    </div>
</template>

<script>
    import editorImage from './editorImage.vue';
	import API from '../../api/api';
    export default {
        components:{editorImage},
        props: {
            catsKey:{type:Object,required:true}
        },
        data() {
            return {
                Keys:{isEditor:false , isIcon:false , video:false},
                activeName:['1' , '2'],
                Editform:{
					'id':'',
					'parentid':'0',
					'name':'',
					'icon' : '',
					'image':'',
					'word':'',
					'intro':'',
					'content':'',
					'level':0,
					'status':'1'
				},
				rules:{
					name: [{required: true, message: '请输入分类标题', trigger: 'blur'}],
				},
				options:[],
				props: {
					value: 'id',
					label:'name',
					children: 'children'
				},
				parentid:[],
                disabled:false,
            }
        },
        methods: {
            imageSuccessCBK(arr){
                this.Keys.isIcon ? this.Editform.icon = arr[0].url : this.Editform.image = arr[0].url;
            },
            appendIcon(){
                this.Keys.isIcon = true;
                this.$refs.images.uploadImage();
            },
            appendImage(){
                this.Keys.isIcon = false;
                this.$refs.images.uploadImage();
            },
            back(){    
                switch(this.catsKey.id){             
                    case 'product': this.$router.push({path:'/user/Product/2'}); break;
                    case 'news': this.$router.push({path:'/user/News/2'}); break;
                    case 'case': this.$router.push({path:'/user/Case/2'}); break;
                    case 'download': this.$router.push({path:'/user/Down/2'}); break;
                    case 'video': this.$router.push({path:'/user/Video/2'}); break;
                    case 'jobs': this.$router.push({path:'/user/Job/2'}); break;
                    case 'support': this.$router.push({path:'/user/Support/2'}); break;
                    default: break;
                }       
            },  

            handClick(val){
				if(val.length == 0){
					this.Editform.parentid = '0';
				}else{
					this.Editform.parentid = val[val.length - 1];
				}
			},
			sendToImage(data){
				this.Editform.image = data;
			},
			sendToIcon(data){
				this.Editform.icon = data;
            },
            getMsg(id){
                switch (this.catsKey.id){
                    case 'product':
                            API.ProductcatsList({id:id}).then((rs) => {
                                this.CatsGet({});
                                this.Editform.id = id;
                                this.Editform.title = rs.rows[0].title;
                                this.Editform.name = rs.rows[0].name;
                                this.Editform.icon = rs.rows[0].icon;
                                this.Editform.image = rs.rows[0].image;
                                this.Editform.word = rs.rows[0].word;
                                this.Editform.intro = rs.rows[0].intro;
                                this.Editform.content = rs.rows[0].content;
                                this.Editform.level = rs.rows[0].level;
                                this.Editform.status = rs.rows[0].status;
                                rs.rows[0].arrparentid = rs.rows[0].arrparentid.split(',').splice(1);
                                console.log(rs)	
                                rs.rows[0].arrparentid.forEach((ele,index) => {
                                    this.parentid[index] = Number(ele);
                                    console.log(this.parentid)
                                })
                                if(this.parentid.length == 0){this.Editform.parentid = '0';}
                                else{this.Editform.parentid = this.parentid[this.parentid.length - 1];}
                            }).catch(error => {console.log(error)})
                            break;
                    case 'news': 
                                API.newscatsList({id:id}).then((rs) => {
                                this.CatsGet({});
                                this.Editform.id = id;
                                this.Editform.title = rs.rows[0].title;
                                this.Editform.name = rs.rows[0].name;
                                this.Editform.icon = rs.rows[0].icon;
                                this.Editform.image = rs.rows[0].image;
                                this.Editform.word = rs.rows[0].word;
                                this.Editform.intro = rs.rows[0].intro;
                                this.Editform.content = rs.rows[0].content;
                                this.Editform.level = rs.rows[0].level;
                                this.Editform.status = rs.rows[0].status;
                                rs.rows[0].arrparentid = rs.rows[0].arrparentid.split(',').splice(1);
                                rs.rows[0].arrparentid.forEach((ele,index) => {
                                    this.parentid[index] = Number(ele);
                                })
                                if(this.parentid.length == 0){this.Editform.parentid = '0';}
                                else{this.Editform.parentid = this.parentid[this.parentid.length - 1];}
                            }).catch(error => {console.log(error)})
                            break;
                    case 'case': 
                            API.CasecatsList({id:id}).then((rs) => {
                                this.CatsGet({});
                                this.Editform.id = id;
                                this.Editform.title = rs.rows[0].title;
                                this.Editform.name = rs.rows[0].name;
                                this.Editform.icon = rs.rows[0].icon;
                                this.Editform.image = rs.rows[0].image;
                                this.Editform.word = rs.rows[0].word;
                                this.Editform.intro = rs.rows[0].intro;
                                this.Editform.content = rs.rows[0].content;
                                this.Editform.level = rs.rows[0].level;
                                this.Editform.status = rs.rows[0].status;

                                rs.rows[0].arrparentid = rs.rows[0].arrparentid.split(',').splice(1);	
                                rs.rows[0].arrparentid.forEach((ele,index) => {
                                    this.parentid[index] = Number(ele);
                                })
                                if(this.parentid.length == 0){this.Editform.parentid = '0';}
                                else{this.Editform.parentid = this.parentid[this.parentid.length - 1];}

                            }).catch(error => {console.log(error)})
                            break;
                    case 'download':
                            API.DowncatsList({id:id}).then((rs) => {
                                this.CatsGet({});
                                this.Editform.id = id;
                                this.Editform.title = rs.rows[0].title;
                                this.Editform.name = rs.rows[0].name;
                                this.Editform.icon = rs.rows[0].icon;
                                this.Editform.image = rs.rows[0].image;
                                this.Editform.word = rs.rows[0].word;
                                this.Editform.intro = rs.rows[0].intro;
                                this.Editform.content = rs.rows[0].content;
                                this.Editform.level = rs.rows[0].level;
                                this.Editform.status = rs.rows[0].status;
                                rs.rows[0].arrparentid = rs.rows[0].arrparentid.split(',').splice(1);	
                                rs.rows[0].arrparentid.forEach((ele,index) => {
                                    this.parentid[index] = Number(ele);
                                })
                                if(this.parentid.length == 0){this.Editform.parentid = '0';}
                                else{this.Editform.parentid = this.parentid[this.parentid.length - 1];}
                            }).catch(error => {console.log(error)})
                            break;
                    case 'video': 
                            API.VideocatsList({id:id}).then((rs) => {
                                this.CatsGet({});
                                this.Editform.id = id;
                                this.Editform.title = rs.rows[0].title;
                                this.Editform.name = rs.rows[0].name;
                                this.Editform.icon = rs.rows[0].icon;
                                this.Editform.image = rs.rows[0].image;
                                this.Editform.word = rs.rows[0].word;
                                this.Editform.intro = rs.rows[0].intro;
                                this.Editform.content = rs.rows[0].content;
                                this.Editform.level = rs.rows[0].level;
                                this.Editform.status = rs.rows[0].status;
                                rs.rows[0].arrparentid = rs.rows[0].arrparentid.split(',').splice(1);	
                                rs.rows[0].arrparentid.forEach((ele,index) => {
                                    this.parentid[index] = Number(ele);
                                })
                                if(this.parentid.length == 0){this.Editform.parentid = '0';}
                                else{this.Editform.parentid = this.parentid[this.parentid.length - 1];}
                            }).catch(error => {console.log(error)})
                            break;
                    case 'jobs': 
                            API.JobcatsList({id:id}).then((rs) => {
                                this.CatsGet({});
                                this.Editform.id = id;
                                this.Editform.title = rs.rows[0].title;
                                this.Editform.name = rs.rows[0].name;
                                this.Editform.icon = rs.rows[0].icon;
                                this.Editform.image = rs.rows[0].image;
                                this.Editform.word = rs.rows[0].word;
                                this.Editform.intro = rs.rows[0].intro;
                                this.Editform.content = rs.rows[0].content;
                                this.Editform.level = rs.rows[0].level;
                                this.Editform.status = rs.rows[0].status;
                                rs.rows[0].arrparentid = rs.rows[0].arrparentid.split(',').splice(1);	
                                rs.rows[0].arrparentid.forEach((ele,index) => {
                                    this.parentid[index] = Number(ele);
                                })
                                if(this.parentid.length == 0){this.Editform.parentid = '0';}
                                else{this.Editform.parentid = this.parentid[this.parentid.length - 1];}
                            }).catch(error => {console.log(error)})
                            break;
                    case 'support':
                            API.SupportcatsList({id:id}).then((rs) => {
                                this.CatsGet({});
                                this.Editform.id = id;
                                this.Editform.title = rs.rows[0].title;
                                this.Editform.name = rs.rows[0].name;
                                this.Editform.icon = rs.rows[0].icon;
                                this.Editform.image = rs.rows[0].image;
                                this.Editform.word = rs.rows[0].word;
                                this.Editform.intro = rs.rows[0].intro;
                                this.Editform.content = rs.rows[0].content;
                                this.Editform.level = rs.rows[0].level;
                                this.Editform.status = rs.rows[0].status;
                                rs.rows[0].arrparentid = rs.rows[0].arrparentid.split(',').splice(1);	
                                rs.rows[0].arrparentid.forEach((ele,index) => {
                                    this.parentid[index] = Number(ele);
                                })
                                if(this.parentid.length == 0){this.Editform.parentid = '0';}
                                else{this.Editform.parentid = this.parentid[this.parentid.length - 1];}
                            }).catch(error => {console.log(error)})
                            break;

                    default: break;
                }
				
            },
            submitForm(formName) {
                console.log(this.Editform);
				this.$refs[formName].validate((valid) => {
					if(valid){
                        switch (this.catsKey.id){
                            case 'product': 
                                    API.ProductcatsEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！');this.back();}
                                        else{this.$message.error(rs.msg);}
                                    }).catch(error => { console.log(error) })
                                    break;
                            case 'news': 
                                    API.newscatsEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！');this.back();}
                                        else{this.$message.error(rs.msg);}
                                    }).catch(error => { console.log(error) })
                                    break;
                            case 'case': 
                                    API.CasecatsEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！');this.back();}
                                        else{this.$message.error(rs.msg);}
                                    }).catch(error => { console.log(error) })
                                    break;  
                            case 'download': 
                                    API.DowncatsEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！');this.back();}
                                        else{this.$message.error(rs.msg);}
                                    }).catch(error => { console.log(error) })
                                    break;
                            case 'video': 
                                    API.VideocatsEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！');this.back();}
                                        else{this.$message.error(rs.msg);}
                                    }).catch(error => { console.log(error) })
                                    break;
                            case 'jobs':
                                    API.JobcatsEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！');this.back();}
                                        else{this.$message.error(rs.msg);}
                                    }).catch(error => { console.log(error) })
                                    break;
                            case 'support': 
                                    API.SupportcatsEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！');this.back();}
                                        else{this.$message.error(rs.msg);}
                                    }).catch(error => { console.log(error) })
                                    break;
                            default: break;
                        }
                        this.disabled = false;
					}else{ this.activeName = '2'; return false;}
				})
            },
            CatsGet(params){
                switch(this.catsKey.id){
                    case 'product':
                        API.ProductcatsGet(params).then(rs => {this.selectOption(rs); this.options = rs; }).catch(error => {console.log(error)});break;
                    case 'news':
                        API.NewscatsGet(params).then(rs => {this.selectOption(rs); this.options = rs;}).catch(error => {console.log(error)});break;
                    case 'case':
                        API.CasecatsGet(params).then(rs => {this.selectOption(rs); this.options = rs;}).catch(error => {console.log(error)});break;
                    case 'download':
                        API.DownloadcatsGet(params).then(rs => {this.selectOption(rs); this.options = rs;}).catch(error => {console.log(error)});break;
                    case 'video':
                        API.VideocatsGet(params).then(rs => {this.selectOption(rs); this.options = rs;}).catch(error => {console.log(error)});break;
                    case 'jobs':
                        API.JobscatsGet(params).then(rs => {this.selectOption(rs); this.options = rs;}).catch(error => {console.log(error)});break;
                    case 'support':
                        API.SupportcatsGet(params).then(rs => {this.selectOption(rs); this.options = rs;}).catch(error => {console.log(error)});break; 
                    default: break;
				}
            },
            selectOption(rs){
				rs.forEach(ele => {
					if(ele.id == this.Editform.id){
						ele['disabled'] = true;return ;	
					}else if (ele.children){this.selectOption(ele.children);}
				})
			}
        },
        mounted:function(){
			this.getMsg(this.$route.params.id);
		}
    }
</script>

<style scoped>
    .el-form {width:98%; margin:0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; ;}
@media screen and (max-width:1600px){
    .el-form {width:90%;}
}
.el-form-item {width:80%; }
.el-form-item.image{width:100%;}
.el-form-item.contentdesc{width:100%;}
.el-form-item.singleimage {width:25%}
.el-form-item.retail_price {width:25%}
.el-form-item.price {width:25%}
.el-collapse {width:100%; border-bottom:none;}
.last-item {margin-top:30px;}
.last-item .el-form-item__content {margin-left:30px !important;}
.level span {font-size:14px; color:#19aa8d; padding-left:15px;}

.icon.img {width:120px; height:120px; border:1px solid #d9d9d9; border-radius: 6px; cursor: pointer; overflow:hidden; position: relative;}
.icon .img:hover {border-color:#19aa8d;}
.icon .img img {width:120px; height:auto; position: absolute; left:50%; top:50%; transform: translate(-50%,-50%)}
</style>
