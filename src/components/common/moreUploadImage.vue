<template>
	<div class="moreuploadimage">
		<el-upload 
		  v-model="fileList"
		  action="/"
		  :multiple = "true"
		  :on-preview="addhandlePreview"
		  :on-remove="addhandleRemove"
		  :file-list="fileList"
		  list-type="picture-card"
		>
		  	<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过600K</div>
		</el-upload>
		<el-button slot="trigger" size="small" type="primary" @click="selectImage">选取图片</el-button>
		<editorImage @successCBK="imageSuccessCBK" ref="images" v-bind:Keys = 'Keys'></editorImage>
		<el-dialog id="el-dialog" :visible.sync="dialogVisible" width="500px">
		  <img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
	</div>
</template>
<script>
	import API from '../../api/api';
	import  util  from '../../api/util.js';
	import editorImage from './editorImage.vue';
		export default {
			components:{ editorImage },
			props:{
				value: { type: Array }
			},
			data(){
				return {
					Keys:{isEditor:false , video:false},
					fileList:[],
					dialogImageUrl:'',
					dialogVisible:false,
				}
			},
			methods:{
				imageSuccessCBK(arr){
					arr.map(item => { this.fileList.push(item) })
					console.log(this.fileList)
					this.$emit('sendToImage', this.fileList);
				},
				selectImage(){
					this.$refs.images.uploadImage();
				},


			    adduploadSuccess(response, file, fileList){
			    	this.disabled = false;
			      	this.$message.success('图片上传成功!');
					  this.fileList = fileList;
					  
					  this.$emit('sendToImage', this.fileList);
			    },
			    addhandlePreview(file){
			    	this.dialogImageUrl = file.url;
	    			this.dialogVisible = true;
			    },
		        addhandleRemove(file,fileList){
		        	this.fileList = fileList;
		        	this.$emit('sendToImage', this.fileList);
		        },
			},
			mounted(){
	            this.fileList = this.value;
	        },
	        watch: {
				'value'(newVal, oldVal) {//监控
					if (newVal !== this.fileList) {
	                    this.fileList = newVal
						console.log(this.fileList)
	                }
	            },
	        }
		}
</script>

<style scoped>
	.el-upload-list.el-upload-list--picture-card {

	}
</style>

