<template>
	<div class="addNotice">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon-gonggao iconfont"></i>公告</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/Notice' }">公告列表</el-breadcrumb-item>
                <el-breadcrumb-item>新增公告</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<el-form :model="Addform" :rules="rules" label-width="150px" ref="Addform" id="addForm" class="el-form">
			<el-collapse v-model="activeName">
				<el-collapse-item title="网页优化" name="1">
					<el-form-item label="网页标题" prop="title">
						<el-input v-model="Addform.title"></el-input>
					</el-form-item>
					<el-form-item label="关键词" prop="word">
						<el-input v-model="Addform.word"></el-input>
					</el-form-item>
					<el-form-item label="描述" prop="intro">
						<el-input v-model="Addform.intro" :rows="5"></el-input>
					</el-form-item>
				</el-collapse-item>
				<el-collapse-item title="添加内容" name="2">
					<el-form-item label="标题" prop="name">
						<el-input v-model="Addform.name"></el-input>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-switch v-model="Addform.status" active-color="#13ce66" inactive-color="#ff4949" active-text="正常" inactive-text="禁用" active-value="1" inactive-value="0">
						</el-switch>
					</el-form-item> 
					<el-form-item label="排序" prop="level">
						<el-input-number :min="0" v-model="Addform.level" controls-position="right"></el-input-number>
						<span>数字越大排位越靠前</span>
					</el-form-item>
					<el-form-item label="封面" prop="image" class='icon'>
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
				<el-button type="primary" @click="addSubmit('Addform')">立即创建</el-button>
				<el-button @click="closeAddNotice">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import editorImage from '@/components/common/editorImage.vue';
	import editor from '../../common/Tinymce/index.vue';
	import API from '../../../api/api';
	export default {
		name: 'addNotice',
		components: { editorImage , editor },
		data() {
			return {
				Keys:{isEditor:false , video:false},
				activeName: '2',
				image:'', 
				content:'',
				dataList:[],
				total:10,
				currentPage:1,
				size:10,
				Addform:{
					name:'',
					title:'',
					word:'',
					intro:'',
					image:'',
					content:'',
					level:0,
					status:'1',
				},
				rules:{
					name: [{required: true, message: '填写公告标题', trigger: 'change'}],
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
			sendToImage(data){
				this.Addform.image = data;
			},
			addSubmit(formName){
				this.$refs[formName].validate((valid) => {
					if(valid){
						API.NoticeAdd(this.Addform).then(rs => {if(rs.code == 1){this.$message.success('公告新建成功！'); this.resetForm(formName);}else{this.$message.error(rs.msg);}}).catch(() => {console.log('NoticeAdd is error!')})
					}else{
						this.activeName = '2'; return false;
					}
				});
			},	
			resetForm(formName){
				this.$refs[formName].resetFields();
				this.$refs.Editor.clearTinymce();
			},
			closeAddNotice(){	
				this.$router.push({path:'/user/Notice'});
			},
		},
		mounted:function(){

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