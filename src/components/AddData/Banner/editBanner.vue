<template>
	<div class="eidtBanner">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon-guanggao iconfont"></i>广告</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/Banner' }">广告列表</el-breadcrumb-item>
                <el-breadcrumb-item>编辑广告</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<el-form :model="Editform" :rules="rules" label-width="100px" ref="Editform" id="addForm" class="el-form">
			<el-form-item label="标题" prop="name"><el-input v-model="Editform.name"></el-input></el-form-item>
			<el-form-item label="链接" prop="url"><el-input  placeholder="请输地址" v-model="Editform.url"></el-input></el-form-item>
			<el-form-item label="组名" prop="group"><el-input  v-model="Editform.group"></el-input></el-form-item>
			<el-form-item label="排序" prop="level"><el-input-number :min="0" v-model="Editform.level" controls-position="right"></el-input-number></el-form-item>
			<el-form-item label="封面" prop="image">
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
			<el-form-item label="状态" prop="status"><el-switch v-model="Editform.status" active-color="#13ce66" inactive-color="#ff4949" active-text="正常" inactive-text="禁用" active-value="1" inactive-value="0"></el-switch></el-form-item>
			<el-form-item label="描述" prop="Editform">
				<editor ref="myQuillEditor" v-model="Editform.content"></editor>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="editSubmit('Editform')">确认修改</el-button>
				<el-button @click="closeEditBanner">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import editorImage from '@/components/common/editorImage.vue';
	import editor from '../../common/Tinymce/index.vue';
	import API from '../../../api/api';
	export default {
		name: 'eidtBanner',
		components: { editor, editorImage},
		data() {
			return {
				Keys:{isEditor:false , video:false},
				Editform:{
					name:'',
					image:'',
					url:'',
					group:'',
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
                this.Editform.image = arr[0].url;
            },
            appendImage(){
                this.$refs.images.uploadImage();
			},
			getBannerlist(id){
				API.BannerList({id:id}).then(rs => {
					this.Editform = rs.rows[0];
				}).catch(() => {})
			},
			editSubmit(formName){
				this.Editform.desc = this.content;
				this.$refs[formName].validate((valid) => {
					if(valid){
						API.BannerEdit(this.Editform).then(rs => {if(rs.code == 1){this.$message.success('Banner修改成功！'); this.$router.go(-1)}else{this.$message.error(rs.msg);}}).catch(() => {console.log('BannerEdit is error!')})
					}
				});
			},
			closeEditBanner(){
				this.$router.push({path:'/user/Banner'});
			},
		},
		mounted:function(){
			this.getBannerlist(this.$route.params.editId);
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