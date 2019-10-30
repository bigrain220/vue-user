<template>
	<div>
		<el-upload 
			class="avatar-uploader"
			id="avatar-uploader"
			:action="uploadParam.host"
			:data = 'imgData'
			:show-file-list="false"
			:on-success="uploadSuccess"
			:on-error="uploadError"
			:before-upload="beforeUpload"
			:on-change="handlefileChange"></el-upload>
		<el-row v-loading="quillUpdateImg">
			<quill-editor
				v-model="content"
				ref="myQuillEditor"
				:options="editorOption"
				@change="onEditorChange($event)"></quill-editor>
		</el-row>
	</div>
</template>
<script>
	// import {ossGet} from '../../api/api';
	import API from '../../api/api';
	import  util  from '../../api/util.js';
	import {quillEditor} from 'vue-quill-editor';
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	// 工具栏配置
	const toolbarOptions = [
	  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
	  ['blockquote', 'code-block'],

	  [{'header': 1}, {'header': 2}],               // custom button values
	  [{'list': 'ordered'}, {'list': 'bullet'}],
	  [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
	  [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
	  [{'direction': 'rtl'}],                         // text direction

	  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
	  [{'header': [1, 2, 3, 4, 5, 6, false]}],

	  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
	  [{'font': []}],
	  [{'align': []}],
	  ['link', 'image'],
	  ['clean']                                         // remove formatting button
	]
	export default{
		components: {
            quillEditor
        },
        props:{
        	value: { type: String }
        },
		data(){
			return{
				uploadParam:{
					name:'',
					accessid:'',
					host:'',
					expire:0,
					dir:'',
					callback:'',
					policy:'',
					signature:''
				},
				imgData:{
					key:'',
					policy:'',
					OSSAccessKeyId:'',
					success_action_status:200,
					signature:'',
					callback:''
				},
				quillUpdateImg:false,
				content:'',
				editorOption:{
					placeholder:'',
					theme:'snow',
					modules:{
						toolbar:{
							container:toolbarOptions, //工具栏
							handlers:{
								'image':function(value){
									if(value){
										document.querySelector('#avatar-uploader input').click();
									}else{
										this.quill.format('image',false);
									}
								}
							}
						}
					}
				},
			}
		},
		methods:{
			beforeUpload(file){
				this.quillUpdateImg = true;
				const isImage =( file.type === 'image/jpeg' || file.type === 'image/png');
			    const isLt2M = file.size / 1024 / 1024 < 0.6;
				if (!isImage) {
		         	this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
		         	this.quillUpdateImg = false;
		        	return false;
		        }else if (!isLt2M) {
		          	this.$message.error('上传头像图片大小不能超过 600K!');
		          	this.quillUpdateImg = false;
		        	return false;
		        }else{
		        	if(this.uploadParam.expire < Date.parse(new Date()) / 1000 + 3){
		        		return API.ossGet({}).then(rs => {
							this.uploadParam.accessid = rs.accessid;
							this.uploadParam.host = rs.host;
							this.uploadParam.expire = rs.expire;
							this.uploadParam.dir = rs.dir;
							this.uploadParam.callback = rs.callback;
							this.uploadParam.policy = rs.policy;
							this.uploadParam.signature = rs.signature;
							this.imgData = {
								'key' : this.uploadParam.dir + this.uploadParam.name,
								'policy' : this.uploadParam.policy,
								'OSSAccessKeyId' : this.uploadParam.accessid,
								'success_action_status':200,
								'signature' : this.uploadParam.signature,
								'callback' : this.uploadParam.callback
							};
		        		}).catch(() => {console.log('error');})
		        	}else{
		        		return	this.imgData.key = this.uploadParam.dir + this.uploadParam.name;
		        	}
		        }
			},
			uploadSuccess(res,file){
		        const imageUrl = this.uploadParam.host + '/' + this.imgData.key + '?x-oss-process=image/resize,m_lfit,h_500,w_500';
		        let quill = this.$refs.myQuillEditor.quill;//初始化
		        if(res.Status === 'OK'){
		        	let length = quill.getSelection().index;// 获取光标所在位置
		        	quill.insertEmbed(length, 'image', imageUrl);// 插入图片  imageUrl为服务器返回的图片地址
		        	quill.setSelection(length + 1);// 调整光标到最后
		        	this.$message.success('封面上传成功！');
		        }else{ this.$message.error('图片插入失败')}
		        this.quillUpdateImg = false;
			},
			uploadError(res,file){
				this.$message.warning('服务器开了点点小差，请重试');
			},
			handlefileChange(file){
				if(file.status == 'ready'){
					file.name = util.random_string(10)+util.get_suffix(file.name) ;
					this.uploadParam.name = file.name;
		    	}
			},
			onEditorChange({quill, html, text}){
				this.$emit('input', this.content)
			},
		},
		computed:{
		 	editor() {
                return this.$refs.myQuillEditor.quill;
            }
		},
		mounted(){
            this.content = this.value;
        },
        watch: {
            'value'(newVal, oldVal) {
                if (this.editor) {
                    if (newVal !== this.content) {
                        this.content = newVal
                    }
                }
            },
        }
	}
</script>
<style scoped>
	.avatar-uploader {display: none;}
</style>