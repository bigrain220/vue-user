<template>
	<div class="eidtNotice">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon-gonggao iconfont"></i>公告</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/Notice' }">公告列表</el-breadcrumb-item>
                <el-breadcrumb-item>编辑公告</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<el-form :model="Editform" :rules="rules" label-width="150px" ref="Editform" id="addForm" class="el-form">
			<el-collapse v-model="activeName">
				<el-collapse-item title="网页优化" name="1">
					<el-form-item label="网页标题" prop="title">
						<el-input v-model="Editform.title"></el-input>
					</el-form-item>
					<el-form-item label="关键词" prop="word">
						<el-input v-model="Editform.word"></el-input>
					</el-form-item>
					<el-form-item label="描述" prop="intro">
						<el-input v-model="Editform.intro" :rows="5"></el-input>
					</el-form-item>
				</el-collapse-item>
				<el-collapse-item title="添加内容" name="2">
					<el-form-item label="标题" prop="name">
						<el-input v-model="Editform.name"></el-input>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-switch v-model="Editform.status" active-color="#13ce66" inactive-color="#ff4949" active-text="正常" inactive-text="禁用" active-value="1" inactive-value="0">
						</el-switch>
					</el-form-item> 
					<el-form-item label="排序" prop="level">
						<el-input-number :min="0" v-model="Editform.level" controls-position="right"></el-input-number>
						<span>数字越大排位越靠前</span>
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
					<el-form-item label="内容" prop="content" class="desc">
						<editor ref="myQuillEditor" v-model="Editform.content"></editor>
					</el-form-item>
				</el-collapse-item>
			</el-collapse>
			<el-form-item class="last-item">
				<el-button type="primary" @click="editSubmit('Editform')">确认修改</el-button>
				<el-button @click="closeEditNotice">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import editorImage from '@/components/common/editorImage.vue';
	import editor from '../../common/Tinymce/index.vue';
	import API from '../../../api/api';
	export default {
		name: 'eidtNotice',
		components: { editor, editorImage},
		data() {
			var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
			var checkUrl = (rule,value,callback) => {
				value == '' ? callback() : !reg.test(value) ? callback(new Error('请输入正确的网址')) : callback();
			}
			return {
				Keys:{isEditor:false , video:false},
				activeName:'2',
				image:'',
				content:'',
				Editform:{
					id:'',
					name:'',
					title:'',
					image:'',
					intro:'',
					word:'',
					content:'',
					level:0,
					status:'1',
				},
				rules:{
					name: [{required: true, message: '填写友情链接标题', trigger: 'change'}],
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
			sendToImage(data){
				this.Editform.image = data;
			},
			getNoticelist(id){
				API.NoticeList({id:id}).then(rs => {
					this.Editform = rs.rows[0];
				}).catch(() => {})
			},
			editSubmit(formName){
				this.Editform.desc = this.content;
				this.$refs[formName].validate((valid) => {
					if(valid){
						API.NoticeEdit(this.Editform).then(rs => {if(rs.code == 1){this.$message.success('友情链接修改成功！'); this.$router.go(-1)}else{this.$message.error(rs.msg);}}).catch(() => {console.log('NoticeEdit is error!')})
					}else{
						this.activeName = '2'; return false;
					}
				});
			},
			closeEditNotice(){
				this.$router.push({path:'/user/Notice'});
			},
		},
		mounted:function(){
			this.getNoticelist(this.$route.params.editId);
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