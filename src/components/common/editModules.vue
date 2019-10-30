<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i id="icon" class="iconfont"></i> {{catsKey.name}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/'+catsKey.path+'/1' }">{{catsKey.name}}列表</el-breadcrumb-item>
                <el-breadcrumb-item>编辑{{catsKey.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<el-form :model="Editform" :rules="rules" label-width="150px" ref="Editform" id="editform">
				<el-collapse v-model="activeName">
                    <el-collapse-item title="网页优化" name="1">
                        <el-form-item  label="网页标题" prop="title" class="title">
                            <el-input v-model="Editform.title"></el-input>
                        </el-form-item>
                        <el-form-item label="关键字" prop="word" class="word">
                            <el-input  v-model="Editform.word"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="intro"  class="intro">
                            <el-input type="textarea" v-model="Editform.intro" :rows="5"></el-input>
                        </el-form-item>
                    </el-collapse-item>
                    <el-collapse-item title="添加内容" name="2">
                        <el-form-item  :label="labelTitle" prop="name">
                            <el-input v-model="Editform.name"></el-input>
                        </el-form-item>
                        <el-form-item :label="labelCats" prop="Cids">
                            <el-cascader v-if="Editform.Cids" v-model="Editform.Cids" placeholder="请选择" :clearable="true" :options="options" :props="props"   change-on-select  @change="handClick"></el-cascader>
                            <el-cascader v-else></el-cascader>	
                        </el-form-item>
                        <el-form-item label="排序" prop="level" class="level">
                            <el-input-number :min = "0" v-model="Editform.level" controls-position="right"></el-input-number>
                            <span>数字越大排位越靠前</span>
                        </el-form-item>
                        <el-form-item  label='推荐' prop="recommend" class="recommend"> 
                            <el-switch v-model="Editform.recommend" active-color="#13ce66" inactive-color="#ff4949" active-text="推荐" inactive-text="不推荐" active-value="1" inactive-value="0"> </el-switch>
                        </el-form-item>
                        <el-form-item label="状态" prop="status" class="status">
                            <el-switch  v-model="Editform.status" active-color="#13ce66" inactive-color="#ff4949" active-text="正常" inactive-text="禁用" active-value="1" inactive-value="0"></el-switch>
                        </el-form-item>
                        <el-form-item v-if="$route.name === 'editVideo'" label="路径" prop="url">
                            <el-input  placeholder="请输入视频地址  例：http://www.51g3.com/uploads/works.mp4 或 https://www.51g3.com/uploads/works.mp4" v-model="Editform.url"  clearable></el-input>
                            <el-button type="primary" @click="appendVideo" size="small">添加视频</el-button>
                        </el-form-item>
                        <el-form-item v-if="$route.name === 'editDown'" label="路径" prop="url">
                            <el-input  placeholder="请输地址" v-model="Editform.url"  clearable></el-input>
                        </el-form-item>
                        <el-form-item  v-if="$route.name === 'editJob'" label="工作地点" prop="location">
                            <el-input v-model="Editform.location"></el-input>
                        </el-form-item>
                        <el-form-item  v-if="$route.name === 'editJob'" label="薪资待遇" prop="salary">
                            <el-input v-model="Editform.salary"></el-input>
                        </el-form-item>
                        <el-form-item  v-if="$route.name === 'editJob'" label="招聘人数" prop="number" class="number">
                            <el-input-number v-model="Editform.number" controls-position="right" :min="1"></el-input-number><span style="padding-left:10px;">人</span>
                        </el-form-item>
                        <el-form-item v-if="$route.name === 'editProduct'" :label="labelModel" prop="model">
                            <el-input type="textarea" :rows="2" v-model="Editform.model" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
                        </el-form-item>
                        <el-form-item v-if="$route.name === 'editProduct'" :label="labelSpec" prop="spec">
                            <el-input type="textarea" :rows="2" v-model="Editform.spec" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
                        </el-form-item>
                        <el-form-item class="retail_price" v-if="$route.name === 'editProduct'" label="市场价" prop="retail_price">
                            <span>￥ </span><el-input-number :step="10" :precision="2" :min = "0" v-model="Editform.retail_price" controls-position="right"></el-input-number>
                        </el-form-item>
                        <el-form-item class="price" v-if="$route.name === 'editProduct'" label="优惠价" prop="price">
                            <span>￥ </span><el-input-number :step="10" :precision="2" :min = "0" v-model="Editform.price" controls-position="right" ></el-input-number>
                        </el-form-item>
                        <el-form-item class="image" v-if="$route.name === 'editNews' || $route.name === 'editProduct' || $route.name === 'editCase'" :label="labelImage" prop="image">
                            <elUpload v-model="fileList" v-on:sendToImage="sendToImage"></elUpload>
                        </el-form-item>
                        <el-form-item class="singleimage" v-if="$route.name === 'editDown' || $route.name === 'editJob' || $route.name === 'editSupport' || $route.name === 'editVideo'" :label="labelImage" prop="image">
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
                            <el-form-item class="contentdesc" label="内容" prop="content">
                                <editor ref="myQuillEditor" v-model="Editform.content" @input="(content , id) => {Editform.content = content; catsKey.id = id}"></editor>
                            </el-form-item>
                        </el-collapse-item>
                </el-collapse> 
			 	<el-form-item  class="last-item">
				    <el-button type="primary" @click="submitForm('Editform')" :disabled="disabled" style="margin-right:20px;">修改</el-button>
				    <router-link :to="{ path: '/user/'+catsKey.path+'/1' }"><el-button>返回</el-button></router-link>
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
        components: { editor , elUpload , editorImage},
        props: {
            catsKey:{type:Object,required:true}
        },
		data() {
            var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
			var checkUrl = (rule,value,callback) => {
				value == '' ? callback() : !reg.test(value) ? callback(new Error('请输入正确的网址')) : callback();
			}
			return {
                Keys:{isEditor:false,video:false },
                dialogImageUrl:'',
				dialogVisible:false,
                activeName: '2',
				fileList:[],
                images:[],
			    bigImage:'',
				Editform:{
					'id':'',
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
                    url: [{required: true, trigger: 'change',validator:checkUrl}],
				},
				options:[],
				props: {
					value: 'id',
					label:'name',
					children: 'children'
				},
                parentid:[],
                disabled:false,
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
               this.Keys.video ? this.Editform.url = arr[0].url : this.Editform.image = arr[0].url;
            },
            sendToImage(data){
				this.fileList = data;
            },
            sendToImage2(data){
                this.Editform.image = data;
            },

			handClick(val){
				if(val.length == 0){
					this.Editform.cid = '0';
				}else{
					this.Editform.cid = val[val.length - 1];
                }
			},
			getEdit(id){
                document.getElementById('icon').classList.add(this.catsKey.icon);
                const params = {id:id};
                console.log(this.catsKey , this.$route.name);
                switch(this.$route.name){
                    case 'editProduct':
                        API.ProductList(params).then(rs => {
                            this.getCats();
                            this.Editform.id = rs.rows[0].id;
                            this.Editform.cid = rs.rows[0].cid;
                            this.Editform.name = rs.rows[0].name;
                            this.Editform.word = rs.rows[0].word;
                            this.Editform.title = rs.rows[0].title;
                            this.Editform.intro = rs.rows[0].intro;
                            this.Editform.content = rs.rows[0].content;
                            this.Editform.recommend = rs.rows[0].recommend;
                            this.Editform.level = Number(rs.rows[0].level);
                            this.Editform.status = rs.rows[0].status;
                            this.Editform.image = [];
                            this.fileList = rs.rows[0].imgs;
                            this.images = rs.rows[0].imgs;
                            this.Editform.model = rs.rows[0].model;
                            this.Editform.spec = rs.rows[0].spec;
                            this.Editform.retail_price = rs.rows[0].retail_price;
                            this.Editform.price = rs.rows[0].price;
                            this.parentid = rs.rows[0].arrparentid.split(',').splice(1);
                            this.parentid.forEach((ele , index) => {
                                this.Editform.Cids[index] = Number(ele);
                            })
                        }).catch(error => {console.log(error)}); break;
                    case 'editNews':
                        API.newsList(params).then(rs => {
                            this.getCats();
                            this.Editform.id = rs.rows[0].id;
                            this.Editform.cid = rs.rows[0].cid;
                            this.Editform.name = rs.rows[0].name;
                            this.Editform.word = rs.rows[0].word;
                            this.Editform.title = rs.rows[0].title;
                            this.Editform.intro = rs.rows[0].intro;
                            this.Editform.content = rs.rows[0].content;
                            this.Editform.recommend = rs.rows[0].recommend;
                            this.Editform.level = Number(rs.rows[0].level);
                            this.Editform.status = rs.rows[0].status;
                            this.Editform.image = [];
                            this.fileList = rs.rows[0].imgs;
                            this.images = rs.rows[0].imgs;
                            this.parentid = rs.rows[0].arrparentid.split(',').splice(1);
                            this.parentid.forEach((ele , index) => {
                                this.Editform.Cids[index] = Number(ele);
                                console.log(this.Editform.Cids)
                            })
                        }).catch(error => {console.log(error)}); break;
                    case 'editCase':
                        API.CaseList(params).then(rs => {
                            this.getCats();
                            this.Editform.id = rs.rows[0].id;
                            this.Editform.cid = rs.rows[0].cid;
                            this.Editform.name = rs.rows[0].name;
                            this.Editform.word = rs.rows[0].word;
                            this.Editform.title = rs.rows[0].title;
                            this.Editform.intro = rs.rows[0].intro;
                            this.Editform.content = rs.rows[0].content;
                            this.Editform.recommend = rs.rows[0].recommend;
                            this.Editform.level = Number(rs.rows[0].level);
                            this.Editform.status = rs.rows[0].status;
                            this.Editform.image = [];
                            this.fileList = rs.rows[0].imgs;
                            this.images = rs.rows[0].imgs;
                            this.parentid = rs.rows[0].arrparentid.split(',').splice(1);
                            this.parentid.forEach((ele , index) => {
                                this.Editform.Cids[index] = Number(ele);
                            })
                        }).catch(error => {console.log(error)}); break;
                    case 'editDown':
                        API.DownList(params).then(rs => {
                            this.getCats();
                            this.Editform.id = rs.rows[0].id;
                            this.Editform.cid = rs.rows[0].cid;
                            this.Editform.name = rs.rows[0].name;
                            this.Editform.word = rs.rows[0].word;
                            this.Editform.title = rs.rows[0].title;
                            this.Editform.intro = rs.rows[0].intro;
                            this.Editform.content = rs.rows[0].content;
                            this.Editform.recommend = rs.rows[0].recommend;
                            this.Editform.level = Number(rs.rows[0].level);
                            this.Editform.status = rs.rows[0].status;
                            this.Editform.image = rs.rows[0].image;
                            this.bigImage = rs.rows[0].image;
                            this.Editform.url = rs.rows[0].url;
                            this.parentid = rs.rows[0].arrparentid.split(',').splice(1);
                            this.parentid.forEach((ele , index) => {
                                this.Editform.Cids[index] = Number(ele);
                            })

                        }).catch(error => {console.log(error)}); break;
                    case 'editVideo':
                        API.VideoList(params).then(rs => {
                            this.getCats();
                            this.Editform.id = rs.rows[0].id;
                            this.Editform.cid = rs.rows[0].cid;
                            this.Editform.name = rs.rows[0].name;
                            this.Editform.word = rs.rows[0].word;
                            this.Editform.title = rs.rows[0].title;
                            this.Editform.intro = rs.rows[0].intro;
                            this.Editform.content = rs.rows[0].content;
                            this.Editform.recommend = rs.rows[0].recommend;
                            this.Editform.level = Number(rs.rows[0].level);
                            this.Editform.status = rs.rows[0].status;
                            this.Editform.image = rs.rows[0].image;
                            this.bigImage = rs.rows[0].image;
                            this.Editform.url = rs.rows[0].url;
                            this.parentid = rs.rows[0].arrparentid.split(',').splice(1);
                            this.parentid.forEach((ele , index) => {
                                this.Editform.Cids[index] = Number(ele);
                            });

                        }).catch(error => {console.log(error)}); break;
                    case 'editJob':
                        API.JobList(params).then(rs => {
                            this.getCats();
                            this.Editform.id = rs.rows[0].id;
                            this.Editform.cid = rs.rows[0].cid;
                            this.Editform.name = rs.rows[0].name;
                            this.Editform.word = rs.rows[0].word;
                            this.Editform.title = rs.rows[0].title;
                            this.Editform.intro = rs.rows[0].intro;
                            this.Editform.content = rs.rows[0].content;
                            this.Editform.recommend = rs.rows[0].recommend;
                            this.Editform.level = Number(rs.rows[0].level);
                            this.Editform.status = rs.rows[0].status;
                            this.Editform.image = rs.rows[0].image;
                            this.bigImage = rs.rows[0].image;
                            this.Editform.location = rs.rows[0].location;
                            this.Editform.salary = rs.rows[0].salary;
                            this.Editform.number = rs.rows[0].number;                           
                            this.parentid = rs.rows[0].arrparentid.split(',').splice(1);
                            this.parentid.forEach((ele , index) => {
                                this.Editform.Cids[index] = Number(ele);
                            })
                        }).catch(error => {console.log(error)}); break;
                    case 'editSupport':
                        API.SupportList(params).then(rs => {
                            this.getCats();
                            this.Editform.id = rs.rows[0].id;
                            this.Editform.cid = rs.rows[0].cid;
                            this.Editform.name = rs.rows[0].name;
                            this.Editform.word = rs.rows[0].word;
                            this.Editform.title = rs.rows[0].title;
                            this.Editform.intro = rs.rows[0].intro;
                            this.Editform.content = rs.rows[0].content;
                            this.Editform.recommend = rs.rows[0].recommend;
                            this.Editform.level = Number(rs.rows[0].level);
                            this.Editform.status = rs.rows[0].status;
                            this.Editform.image = rs.rows[0].image;
                            this.bigImage = rs.rows[0].image;
                            this.parentid = rs.rows[0].arrparentid.split(',').splice(1);
                            this.parentid.forEach((ele , index) => {
                                this.Editform.Cids[index] = Number(ele);
                            })
                        }).catch(error => {console.log(error)}); break; 

                    default: break;
                }
				
			},
			getCats(){
                switch(this.$route.name){
                    case 'editProduct':
                        API.ProductcatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    case 'editNews':
                        API.NewscatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    case 'editCase':
                        API.CasecatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    case 'editDown':
                        API.DownloadcatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    case 'editVideo':
                        API.VideocatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    case 'editJob':
                        API.JobscatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    case 'editSupport':
                        API.SupportcatsGet({}).then(rs => {
                            rs.splice(0,1);
                            this.options = rs;
                        }).catch(error => {console.log(error)}); break;
                    default: break;
                }
			},
			submitForm(formName) {
                if(this.$route.name == 'editNews' || this.$route.name == 'editProduct' || this.$route.name == 'editCase'){
                    this.Editform.image = [];
                    this.fileList.map(item => { this.Editform.image.push(item.url) })
                    if(this.Editform.image.length == 0){
                       this.Editform.image[0] = '';
                       }
                }
                console.log(this.Editform,'111')


				this.$refs[formName].validate((valid) => {
					if(valid){
                        this.disabled = true;
                        switch(this.$route.name){
                            case 'editProduct':
                                    API.ProductEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！'); this.$router.go(-1)}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {console.log(error)});  break;
                                    console.log(this.Editform)
                            case 'editNews':
                                    API.newsEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！'); this.$router.go(-1)}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {console.log(error)});  break;
                            case 'editCase':
                                    API.CaseEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！'); this.$router.go(-1)}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {console.log(error)});  break;
                            case 'editDown':
                                    API.DownEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！'); this.$router.go(-1)}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {console.log(error)});  break;
                            case 'editVideo':
                                    API.VideoEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！'); this.$router.go(-1)}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {console.log(error)});  break;
                            case 'editJob':
                                    API.JobEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！'); this.$router.go(-1)}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {console.log(error)});  break;
                            case 'editSupport':
                                    API.SupportEdit(this.Editform).then(rs => {
                                        if(rs.code == 1){this.$message.success('修改成功！'); this.$router.go(-1)}
                                        else{this.$message.error(rs.msg);}
                                        this.disabled = false;
                                    }).catch(error => {console.log(error)});  break;
                            default: break;
                        }
						
					}else{
                        this.activeName = '2';
						return false;
					}
				})
			}
		},
		mounted:function(){
            this.getEdit(this.$route.params.editId)
        },
    

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
.level span {font-size:14px; color:#19aa8d; padding-left:15px;}

.icon.img {width:120px; height:120px; border:1px solid #d9d9d9; border-radius: 6px; cursor: pointer; overflow:hidden; position: relative;}
.icon.img:hover {border-color:#19aa8d;}
.icon.img img {width:120px; height:auto; position: absolute; left:50%; top:50%; transform: translate(-50%,-50%)}
</style>