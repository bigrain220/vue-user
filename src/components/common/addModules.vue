<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i id="icon" class="iconfont"></i> {{catsKey.name}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/'+catsKey.path+'/1' }">{{catsKey.name}}列表</el-breadcrumb-item>
                <el-breadcrumb-item>新增{{catsKey.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<el-form :model="Addform" :rules="rules" label-width="150px" ref="Addform" id="addForm"> 
            <el-collapse v-model="activeName">
                <el-collapse-item title="网页优化" name="1">
                    <el-form-item  label="网页标题" prop="title" class="title">
                        <el-input v-model="Addform.title"></el-input>
                    </el-form-item>
                    <el-form-item label="关键字" prop="word" class="word">
                        <el-input  v-model="Addform.word"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="intro"  class="intro">
                        <el-input type="textarea" v-model="Addform.intro" :rows="5"></el-input>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="添加内容" name="2">
                    <el-form-item  :label="labelTitle" prop="name">
                        <el-input v-model="Addform.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="labelCats" prop="Cids">
                        <el-cascader v-if="Addform.Cids" v-model="Addform.Cids" placeholder="请选择" :clearable="true" :options="options" :props="props"   change-on-select  @change="handClick"></el-cascader>
                        <el-cascader v-else></el-cascader>	
                    </el-form-item>
                    <el-form-item label="排序" prop="level" class="level">
                        <el-input-number :min = "0" v-model="Addform.level" controls-position="right"></el-input-number>
                        <span>数字越大排位越靠前</span>
                    </el-form-item>
                    <el-form-item  label='推荐' prop="recommend" class="recommend"> 
                        <el-switch v-model="Addform.recommend" active-color="#13ce66" inactive-color="#ff4949" active-text="推荐" inactive-text="不推荐" active-value="1" inactive-value="0"> </el-switch>
                    </el-form-item>
                    <el-form-item label="状态" prop="status" class="status">
                        <el-switch  v-model="Addform.status" active-color="#13ce66" inactive-color="#ff4949" active-text="正常" inactive-text="禁用" active-value="1" inactive-value="0"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="catsKey.id == 'video'" label="路径" prop="url" class="video">
                        <el-input  placeholder="请输入视频地址  例：http://www.51g3.com/uploads/works.mp4 或 https://www.51g3.com/uploads/works.mp4" v-model="Addform.url"  clearable></el-input>
                        <el-button type="primary" @click="appendVideo" size="small">添加视频</el-button>
                    </el-form-item>
                    <el-form-item v-if="catsKey.id == 'download'" label="路径" prop="url">
                        <el-input  placeholder="请输地址" v-model="Addform.url"  clearable></el-input>
                    </el-form-item>
                    <el-form-item  v-if="catsKey.id == 'jobs'" label="工作地点" prop="location">
                        <el-input v-model="Addform.location"></el-input>
                    </el-form-item>
                    <el-form-item  v-if="catsKey.id == 'jobs'" label="薪资待遇" prop="salary">
                        <el-input v-model="Addform.salary"></el-input>
                    </el-form-item>
                    <el-form-item  v-if="catsKey.id == 'jobs'" label="招聘人数" prop="number" class="number">
                        <el-input-number v-model="Addform.number" controls-position="right" :min="1"></el-input-number><span style="padding-left:10px;">人</span>
                    </el-form-item>
                    <el-form-item v-if="catsKey.id == 'product'" :label="labelModel" prop="model">
                        <el-input type="textarea" :rows="2" v-model="Addform.model" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
                    </el-form-item>
                    <el-form-item v-if="catsKey.id == 'product'" :label="labelSpec" prop="spec">
                        <el-input type="textarea" :rows="2" v-model="Addform.spec" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
                    </el-form-item>
                    <el-form-item class="retail_price" v-if="catsKey.id == 'product'" label="市场价" prop="retail_price">
                        <span>￥ </span><el-input-number :step="10" :precision="2" :min = "0" v-model="Addform.retail_price" controls-position="right"></el-input-number>
                    </el-form-item>
                    <el-form-item class="price" v-if="catsKey.id == 'product'" label="优惠价" prop="price">
                        <span>￥ </span><el-input-number :step="10" :precision="2" :min = "0" v-model="Addform.price" controls-position="right" ></el-input-number>
                    </el-form-item>
                    <el-form-item class="image" v-if="catsKey.id == 'news' || catsKey.id == 'product' || catsKey.id == 'case'" :label="labelImage" prop="image">
                        <elUpload v-model="fileList" v-on:sendToImage="sendToImage"></elUpload>
                    </el-form-item>
                    <el-form-item class="singleimage" v-if="catsKey.id == 'download' || catsKey.id == 'jobs' || catsKey.id == 'support' || catsKey.id == 'video'" :label="labelImage" prop="image">
                        <div class="icon img">
							<div v-if="Addform.image" class="img">
								<img :src="Addform.image">
								<div id="mask">
									<i class="el-icon-circle-plus" @click="appendImage"></i>
									<i class="el-icon-delete"  @click="Addform.image = ''"></i>
								</div>
							</div>
							<i v-else @click="appendImage" class="el-icon-plus avatar-uploader-icon"></i>
						</div>
                        <editorImage @successCBK="imageSuccessCBK" ref="images" v-bind:Keys = 'Keys'></editorImage>
                    </el-form-item>
                    <el-form-item class="contentdesc" label="内容" prop="content">
                        <editor ref="Editor" v-model="Addform.content" @input="(content) => Addform.content = content"></editor>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>   
            <el-form-item class="last-item">
                <el-button type="primary" @click="submitForm('Addform')" style="margin-right:20px;">立即创建</el-button>
                <el-button @click="resetForm('Addform')">重置</el-button>
            </el-form-item>
		</el-form>
    </div>
</template>

<script>
    import editor from './Tinymce/index.vue';
    import elUpload from './moreUploadImage.vue';
    import editorImage from './editorImage.vue'
	import API from '../../api/api';
    export default {
        components: { editor, elUpload , editorImage},
        props: {
            catsKey:{type:Object,required:true}
        },
        data() {
            var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
			var checkUrl = (rule,value,callback) => {
				value == '' ? callback() : !reg.test(value) ? callback(new Error('请输入正确的网址')) : callback();
			}
            return {
                Keys:{isEditor:false , video:true},
                activeName: '2',
                fileList:[],
				dir:'',
				action:'',
				Addform:{
					'cid':'',
					'Cids':[],
					'name':'',
                    // 'image':[],
                    'image':'',
                    'title':'',
					'word':'',
					'intro':'',
					'content':'',
					'recommend':'0',
					'level':0,
                    'status':'1',
                    'url':'',//视频的字段
                    'loadings':false,
				},
				rules:{
					Cids: [{required: true, message: '请选择分类', trigger: 'change'}],
					name:[{required: true, message: '请输入标题', trigger: 'change' }],
					content:[{required: true, message: '请输入内容', trigger: 'change' }],
                    content: [{required: true, message: '内容不能为空' , trigger: 'blur'}],
                    url: [{required: true,  trigger: 'blur',validator:checkUrl}],
				},
				options:[],
				props: {
					value: 'id',
					label:'name',
					children: 'children'
                },
                labelCats:this.catsKey.name+'分类',
                labelTitle:this.catsKey.name+'名称',
                labelModel:this.catsKey.name+'型号',
                labelSpec:this.catsKey.name+'规格',
                labelImage:this.catsKey.name+'图片',
            }
        },
        methods: {
            appendImage(){
                this.Keys.video = false;
                this.$refs.images.uploadImage();
            },
            appendVideo(){
                this.Keys.video = true;
                this.$refs.images.uploadImage();
            },
            imageSuccessCBK(arr){
               this.Keys.video ? this.Addform.url = arr[0].url : this.Addform.image = arr[0].url;
            },
            sendToImage(data){
				this.fileList = data;
            },
            sendToImage2(data){
                this.Addform.image = data;
            },
			handClick(val){
				if(val.length == 0){
					this.Addform.cid = '0';
				}else{
					this.Addform.cid = val[val.length - 1];
				}
			},
			getcatsGet(){
                document.getElementById('icon').classList.add(this.catsKey.icon);
                switch(this.catsKey.id){
                    case 'product':
                            API.ProductcatsGet({}).then(rs => {
                                rs.splice(0,1); this.options = rs;
                            }).catch(error => {console.log(error)});  break;
                    case 'news':
                            API.NewscatsGet({}).then(rs => {
                                rs.splice(0,1); this.options = rs;
                            }).catch(error => {console.log(error)});  break;
                    case 'case':
                            API.CasecatsGet({}).then(rs => {
                                rs.splice(0,1); this.options = rs;
                            }).catch(error => {console.log(error)});  break;
                    case 'download':
                            API.DownloadcatsGet({}).then(rs => {
                                rs.splice(0,1); this.options = rs;
                            }).catch(error => {console.log(error)});  break;
                    case 'video':
                            API.VideocatsGet({}).then(rs => {
                                rs.splice(0,1); this.options = rs;
                            }).catch(error => {console.log(error)});  break;
                    case 'jobs':
                            API.JobscatsGet({}).then(rs => {
                                rs.splice(0,1); this.options = rs;
                            }).catch(error => {console.log(error)});  break;
                    case 'support':
                            API.SupportcatsGet({}).then(rs => {
                                rs.splice(0,1); this.options = rs;
                            }).catch(error => {console.log(error)});  break;
                    default: break;
                }
			},
			submitForm(formName) {
                if(this.catsKey.id == 'news' || this.catsKey.id == 'product' || this.catsKey.id == 'case'){
                    this.Addform.image = [];
                    this.fileList.map(item => { this.Addform.image.push(item.url) })
                }
				this.$refs[formName].validate((valid) => {
					if(valid){
                        switch(this.catsKey.id){
                            case 'product':
                                    API.ProductAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){ this.$message.success('新增成功！'); this.resetForm(formName);}
                                        else{this.$message.success(rs.msg);}
                                    }).catch(error => {cosole.log(error)}); break;
                            case 'news':
                                    API.newsAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){ this.$message.success('新增成功！'); this.resetForm(formName);}
                                        else{this.$message.success(rs.msg);}
                                    }).catch(error => {cosole.log(error)}); break;
                            case 'case':
                                    API.CaseAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){ this.$message.success('新增成功！'); this.resetForm(formName);}
                                        else{this.$message.success(rs.msg);}
                                    }).catch(error => {cosole.log(error)}); break;
                            case 'download':
                                    API.DownAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){ this.$message.success('新增成功！'); this.resetForm(formName);}
                                        else{this.$message.success(rs.msg);}
                                    }).catch(error => {cosole.log(error)}); break;
                            case 'video':
                                    API.VideoAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){ this.$message.success('新增成功！'); this.resetForm(formName);}
                                        else{this.$message.success(rs.msg);}
                                    }).catch(error => {cosole.log(error)}); break;
                            case 'jobs':
                                    API.JobAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){ this.$message.success('新增成功！'); this.resetForm(formName);}
                                        else{this.$message.success(rs.msg);}
                                    }).catch(error => {cosole.log(error)}); break;
                            case 'support':
                                    API.SupportAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){ this.$message.success('新增成功！'); this.resetForm(formName);}
                                        else{this.$message.success(rs.msg);}
                                    }).catch(error => {cosole.log(error)}); break;
                            default: break;
                        }
						
					}else{
                        this.activeName = '2';
						return false;
					}
				})
			},
			resetForm(formName){
				this.$refs[formName].resetFields();
                this.fileList = [];
                this.$refs.Editor.clearTinymce();
			}
        },
        mounted:function(){
            this.getcatsGet();
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
.icon.img:hover {border-color:#19aa8d;}
.icon.img img {width:120px; height:auto; position: absolute; left:50%; top:50%; transform: translate(-50%,-50%)}
</style>