<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i id="icon" class="iconfont"></i>{{catsKey.name}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/'+catsKey.path+'/2' }">{{catsKey.name}}分类</el-breadcrumb-item>
                <el-breadcrumb-item>添加分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :model="Addform" :rules="rules" label-width="150px" ref="Addform" id="addForm">
            <el-collapse v-model="activeName">
                <el-collapse-item title="网页优化" name="1">
                    <el-form-item label="网页标题" prop="title">
                        <el-input v-model="Addform.title"></el-input>	
                    </el-form-item>
                    <el-form-item label="关键字" prop="word">
                        <el-input v-model="Addform.word"></el-input>	
                    </el-form-item>
                    <el-form-item label="描述" prop="intro">
                        <el-input type="textarea"  v-model="Addform.intro" :rows="5"></el-input>	
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="添加内容" name="2">
                    <el-form-item label="父级分类" prop="parentid">
                        <el-cascader v-model="parentid" :clearable="true" placeholder="一级分类" :options="options" :props="props"   change-on-select  @change="handClick"></el-cascader>
                    </el-form-item>
                    <el-form-item label="分类名" prop="name">
                        <el-input v-model="Addform.name"></el-input>
                    </el-form-item>
                    <el-form-item label="图标" prop="icon" class="icon">
                        <div class="icon img">
							<div v-if="Addform.icon" class="img">
								<img :src="Addform.icon">
								<div id="mask">
									<i class="el-icon-circle-plus" @click="appendIcon"></i>
									<i class="el-icon-delete"  @click="Addform.icon = ''"></i>
								</div>
							</div>
							<i v-else @click="appendIcon" class="el-icon-plus avatar-uploader-icon"></i>
						</div>
                    </el-form-item>
                    <el-form-item label="封面" prop="image" class="icon">
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
                    <el-form-item label="内容" prop="content" class="contents">
                        <el-input type="textarea" :rows="5" v-model="Addform.content"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="level" class="level">
                        <el-input-number v-model="Addform.level" :min="0" controls-position="right"></el-input-number>
                        <span>数字越大排位越靠前</span>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-switch
                            v-model="Addform.status"
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
                <el-button type="primary" @click="submitForm('Addform')" style="margin-right:20px;" :disabled="disabled">确认添加</el-button>
                <el-button @click="resetForm('Addform')">重置</el-button>
            </el-form-item>
		</el-form>
    </div>
</template>

<script>
    import editorImage from './editorImage.vue';
    import API from '../../api/api.js';
    export default {
        components:{editorImage},
        props: {
            catsKey:{type:Object,required:true}
        },
        data() {
            return {
               Keys:{isEditor:false , isIcon:false , video:false},
               activeName:['1' , '2'],
               Addform:{
					'parentid':'',
					'name':'',
					'icon' : '',
                    'image':'',
                    'title':'',
					'word':'',
					'intro':'',
					'content':'',
					'level':0,
					'status':'1',
                    'loadings':false,
				},
				rules:{
					name:[{required: true, message: '请输入分类标题', trigger: 'change' }],		
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
                this.Keys.isIcon ? this.Addform.icon = arr[0].url : this.Addform.image = arr[0].url;
            },
            appendIcon(){
                this.Keys.video = false;
                this.Keys.isIcon = true;
                this.$refs.images.uploadImage();
            },
            appendImage(){
                this.Keys.isIcon = false;
                this.$refs.images.uploadImage();
            },
            handClick(val){
				this.Addform.parentid = val[val.length - 1];
			},
			sendToImage(data){
				this.Addform.image = data;
			},
			sendToIcon(data){
				this.Addform.icon = data;
			},
			submitForm(formName) {
                
				this.$refs[formName].validate((valid) => {
					if(valid){
                        this.disabled = true;
                        console.log(this.catsKey , this.catsKey.id)
                        switch(this.catsKey.id){
                            case 'product':
                                    API.ProductcatsAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){this.$message.success('添加成功！');this.resetForm('Addform');this.CatsGet({});}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {}); break;
                            case 'news':
                                    API.newscatsAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){this.$message.success('添加成功！');this.resetForm('Addform');this.CatsGet({});}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {}); break;
                            case 'case':
                                    API.CasecatsAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){this.$message.success('添加成功！');this.resetForm('Addform');this.CatsGet({});}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {}); break; 
                            case 'download':
                                    API.DowncatsAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){this.$message.success('添加成功！');this.resetForm('Addform');this.CatsGet({});}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {}); break;    
                            case 'video':
                                    API.VideocatsAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){this.$message.success('添加成功！');this.resetForm('Addform');this.CatsGet({});}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {}); break;  
                            case 'jobs':
                                    API.JobcatsAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){this.$message.success('添加成功！');this.resetForm('Addform');this.CatsGet({});}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {}); break;   
                            case 'support':
                                    API.SupportcatsAdd(this.Addform).then(rs => {
                                        if(rs.code == 1){this.$message.success('添加成功！');this.resetForm('Addform');this.CatsGet({});}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {}); break;
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
				this.parentid = [];
            },
            CatsGet(params){
                document.getElementById('icon').classList.add(this.catsKey.icon);
                switch(this.catsKey.id){
                    case 'product':
                        API.ProductcatsGet(params).then(rs => { this.options = rs;}).catch(error => {console.log(error)});break;
                    case 'news':
                        API.NewscatsGet(params).then(rs => {this.options = rs;}).catch(error => {console.log(error)});break;
                    case 'case':
                        API.CasecatsGet(params).then(rs => {this.options = rs; console.log(this.options)}).catch(error => {console.log(error)});break;
                    case 'download':
                        API.DownloadcatsGet(params).then(rs => {this.options = rs;}).catch(error => {console.log(error)});break;
                    case 'video':
                        API.VideocatsGet(params).then(rs => {this.options = rs;}).catch(error => {console.log(error)});break;
                    case 'jobs':
                        API.JobscatsGet(params).then(rs => {this.options = rs;}).catch(error => {console.log(error)});break;
                    case 'support':
                        API.SupportcatsGet(params).then(rs => {this.options = rs;}).catch(error => {console.log(error)});break; 
                    default: break;
                }
            },
        },
        mounted:function(){
			this.CatsGet({});
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