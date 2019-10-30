<template>
	<div class="addBanner">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon-guanggao iconfont"></i>广告</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/Banner' }">广告列表</el-breadcrumb-item>
                <el-breadcrumb-item>新增广告</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<el-form :model="Addform" :rules="rules" label-width="100px" ref="Addform" id="addForm" class="el-form">
			<el-form-item label="标题" prop="name">
				<el-input v-model="Addform.name"></el-input>
			</el-form-item>
			<el-form-item label="链接" prop="url">
				<el-input  placeholder="请输地址" v-model="Addform.url"></el-input>
			</el-form-item>
			<el-form-item label="组名" prop="group"><el-input  v-model="Addform.group"></el-input></el-form-item>
			<el-form-item label="排序" prop="level">
				<el-input-number v-model="Addform.level" :min="0" controls-position="right"></el-input-number>
			</el-form-item>
			<el-form-item label="封面" prop="image">
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
			<el-form-item label="状态" prop="status">
                <el-switch v-model="Addform.status" active-color="#13ce66" inactive-color="#ff4949" active-text="正常" inactive-text="禁用" active-value="1" inactive-value="0">
				</el-switch>
			</el-form-item> 
			<el-form-item label="描述" prop="content" >
				<editor ref="Editor" v-model="Addform.content"  @input="(content) => Addform.content = content"></editor>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="addSubmit('Addform')">立即创建</el-button>
				<el-button @click="closeAddBanner">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import editorImage from '@/components/common/editorImage.vue';
	import editor from '../../common/Tinymce/index.vue';
	import API from '../../../api/api';
	export default {
		name: 'addBanner',
		components: { editorImage , editor },
		data() {
			return {
				Keys:{isEditor:false , video:false},
				image:'',
				content:'',
				dataList:[],
				Addform:{
					name:'',
					image:'',
					group:'',
					url:'',
					content:'',
					level:0,
					status:'1',
				},
				rules:{
					name: [{required: true, message: '填写广告标题', trigger: 'change'}],
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
			addSubmit(formName){
				this.Addform.desc = this.content;
				this.$refs[formName].validate((valid) => {
					if(valid){
						console.log(this.Addform);
						API.BannerAdd(this.Addform).then(rs => {if(rs.code == 1){this.$message.success('Banner新建成功！');this.resetForm(formName);}else{this.$message.error(rs.msg);}}).catch(() => {console.log('BannerAdd is error!')})
					}
				});
			},
			resetForm(formName){
				this.$refs[formName].resetFields();
                this.$refs.Editor.clearTinymce();
			},	
			closeAddBanner(){	
				this.$router.push({path:'/user/Banner'});
			},
		},
		mounted:function(){

		}
	}
</script>
<style scoped>
    .el-form {width:90%;  display: flex; flex-wrap: wrap; justify-content: space-between; padding-top:30px;}
	.el-form-item:nth-child(7) {width:100%}	
	.el-form-item {width:48%; }
	
	.icon.img {width:120px; height:120px; border:1px solid #d9d9d9; border-radius: 6px; cursor: pointer; overflow:hidden; position: relative;}
	.icon.img:hover {border-color:#19aa8d;}
	.icon.img img {width:120px; height:auto; position: absolute; left:50%; top:50%; transform: translate(-50%,-50%)}
	
</style>