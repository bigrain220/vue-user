<template>
	<transition name="el-fade-in">
	<div class="website" v-loading="loading">
		<el-tabs v-model="activeName"  @tab-click="handleClick"  type="card">
		    <el-tab-pane label="公司信息" name="1">
				<ul id="web">
					<li v-for="(item , index) in dataConfig" :key="index">
						<div v-if="item.key == 'description'" class="boxs">
							<span>{{item.title}}</span><el-input type="textarea" :rows="2" clearable  :placeholder="item.description" v-model="item.value"></el-input>
						</div>
						<div v-else-if="item.key == 'script'" class="boxs">
							<span>{{item.title}}</span><el-input type="textarea" :rows="4" clearable  :placeholder="item.description" v-model="item.value"></el-input>
						</div>
						<div v-else-if="item.key == 'logo'" class="boxs">
							<span>{{item.title}}</span>
							<div class="icon img">
								<div v-if="item.value" class="img">
									<img :src="item.value + '?x-oss-process=image/resize,h_60'">
									<div id="mask">
										<i class="el-icon-circle-plus" @click="appendImage"></i>
										<i class="el-icon-delete"  @click="item.value = ''"></i>
									</div>
								</div>
								<i v-else @click="appendImage" class="el-icon-plus avatar-uploader-icon"></i>
							</div>
							<editorImage @successCBK="imageSuccessCBK" ref="images" v-bind:Keys = 'Keys'></editorImage>
						</div>
						<div v-else class="boxs">
							<span>{{item.title}}</span><el-input type="text" clearable :placeholder="item.description" v-model="item.value"></el-input>
						</div>
					</li>
					<li>
						<div>
							<span>默认语言</span>
							<el-select v-model="LanguageCode" placeholder="请选择" @change="handleChange">
								<el-option v-for="item in options" :key="item.lid" :label="item.name" :value="item.lid" class="langoptions"></el-option>
							</el-select>
						</div>
					</li>
					<li style="width:100%; padding-top:20px; ">
						<el-button type="primary" @click="webConfig()">保存</el-button>
					</li>
				</ul>
		    </el-tab-pane>
		    <el-tab-pane label="域名信息" name="2">
				<div v-show="flag" class="domain">
					<div>您的初始域名为：<a :href="'//'+initialDomain" target="_blank"><span>{{initialDomain}}</span></a><el-button type='success' @click="DomainVisible = true">绑定域名</el-button></div>
		    	</div>
		    	<div class="domain" v-show = !flag>
		    		您的域名为：<a :href="'http://'+Domain.domain" target="_blank"><span style="color:#67c23a;">{{Domain.domain}}</span></a> , 状态：<span v-if="Domain.status == '0'" class="disabled">禁用</span><span class="success" v-else>正常</span>, 区域：<span v-if="Domain.area == '0'" class="disabled">海外</span><span class="success" v-else>国内</span>
			    	<el-button type="primary" size="small" @click="EditDomain()">修改域名</el-button>
			    	<el-button type="danger" size="small" @click="delDomain()">解绑域名</el-button>
		    	</div>
				<div class="qr">
					<img :src="img" >
					<vue-qr class="qrImg"  :text="qrSrc()"  :size=120 :margin=10></vue-qr>
					<p>请扫描二维码预览</p>
				</div>
				<div class="explain">
					<h4>解析说明：</h4>
					<p>
					1、国内备案：别名(cname)解析到 cname.cn.g3wei.com （<a href="http://help.51g3.com/news/19.html" target="_Blank"> 备案流程</a>）;  海外免备案：别名（cname）解析到 cname.hk.g3wei.com
					</p>
					<p>
					2、将域名解析操作选择CNAME记录方式指向到上述对应的解析地址，解析绑定1-4小时生效。
					</p>
					<p>
					3、建议选择主流域名.com/.net/.cn/.com.cn/.org/.cc/,CNNIC未认可的域名。
					</p>
				</div>
		    </el-tab-pane>
		    <el-tab-pane label="语言模板" name="3">
		    	<el-button type="success" @click="addClick()">添加设置</el-button>
				<el-table stripe :data="userconfigData" style="width: 100%">
					<el-table-column prop="id" label="ID" sortable width="120"></el-table-column>
					<el-table-column prop="lid" label="语言ID" :formatter="formatLid"></el-table-column>
					<el-table-column prop="tid" label="模板ID"></el-table-column>
					<!-- <el-table-column prop="tid" label="模板ID" :formatter="formatTid"></el-table-column> -->
					<el-table-column prop="name" label="标题名"></el-table-column>
					<!-- <el-table-column prop="is_default" label="是否默认" :formatter="formatDefault"></el-table-column> -->
					<el-table-column prop="is_default" label="是否默认">
						<template slot-scope="scope">
							<el-switch v-if="userconfigData[scope.$index].is_default == '1'" disabled v-model="userconfigData[scope.$index].is_default"  @change="changeStatus(scope.row)" active-text="是" inactive-text="否" active-value="1" inactive-value="0"></el-switch>
							<el-switch v-else v-model="userconfigData[scope.$index].is_default"  @change="changeStatus(scope.row)" active-text="是" inactive-text="否" active-value="1" inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180" fixed="right">
						<template slot-scope="scope">
							<el-button v-if="scope.row.is_default == 0" type="text" disabled>预览</el-button>
							<el-button v-else type="text" @click="Look()">预览</el-button>
							<el-button type="text" icon="el-icon-edit" @click="editClick(scope.row)"></el-button>
							<el-button type="text" icon="el-icon-delete" @click="deleteClick(scope.row)"></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
		<el-dialog :visible.sync="DomainVisible"  width="800px" title="绑定域名">
			<el-form :model="domainForm" :rules="domainRules" ref="domainForm" label-width="100px" class="demo-ruleForm" style="width:80%;">
				<el-form-item label='域名：' prop="domain">
					<!-- <el-input  placeholder="请输地址" v-model="domainForm.domain"></el-input> -->
					<el-input v-model="domainForm.domain" placeholder="请输地址">
						<template slot="prepend">http://</template>
					</el-input>
				</el-form-item>
				<el-form-item label='区域：' prop="area">
					<el-radio v-model="domainForm.area" label="0">海外</el-radio>
					<el-radio v-model="domainForm.area" label="1">国内</el-radio>
				</el-form-item>
				<el-form-item label='状态：' prop="status">
					<el-switch v-model="domainForm.status" active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0">
					</el-switch>
					<div class="status-text" v-if="domainForm.status=='1'">已选择 <span>正常</span> 状态</div>
					<div class="status-text" v-if="domainForm.status=='0'">已选择 <span>禁用</span> 状态</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitdomainForm('domainForm')">确定</el-button>
					<el-button @click="resetForm('domainForm')">取消</el-button>
				</el-form-item>
			</el-form>
			<div class="description">
				<p>解析说明：</p>
				<p v-show="domainForm.area == '0'">1、无需备案：解析到 <span>{{username}}</span>.hk.g3wei.com</p>
				<p v-show="domainForm.area == '1'">1、国内备案：解析到 <span>{{username}}</span>.cn.g3wei.com （<a href="http://help.51g3.com/news/19.html" target="_Blank"> 备案流程</a>）</p>
				<p>3、将域名解析操作选择CNAME记录方式指向到上述对应的解析地址，解析绑定1-4小时生效。</p>
				<p>4、建议选择主流域名.com/.net/.cn/.com.cn/.org/.cc/,CNNIC未认可的域名。</p>
			</div>
		</el-dialog>
		<el-dialog :visible.sync = "DomainEditVisible" width="800px" title="修改域名">
			<el-form :model="DomainForm" :rules="domainRules" ref="DomainForm" label-width="100px" class="demo-ruleForm" style="width:80%;">
				<el-form-item label="域名：" prop="domain">
					<el-input v-model="DomainForm.domain">
						<template slot="prepend">http://</template>
					</el-input>
				</el-form-item>
				<el-form-item label='区域：' prop="area">
					<el-radio v-model="DomainForm.area" label="0">海外</el-radio>
					<el-radio v-model="DomainForm.area" label="1">国内</el-radio>
				</el-form-item>
				<el-form-item label="状态：" prop="status">
					<el-switch v-model="DomainForm.status" active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0">
					</el-switch>
					<div class="status-text" v-if="DomainForm.status=='1'">已选择 <span>正常</span> 状态</div>
					<div class="status-text" v-if="DomainForm.status=='0'">已选择 <span>禁用</span> 状态</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitEditForm('DomainForm')">确定</el-button>
					<el-button @click="resetForm('DomainForm')">取消</el-button>
				</el-form-item>
			</el-form>
			<div class="description">
				<p>解析说明：</p>
				<p v-show="DomainForm.area == '0'">1、海外免备案：别名(cname)解析到 cname.hk.g3wei.com</p>
				<p v-show="DomainForm.area == '1'">1、国内备案：别名(cname)解析到 cname.cn.g3wei.com （<a href="http://help.51g3.com/news/19.html" target="_Blank"> 备案流程</a>）</p>
				<p>3、将域名解析操作选择CNAME记录方式指向到上述对应的解析地址，解析绑定1-4小时生效。</p>
				<p>4、建议选择主流域名.com/.net/.cn/.com.cn/.org/.cc/,CNNIC未认可的域名。</p>
			</div>
		</el-dialog>
		<el-popover placeholder="top-start"  v-model="addVisibile" trigger="click" title="添加配置">
  			<i class="close el-icon-close" @click="closePopover('addForm')"></i>
			<el-form :model="addForm" :rules="configRules" ref="addForm" label-width="120px" class="add-ruleForm">
				<el-form-item label="标题名" prop="name"><el-input v-model="addForm.name"></el-input></el-form-item>
				<el-form-item label="模板ID" prop="tid">
					<el-radio-group v-model="addForm.tid">
						<el-radio v-for="item in tempLists" :label="item.tid" :key="item.id">{{item.name}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="语言ID" prop="lid">
					<el-radio-group v-model="addForm.lid">
						<el-radio v-for="item in langLists" :label="item.lid" :key="item.id">{{item.name}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否默认" prop="is_default">
					<el-switch  v-model="addForm.is_default"  active-color="#13ce66" inactive-color="#ff4949" active-text="默认" inactive-text="不默认" active-value="1" inactive-value="0" ></el-switch>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('addForm')">确认添加</el-button>
					<el-button @click="resetForm('addForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</el-popover>
		<el-popover placement="top-start" v-model="editVisibile" trigger="click" title="修改配置">
			<i class="close el-icon-close" @click="closePopover('editForm')"></i>
			<el-form :model="editForm" :rules="configRules" ref="editForm" label-width="120px" class="add-ruleForm">
				<el-form-item label="ID" prop="id"><span>{{editForm.id}}</span></el-form-item>
				<el-form-item label="标题名" prop="name"><el-input v-model="editForm.name"></el-input></el-form-item>
				<el-form-item label="模板ID" prop="tid">
					<el-radio-group v-model="editForm.tid">
						<el-radio v-for="item in tempLists" :key="item.tid" :label="item.tid">{{item.name}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="语言ID" prop="lid">
					<el-radio-group v-model="editForm.lid">
						<el-radio v-for="item in langLists" :key="item.lid" :label="item.lid">{{item.name}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否默认" prop="is_default">
					<el-switch  v-model="editForm.is_default"  active-color="#13ce66" inactive-color="#ff4949" active-text="默认" inactive-text="不默认" active-value="1" inactive-value="0" ></el-switch>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('editForm')">确认修改</el-button>
				</el-form-item>
			</el-form>
		</el-popover>
	</div>
	</transition>
</template>
<script>
	import API from '../../api/api.js'
	import editorImage from '@/components/common/editorImage.vue';
	import  util  from '../../api/util.js';
	import VueQr from 'vue-qr';
	export default {
		components: { editorImage , VueQr},
		inject: ['reload'],
		name:'WebSite',
		data() {
			return {
				Keys:{isEditor:false},
				initialDomain:this.$store.state.userMsg.username + '.' +API.DomainName,
				username:this.$store.state.userMsg.username,
				img:'./static/img/erwei.png',
				loading:false,
				LanguageCode:'',
				// Langoptions:window.options,
				dialogImageUrl: '',
        		dialogVisible: false,
				action:"",
				actionLogo:'',
				activeName: '3',
				LanguageValue:'Chinese',
				configRules:{
					name:[{ required: true, message: '请输入标题', trigger: 'blur' },
            			 { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }],
					lid:[{ required: true, message: '请选择语言', trigger: 'change' }],
					tid:[{ required: true, message: '请选择模板', trigger: 'change' }],
					is_default:[{ required: true, message: '设置是否为默认模板', trigger: 'change'}],
				},
				rule2Form:{},
				rules2:{},
				dataConfig:[],
				ConfigParam:{},
				Domain:{uid:'', domain:'', area:'', status:''},
				DomainVisible:false,
				DomainEditVisible:false,
				flag:false,
				domainForm:{domain:'' , status:'1' , area:'0'},
				domainRules:{
					domain: [{required:true,trigger:'change',message: '请填写域名，例如：www.g3wei.com'}]
				},
				DomainForm:{domain:'' , status: '' , area:''},
				userconfigData:[],
				addVisibile:false,
				addForm:{
					lid:'',
					tid:'',
					name:'',
					is_default:'0'
				},
				rules:{},
				tempLists:[],
				langLists:[],
				editForm:{
					id:'',lid:'',tid:'',name:'',is_default:'0'
				},
				editVisibile:false,
				editConfigVisibile:false,
				editForm2:{},
				options:[],
			}},
			methods:{
				imageSuccessCBK(arr){
					this.dataConfig.forEach(ele => {
						if(ele.key == 'logo'){ele.value = arr[0].url}
					})
				},
				appendImage(){
					this.$refs.images[0].uploadImage();
				},
				qrSrc(){
					if(this.Domain.domain == ''){
						return 'http://'+ this.$store.state.userMsg.username + '.' + API.DomainName ;
					}else{
						return 'http://' + this.Domain.domain ;
					}
					console.log(url)
				},
				changeStatus(row){
					let params = {id:row.id , is_default: row.is_default}
					API.edituserConfig(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！'); this.getuserConfig();}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});
				},
				webConfig(){
					this.dataConfig.forEach(ele => {
						this.ConfigParam[ele.key] = ele.value;
					})
					API.ConfigEdit(this.ConfigParam).then(rs => {
						if(rs.code == 1){
							this.$message.success('网站设置成功！');
							this.reload();
						}else{
							this.$message.error(rs.msg);
						}
					}).catch(error => {console.log(error)})
				},
				formatCreate(row,column,cellValue){return util.format(cellValue,'MM-dd hh:mm');},
				formatModified(row,column,cellValue){return util.format(cellValue,'MM-dd hh:mm');},
				formatDefault(row,column,cellValue){return row.is_default == '0' ? '否':'是';},
				formatLid(row,column,cellValue){return this.selectLid(row.lid);},
				formatTid(row,column,cellValue){return this.selectTid(row.tid);},
				selectLid(lid){
					var value_L = '';
					this.langLists.forEach(ele => {if(ele.lid == lid){value_L = ele.name;}});
					return value_L;
				},
				selectTid(tid){
					var value_T = '';
					this.tempLists.forEach(ele => {if(ele.tid == tid){value_T = ele.name;}});
					return value_T;
				},
				handleClick(tab, event) {
					if(tab.paneName == '1'){this.getConfigList();}
					else if (tab.paneName == '2'){
						if(this.Domain.domain == ''){this.getDomain();}
					}
					else{
						if(this.userconfigData.length == 0){ this.getuserConfig(); }
						}
			    },
			    getConfigList(){
					if(this.dataConfig.length == 0){
						API.getConfig({}).then((rs) => {
							this.dataConfig = rs;
							this.loading = false;
							if(this.options.length == 0){
								this.langList();
							}
						}).catch((error) => {console.log(error);});
					}
				},
			    getDomain(){
						API.getDomain({}).then((rs) => {
							this.loading = false;
							if(rs == null){this.flag = true;}
							else{this.flag = false;this.Domain = rs;}
						}).catch((error) => {console.log(error)})
				},
				getuserConfig(){
						API.getuserConfig({}).then(rs => {
							this.loading = false;
							this.userconfigData = rs;
							if(this.langLists.length == 0){this.langList();}
						}).catch((error) => {console.log(error)})
				},
				langList(){
					API.langList({}).then(rs => {
						this.langLists = rs;
						this.options = rs;
						rs.forEach(ele => {
							if(ele.is_default == 1){
								this.LanguageCode = ele.name;
								this.ConfigParam['lid'] = ele.lid;
							}
						});
						if(this.tempLists.length == 0){
							this.tempList();
						}
					}).catch((error) => {console.log(error)})
				},
				handleChange(value){
					this.ConfigParam['lid'] = value;
				},
				tempList(){
					API.tempList({}).then(rs => {
						this.tempLists = rs;
					}).catch((error) => {console.log(error)})
				},
				// 添加域名  确定
				submitdomainForm(formName){
			    	 this.$refs[formName].validate((valid) => {
			    	 	if(valid){
			    	 		this.addDomain();
			    	 	}
			    	 })
				},
				addDomain(){
			    	API.addDomain(this.domainForm).then((rs) => {
	    	 			if(rs.code == 1) {
	    	 				this.$message.success('域名绑定成功！');
	    	 				this.resetForm('domainForm');
							this.getDomain();
							this.qrSrc();
						}else if(rs.msg=="ILLEGAL_DOMAIN_EXISTS"){
	    	 				this.$message.warning(this.domainForm.domain+'该域名已存在绑定~');
	    	 			}else if(rs.msg=="ILLEGAL_DOMAIN_NOT_MATCH"){
	    	 				this.$message.warning(this.domainForm.domain+'并不是合法域名，也不匹配，请重置~');
	    	 			}
	    	 		}).catch(error => {console.log(error)})
				},
				resetForm(formName){
			    	this.DomainVisible = false;
			    	this.DomainEditVisible = false;
			    	this.$refs[formName].resetFields();
			    },
			    delDomain(){
						this.$confirm('确定删除此域名?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
						.then(() => {
				    	  	API.delDomain({}).then((rs) => {
								if(rs.code == 1){
									this.$message.success('删除成功！');
									this.getDomain();
									this.qrSrc();
								}else{
									this.$message.error(rs.msg);
								}
							}).catch(error => {console.log(error)})
				        }).catch(() =>{});
			    },
			    EditDomain(){
			    	this.DomainEditVisible = true;
					this.DomainForm.domain = this.Domain.domain;
					this.DomainForm.status = this.Domain.status;
					this.DomainForm.area = this.Domain.area;
				},
			    submitEditForm(formName){
			    	this.$refs[formName].validate((valid) => {
			    		if(valid){
							console.log(this.DomainForm)
			    			API.editDomain(this.DomainForm).then(rs => {
			    				if(rs.code == 1){
			    					this.$message.success('域名修改成功');
			    					this.resetForm('DomainForm');
									this.getDomain();
									this.qrSrc();
								}else if(rs.msg=="ILLEGAL_DOMAIN_EXISTS"){
									this.$message.error('该域名已存在绑定');
								}
								else{
			    					this.$message.error('域名为非法域名或不匹配，例如：www.g3wei.com');
			    				}
			    			}).catch(error => {console.log(error)})
			    		}
			    	})
				},
				addClick(){
					this.addVisibile = true;
				},
				submitForm(formName){
					var params = {};
					if(formName == 'addForm'){
						this.$refs[formName].validate((valid) => {
							if(valid){
								this.$confirm('确实新增语言和模板的配置?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
									.then(() => {
										params.name = this.addForm.name;
										params.tid = this.addForm.tid;
										params.lid = this.addForm.lid;
										params.is_default = this.addForm.is_default;
										API.adduserConfig(params).then(rs => {
											if(rs.code == 1){
												this.addVisibile = false;
												this.getuserConfig();
												this.resetForm('addForm');
												this.$message.success('配置添加成功！');
											}else if(rs.code == 0){
												this.$message.warning('域名错误,请重新设置!');
											}else{
												this.$message.error('请求出错!');
											}
										}).catch(() => {console.log('error!')})
									}).catch((error) => {console.log(error)});
							}else{ console.log('error submit!!'); return false;}
						})
					}
					if(formName == 'editForm'){
						this.$refs[formName].validate((valid) => {
							if(valid){
								this.$confirm('确定修改语言和模板的配置?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
									.then(() => {
										params.id = this.editForm.id;
										params.name = this.editForm.name;
										params.tid = this.editForm.tid;
										params.lid = this.editForm.lid;
										params.is_default = this.editForm.is_default;
										API.edituserConfig(params).then(rs => {
											if(rs.code == 1){
												this.editVisibile = false;
												this.getuserConfig();
												this.resetForm('editForm');
												this.$message.success('配置修改成功！');
											}else if(rs.code == 0){
												this.$message.warning('域名错误,请重新设置~');
											}else{
												this.$message.error('请求出错!');
											}
										}).catch((error) => {console.log(error)})
									}).catch((error) => {console.log(error)});
							}else{ console.log('error submit!!'); return false;}
						})
					}
				},
				editClick(row){
					this.editVisibile = true;
					API.getuserConfig({id:row.id}).then((rs) => {
						this.editForm = rs[0];
			    	}).catch(error => {console.log(error)})
				},
				editConfigClick(row){
					this.editConfigVisibile = true;
					API.getuserConfig({id:row.id}).then((rs) => {
						this.editForm = rs[0];
			    	}).catch(error => {console.log(error)})
				},
				deleteClick(row){
					if(row.is_default == '1'){
						this.$message.warning('此配置为默认配置,不能删除！');
					}else{
						this.$confirm('确实要删除此配置?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
						.then(() => {
							API.deluserConfig({id:row.id}).then(rs => {
								if(rs.code == 1){
									this.$message.success('配置删除成功！');
									this.getuserConfig();
								}else{
									this.$message.error('配置删除失败！');
								}
							})
						}).catch((error) => {console.log(error)});
					}
				},
				closePopover(formName){
					this.$refs[formName].resetFields();
					this.addVisibile = false;
					this.editVisibile = false;
				},
				Look(val){
					window.open('http://' + this.$store.state.userMsg.username + '.' + API.DomainName);
				}
			},
			mounted:function(){
				this.loading = true;
				this.activeName = this.$route.params.id
				console.log(this.activeName)
				if(this.activeName == '3'){ this.getuserConfig();}
				if(this.activeName == '2'){this.getDomain();}
				if(this.activeName == '1'){this.getConfigList();}
			},
	}
</script>
<style scoped>
	.domain span {    color: #67c23a;
    padding-right: 30px;
    font-weight: bold;}
	#pane-second {padding-left:100px;}
	.qr {position: relative;}
	.qr p {font-size:12px; position: absolute; left:133px;top:195px;}
	.qrImg {position:absolute; left:119px; top:80px;}
	.description {padding:20px 16px; color:#888; font-size:14px; border-top:1px solid #eee;}
	.description p:first-child {color:#666;}
	.description p:nth-child(2) , .description p:nth-child(3),.description p:nth-child(4) , .description p:nth-child(5) {text-indent: 30px;}
	.qr {box-sizing: border-box; padding:20px;}
	.iconfont {font-size:14px; padding-right: 10px;}
	.demo-ruleForm {width:600px;}
	.el-input {float: left}
	.copy {position: absolute; right:-90px;}
	.binding {position: absolute; right:-175px;}
	.el-upload__tip { display: inline-block; padding-left: 20px; }
	.domain {padding:20px; font-size:16px;}
	.domain div {padding-bottom:10px;}
	.domain span {padding-right:10px; font-weight: bold;}
	.addLang {width:80%; height:100%; right:0; top:0; bottom:0; position: absolute;}
	.add-ruleForm {width:80%; padding-top:40px;}
	ul {overflow: hidden;}
	ul li {list-style:none; width:48%; margin-right:2%; overflow: hidden; margin-bottom: 20px; float:left;}
	ul li span {  line-height: 40px; display: inline-block; width:80px; text-align: right; margin-right:20px;}
	ul li .el-input { display: inline-block;}
	.el-textarea {width:100%;}
	.el-upload__tip {display: inline; padding-left:20px;}
	#web li:last-child {text-indent: 140px;}
	.el-upload__tip {text-indent: 140px;}
	#up_img {float:left;}
	#Lang li:last-child {text-indent: 140px;}
	.disabled {color:#f56c6c;}
	.success {color:#67c23a;}
	.NoDomain {
	    color: #e6a23c;
	    font-size: 14px;
	    font-weight: normal;
	    background: #fde8c9;
	    padding: 5px 10px;
	    border: 1px solid #e6a23c;
		margin-bottom:30px;
	}
	.el-select-dropdown__item {margin:0 !important;}
	.el-input--suffix .el-input__inner {
		background-color: #242f42;
		border-color: #9c9c9c;
		color: #fff;
	}
	#pane-third { padding:0 15px 15px 15px; }
	.icon.img {width:120px; height:120px; border:1px solid #d9d9d9; border-radius: 6px; cursor: pointer; overflow:hidden; position: relative;}
	.icon.img:hover {border-color:#19aa8d;}
	.icon.img img {width:120px; height:auto; position: absolute; left:50%; top:50%; transform: translate(-50%,-50%)}
	#web {padding:30px;}
	#pane-2 {padding:30px;}
	.el-tab-pane {padding:0 20px;}
	.el-input.tel {width:200px;}
	.boxs {display:flex;}
	.boxs span {width:80px;}
	.boxs .el-input {width:100%; flex:1;}
	.boxs .el-textarea {width:100%; flex:1;}
	ul li:last-child {padding-top:40px; width:100%; margin-right: 0px; text-align: center;}
	ul li:last-child .el-button {width:30%; }
	.el-select-dropdown__item.langoptions{width:100%;padding-top:0!important;text-align: left;}
	@media screen and (max-width:1250px){
		ul li {width:100%;}
	}
	.explain p{
		font-size: 14px;
		color: #333;
		margin: 4px 0;
		letter-spacing: 1px;
	}
	.status-text{
		display: inline-block;
		font-size: 14px;
		height: 20px;
		line-height: 20px;
		border: 8px solid #fff;
	}
	.status-text>span{
		color: #409EFF;
	}
	a{text-decoration: none;}
</style>