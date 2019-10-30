<template>
	<div class="addLink">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon-mokuaiguanli iconfont"></i>优化设置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/Link' }">友链列表</el-breadcrumb-item>
                <el-breadcrumb-item>新增友链</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<el-form :model="Addform" :rules="rules" label-width="100px" ref="Addform" id="addForm" class="el-form">
				<el-form-item label="标题" prop="name">
					<el-input v-model="Addform.name"></el-input>
				</el-form-item>
				<el-form-item label="链接" prop="url">
					<el-input  placeholder="请输地址" v-model="Addform.url"></el-input>
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
				<el-form-item label="排序" prop="level">
					<el-input-number v-model="Addform.level" :min="0" controls-position="right"></el-input-number>
				</el-form-item>
				<el-form-item label="类型" prop="tid">
					<el-radio v-model="Addform.tid" label="1">文字</el-radio>
					<el-radio v-model="Addform.tid" label="2">图文</el-radio>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-switch v-model="Addform.status" active-color="#13ce66" inactive-color="#ff4949" active-text="正常" inactive-text="禁用" active-value="1" inactive-value="0">
					</el-switch>
				</el-form-item> 
				<el-form-item label="内容" prop="content">
					<editor ref="Editor" v-model="Addform.content"></editor>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addSubmit('Addform')">立即创建</el-button>
					<el-button @click="closeAddLink">取消</el-button>
				</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import editorImage from '@/components/common/editorImage.vue';
	import editor from '../../common/Tinymce/index.vue';
	import API from '../../../api/api';
	export default {
		name: 'addLink',
		components: { editorImage , editor },
		data() {
			var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
			var checkUrl = (rule,value,callback) => {
				value == '' ? callback() : !reg.test(value) ? callback(new Error('请输入正确的网址')) : callback();
			}
			return {
				Keys:{isEditor:false , video:false},
				dataList:[],
				total:10,
				currentPage:1,
				size:10,
				Addform:{
					name:'',
					tid:'1',
					image:'',
					url:'',
					content:'',
					level:0,
					status:'1',
				},
				rules:{
					name: [{required: true, message: '填写友情链接标题', trigger: 'change'}],
					url: [{required:true, trigger:'blur',validator:checkUrl}]
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
				this.$refs[formName].validate((valid) => {
					if(valid){
						API.LinkAdd(this.Addform).then(rs => {if(rs.code == 1){this.$message.success('友情链接新建成功！'); this.resetForm(formName);}else{this.$message.error(rs.msg);}}).catch(() => {console.log('LinkAdd is error!')})
					}
				});
			},
			resetForm(formName){
				this.$refs[formName].resetFields();
                this.$refs.Editor.clearTinymce();
			},	
			closeAddLink(){	
				this.$router.push({path:'/user/Link'});
			},
		},
		mounted:function(){}
	}
</script>

<style scoped>
.el-form {width:90%;display: flex; flex-wrap: wrap; justify-content: space-between; padding-top:30px;}
.el-form-item {width:48%; }
.el-form-item:nth-child(7) {width:100%; }

.icon.img {width:120px; height:120px; border:1px solid #d9d9d9; border-radius: 6px; cursor: pointer; overflow:hidden; position: relative;}
.icon .img:hover {border-color:#19aa8d;}
.icon .img img {width:120px; height:auto; position: absolute; left:50%; top:50%; transform: translate(-50%,-50%)}
</style>