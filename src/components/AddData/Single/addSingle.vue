<template>
	<div class="addSingle">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon-danye iconfont"></i>单页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/Single' }">单页列表</el-breadcrumb-item>
                <el-breadcrumb-item>新增单页</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<el-form :model="Addform" :rules="rules" label-width="150px" ref="Addform" id="addForm"> 
			<el-collapse v-model="activeName">
				<el-collapse-item title="网页优化" name="1">
					<el-form-item label="网页标题" prop="title" class="title">
						<el-input v-model="Addform.title"></el-input>
					</el-form-item>
					<el-form-item label="关键字" prop="word" class="word">
						<el-input v-model="Addform.word"></el-input>
					</el-form-item>
					<el-form-item label="描述" prop="intro" class="intro">
						<el-input type="textarea" v-model="Addform.intro" :rows="5"></el-input>
					</el-form-item>
				</el-collapse-item>
				<el-collapse-item title="添加内容" name="2">
					<el-form-item label="标题" prop="name">
						<el-input v-model="Addform.name"></el-input>
					</el-form-item>
					<el-form-item label="路径名" prop="url_name">
						<el-input v-model="Addform.url_name" ></el-input>
					</el-form-item>
					<el-form-item label="模板名" prop="tpl_name">
						<el-input v-model="Addform.tpl_name" placeholder="默认模板名为 index"></el-input>
					</el-form-item>
					
					<el-form-item label="排序" prop="level" class="level">
						<el-input-number v-model="Addform.level" :min="0" controls-position="right"></el-input-number>
						<span>数字越大排位越靠前</span>
					</el-form-item>
					<el-form-item label='推荐' prop="recommend" class="recommend">
						<el-switch v-model="Addform.recommend" active-color="#13ce66" inactive-color="#ff4949" active-text="推荐" inactive-text="不推荐" active-value="1" inactive-value="0"></el-switch>
					</el-form-item>
					<el-form-item label="状态" prop="status" class="status">
						<el-switch v-model="Addform.status" active-color="#13ce66" inactive-color="#ff4949" active-text="正常" inactive-text="禁用" active-value="1" inactive-value="0"></el-switch>
					</el-form-item>
					<el-form-item label="封面" prop="image" class="contentdesc icon">
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
					<el-form-item label="内容" prop="content" class="desc">
						<editor ref="Editor" v-model="Addform.content"></editor>
					</el-form-item>
				</el-collapse-item>
			</el-collapse>
			 	<el-form-item class="last-item">
				    <el-button type="primary" @click="submitForm('Addform')">立即创建</el-button>
				    <el-button @click="resetForm('Addform')">重置</el-button>
			  	</el-form-item>
			</el-form>
	</div>
</template>
<script>
	import editorImage from '@/components/common/editorImage.vue';
	import editor from '../../common/Tinymce/index.vue';
	import API from '../../../api/api';
	import  util  from '../../../api/util.js';
	export default {
		name: 'addSingle',
		components: { editorImage , editor },
		data() {
			var Regex = /^[a-z0-9]{3,20}$/;
			var checkName = (rule, value, callback) =>{
				value == '' ? callback() : !Regex.test(value) ? callback(new Error('请输入字符为a-z,数字0-9的3到20内的字符组合')) : value==='index' ? callback(new Error('路径名不可为"index"')) : callback();
			}
			var checkName1 = (rule, value, callback) =>{
				value == '' ? callback() : !Regex.test(value) ? callback(new Error('请输入字符为a-z,数字0-9的3到20内的字符组合')) : callback();
            }
			return {
				Keys:{isEditor:false , video:false},
				activeName:'2',
				image:'', 
				content:'',
				Addform:{
					name:'',
					url_name:'',
					tpl_name:'index',
					image:'',
					content:'',
					recommend:'0',
					level:0,
					status:'1',
					word:'',
					title:'',
					intro:'',
				},
				rules:{
					name:[{required: true, message: '请输入单页标题', trigger: 'change' }],
					url_name:[{ required: true, validator: checkName, trigger: 'change' }],
      				tpl_name:[{validator: checkName1,trigger: 'change'}],
					content:[{required: true, message: '请输入内容', trigger: 'change' }],
                    content: [{required: true, message: '内容不能为空' , trigger: 'blur'}],
				},
				
			}		
		},
		methods: {
			imageSuccessCBK(arr){
                this.Addform.image = arr[0].url;
            },
            appendImage(){
                this.$refs.images.uploadImage();
            },
			submitForm(formName){
				this.$refs[formName].validate((valid) => {
					if(valid){
						API.SingleAdd(this.Addform).then(rs => {
							if(rs.code == 1){
								this.$message.success('添加成功！');
								this.resetForm(formName);	
							}else if(rs.msg == 'ILLEGAL_URL_NAME_EXIST'){
								this.$message.error('错误：路径名已经存在了，请从新设置新的路径名！')
							}else{
								this.$message.error(rs.msg);
							}
						}).catch(() => {})
					}else{this.activeName = '2'; return false;}
				})
			},
			resetForm(formName){
				this.$refs[formName].resetFields();
				this.$refs.Editor.clearTinymce();
			},
		},
		mounted:function(){}

	}
</script>
<style scoped>
.el-form {width:98%; margin:0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; ;}
@media screen and (max-width:1600px){
    .el-form {width:90%;}
}
.el-form-item {width:80%; }
.el-form-item.image{width:100%;}
.el-form-item.desc{width:100%;}
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