<template>
	<div class="Template" id="Template" @click.capture="disMsk($event)">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-moban"></i>模板</el-breadcrumb-item>
                <el-breadcrumb-item>小程序模板</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<div class="handle-box">
			<el-input placeholder="请填写查询数据" clearable v-model="input5" class="select select_search">
				<el-select v-model="select_name_id" slot="prepend" placeholder="请选择"  class="select_left">
					<!-- <el-option label="编号" value="select_id"></el-option> -->
					<el-option label="标题" value="select_name"></el-option>
				</el-select>
			</el-input>
            <el-cascader placeholder="字段/排序" expand-trigger="hover" :options="options" v-model="selectedOptions" @change="Search" class="select"></el-cascader>
            <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button> 
            <el-button @click="resetSearch">重置</el-button>
        </div>
        <ul class="templateList">
 			<li v-for="(item , index) in dataList" :key="index"> 
 				<div class="img"><img :src='imgSrc(item.image)' alt=""></div>
 				<div class="desc">
 					<p>ID: {{item.id}} <span class="app_name">{{item.name}}</span></p>
 					<div class="money">
 						<span>销量：{{item.hits}}</span>
 						<span><i class="iconfont icon-money"></i> {{item.price}}</span>
 					</div>
 				</div>
 				<div class="maskLayer">
 					<div class="maskimg"><vue-qr class="qrImg"  :text="qrSrc(item.id)"  :size=160   :margin=10></vue-qr></div>
 					<el-button type="success"  @click="OnlineBuy(item)" class="button" size="medium">购买</el-button>
 					<el-button type="primary" @click="OnlineLooking(item)" class="button"  size="medium">预览</el-button>
 				</div>
			</li>
		</ul>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[ 10, 20, 30]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        
		
		<el-dialog :visible.sync = "buyVisible" width="660px" title='生成模板'>
				<el-form :model="form" label-width='130px'  :rules="rules" ref="ruleForm">
					<el-form-item label="类型:">
						<el-radio-group v-model="form.tid">
							<el-radio label="1">微信小程序</el-radio>
							<el-radio label="2">智能小程序</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="模板号:">
						<el-input v-model="form.id" placeholder="请输入模板号" readonly="true"></el-input>
					</el-form-item>
					<el-form-item label="AppID:" prop="appid" v-if="form.tid == 1"
					:rules="[
					 	    {pattern: /^wx[A-Za-z0-9]{16}$/, message: '以wx开头并且为18位的字母和数字组合', trigger: 'blur' }
					]">
						<el-input v-model="form.appid"  placeholder="请选择AppID"></el-input>
					</el-form-item>		
					<el-form-item label="AppID:" prop="appid" v-if="form.tid == 2" 
					:rules="[
							{len: 8||0, message: '请输入8位数字', trigger: 'blur' },
					]">
						<el-input v-model="form.appid"  placeholder="请选择AppID(只能为数字)"  type="number"></el-input>
					</el-form-item>
					<el-form-item label="项目名称:" prop="projectname">
						<el-input v-model="form.projectname"  placeholder="请输入项目名称"></el-input>
					</el-form-item>
					<el-form-item label="开发设置:">
						<span>服务器域名(https://www.g3wei.com)</span>
					</el-form-item>
					 <el-form-item>
						<el-button type="primary" @click="subOnline(form.id)" class="subOnline"  v-loading.fullscreen.lock="fullscreenLoading">在线生成</el-button>
					</el-form-item>
				</el-form>
		</el-dialog>
		<!-- 'http://'+c_host+'/upload/web/'+form.id -->
		<el-dialog :visible.sync = "downVisible" width="660px" title='打包下载' center @close="closeDownDialog">
			 <div v-loading="loading" v-if="loading"
				element-loading-text="正在打包中，请耐心等待..."
				element-loading-background="rgba(255, 255, 255, 0.8)" style="width:100%;height:281px;"></div>
				<vue-qr v-if="loaded" class="down-qr"  :text="qrSrc(form.id)"  :size=180 ></vue-qr>
			<span v-if="loaded" style="width:100%;text-align:center;display:block;height:54px;">扫描可预览</span>	
				<span  v-show="loaded" slot="footer" class="dialog-footer">
					<a href="" class="down-btn" ref="downApp">点击下载</a>
				</span>
				<div v-if="loaded2" class="loaded2"><i class="el-icon-warning"></i>该步骤还需要审核，审核时间一般为一周，请于审核后再重新下载</div>
				<div v-if="loaded3" class="loaded2"><i class="el-icon-warning"></i>没有找到对应的文件，请重新填写信息并确保信息无误</div>
		</el-dialog>

        <div class="mubanyulan" ref="mubanyulan" v-show="flag">
            <div class="mobyulan1"  style="background: url(./static/img/mob.png) no-repeat;">
                <div class="iframe-con">
                <iframe id="preview" :src="iframeSrc"></iframe>
                </div>
            </div>
            <div class="mobyulan2">
                <div class="mobyulan2-1">
                    <div class="pic"><vue-qr class="qrImg2"  :text="iframeSrc1"  :size=146 :margin=10></vue-qr></div>
                    <p style="font-size:14px">扫描二维码预览，手机预览</p>
                </div>
				<el-button type="primary"  class="usemb" @click="leadToMb()">购买模板</el-button>
            </div>
			<i class="el-icon-close"  @click="closeMb()"></i>
        </div>
		<div class="black"  v-show="flag" ref="black"></div>


	</div>
</template>
<script>
	import API from '../../api/api';
    import  util  from '../../api/util.js';
    import VueQr from 'vue-qr';
	export default {
        name: 'minApp',
		components:{VueQr},
		data() {
			 var checkName = (rule, value, callback) => {
				var len = 0;  
				for (var i=0; i<value.length; i++) {   
					var c = value.charCodeAt(i);   
						//单字节加1   
						if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
							len++;   
						} else {   
							len+=2;   
						}   
				}   
				if ((len < 4 && len> 0) || len > 30) {
				    callback(new Error('名称长度为4-30个字符，一个中文字等于2个字符。'));
				} else {
				    callback();
				}
      		};
			return {
                total:0,
				currentPage:1,
                size:10,
				dataList:[],
				iframeSrc:'',
				iframeSrc1:"",
				flag:false,
				qrText:'',
				clickDom:'',
				buyVisible:false,
				downVisible:false,
				select_name_id:'select_name',
				TemplateForm:{},
				loaded:false,
				loaded2:false,
				loaded3:false,
				loading:true,
				fullscreenLoading:false,
				href:"#",
				form: {
					tid:'1',
					id:'',
					appid:'',
					projectname: '',
				},
				rules:{
					projectname:[
						// { min: 4, max: 30, message: '长度在 4 到 30 个字符', trigger: 'blur' }
						{ validator: checkName, trigger: 'blur' }
					]
				},
				c_host:'',
				input5:'',
                selectedOptions:[],
                options:[
					{value:'id',label:'编号',children:[{value:'asc',label:'升序'},{value:'desc',label:'降序'}]},
					{value:'price',label:'价格',children:[{value:'asc',label:'升序'},{value:'desc',label:'降序'}]},
					{value:'hits',label:'销量',children:[{value:'asc',label:'升序'},{value:'desc',label:'降序'}]},
					{value:'created',label:'时间',children:[{value:'asc',label:'升序'},{value:'desc',label:'降序'}]}
				],
			}
		},
		methods: {
			 open3() {
					this.$notify({
					title: '成功',
					message: '恭喜购买成功~',
					type: 'success',
					duration:'3500',
					});
      		},
			getAppList(param){
				API.AppList(param).then(rs => {
					// console.log(rs.rows)
					this.total = Number(rs.total);
					this.dataList = rs.rows;
				}).catch(error => {console.log(error)});
			},
			imgSrc(image){
				return image+'?x-oss-process=image/resize,w_200';
			},
            qrSrc(id){
				return document.location.protocol +'//' +'www.g3wei.com'+'/upload/web/'+id;
            },
            handleSizeChange(val){
                this.size = val;
				this.getAppList({page:this.currentPage, rows:this.size});
            },
            handleCurrentChange(val){
				this.currentPage = val;
				this.getAppList({page:this.currentPage, rows:this.size});
			},
			OnlineBuy(item){
				this.buyVisible=true;
				this.form.id=item.id;
				this.form.appid='';
				this.form.projectname='';
			},
			OnlineLooking(item){
				// console.log(this.c_host)
				this.flag=true;
				this.iframeSrc=document.location.protocol +'//'+this.c_host+'/upload/web/'+item.id+'?time='+new Date().getTime();
				this.iframeSrc1=document.location.protocol +'//'+'www.g3wei.com'+'/upload/web/'+item.id+'?time='+new Date().getTime();
				this.TemplateForm=item;
			},
			closeMb(){
				this.flag=false;
			},
			leadToMb(){
				this.closeMb();
				this.OnlineBuy(this.TemplateForm);
			},
			disMsk(ev){
				this.clickDom=ev.target;
		　　　　 if(!this.$refs.mubanyulan.contains(this.clickDom)){
		　　　　　　this.flag=false;
		　　　　 }
		　　},
			Search(){
				const param = {page:this.currentPage, rows:this.size};
				if(this.select_name_id == 'select_id'){param.id = this.input5;}
				if(this.select_name_id == 'select_name'){param.name = this.input5;}
				if(this.selectedOptions){
					param.sort_by = this.selectedOptions[0];
					param.sort_order = this.selectedOptions[1];
				}	
				// console.log(param)		
				this.getAppList(param);	
			},
			resetSearch(){
				this.input5='';
				this.selectedOptions=[];
				this.getAppList({page:this.currentPage, rows:this.size});
			},
			closeDownDialog(){
				this.loaded=false;this.loaded2=false;this.loading=true;this.loaded3=false;
			},
			subOnline(id){
				this.$refs.ruleForm.validate((valid) => {
						if (valid) {
							this.$confirm('是否确认购买'+id+'模板？','提示', {confirmButtonText:'确认'}).then(() => {
								var loading_buy = this.$loading({
										lock: true,
										text: '正在购买中，请稍等...',
										spinner: 'el-icon-loading',
										background: 'rgba(0, 0, 0, 0.6)',
								});
								clearTimeout(loading_timer)
								var loading_timer = setTimeout(() => {
										loading_buy.close();
										this.$alert('连接超时,请重试', '提示', {confirmButtonText: '确定'}).then(() => {
										}).catch(error => {console.log(error)});
								}, 30000);
								API.AppBuy({id:id}).then(rs => {
									// console.log(rs,id)
									loading_buy.close();
										this.buyVisible = false;clearTimeout(loading_timer);
										if(rs.code == 1){
											this.open3();
											this.$confirm('您已成功购买'+id+'模板，是否需要下载代码？','提示', {confirmButtonText:'下载'}).then(() => {
												this.getAppMake();
											}).catch(error => {console.log(error)});
										}else if(rs.msg == 'ILLEGAL_COIN_NOT_ENOUGH'){
											this.$confirm('购买失败，您的币种余额不足', '提示', {confirmButtonText: '充值钻石',cancelButtonText: '取消',type: 'warning'
												}).then(() => {
													this.buyVisible = false;
													window.open('//www.g3wei.com/user/pay/index');
												}).catch(error => {});
										}else if(rs.msg == 'ILLEGAL_APP_EXISTS'){
												this.getAppMake();
										}else if (rs.msg == 'ILLEGAL_APP_NOT_EXIST'){
											this.$alert(id+'模板已下架', '提示', {confirmButtonText: '确定'}).then(() => {
											}).catch(error => {console.log(error)});
										}else{
											this.$alert(rs.msg, '提示', {confirmButtonText: '确定'}).then(() => {
											}).catch(error => {console.log(error)});
										}
									})
								}).catch(error => {console.log(error)});
						} else {
							// console.log('error submit!!');
							return false;
						}
				});

			},
			getAppMake(){
				let params={};  
				if(this.form.appid){params.appid=this.form.appid};
				if(this.form.projectname){params.projectname=this.form.projectname};
				if(this.form.id){params.id=this.form.id};
				if(this.form.tid){params.tid=this.form.tid};
				this.downVisible=true;
				API.AppMake(params).then(rs=>{
					// console.log(rs,params)
						if(rs.code == 1){
							this.loading=false;this.loaded=true;this.loaded2=false;this.loaded3=false;
							this.href=rs.dkey
							// API.AppDown(this.href).then(rs=>{
								// if(rs.code == 1){
									this.$refs.downApp.setAttribute('href',document.location.protocol +'//'+this.c_host+'/user/app/down'+'?dkey='+this.href);
								// }
							// })
						}else if(rs.msg == 'ILLEGAL_APP_NOT_BUY'){
							 setTimeout(() => {
								this.loading=false;this.loaded=false;this.loaded2=true;this.loaded3=false;
							}, 3000);
						}else if(rs.msg == 'ILLEGAL_FILE_NOT_EXIST'){
							 setTimeout(() => {
								// this.downVisible=false;
								this.loading=false;this.loaded=false;this.loaded2=false;this.loaded3=true;
							}, 3000);
							
						}
				})
			}
		},
		created(){
			this.getAppList({page:this.currentPage,rows:this.size})
			this.c_host = util.changHost()
		},
		// mounted:function(){
			
		// }
	}
</script>
<style scoped>
.content { background: #f8f8f8;}
.el-table {border:1px solid #eee; margin-top:20px;}
.el-pagination {text-align: center; margin:20px 0;}
.avatar-uploader .el-upload {border: 1px dashed #d9d9d9;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;}
.avatar-uploader .el-upload:hover {border-color: #409EFF;}
.avatar-uploader-icon {font-size: 28px;color: #8c939d;width: 178px;height: 178px;line-height: 178px;text-align: center;}
.avatar {width: 178px;height: 178px;display: block;}
.handle-box{margin-bottom: 20px;}
.handle_select{width: 120px;}
.handle-input{width: 250px;display: inline-block;}
.handle_add {margin-right: 20px;}
ul.templateList {width:100%; overflow: hidden; padding:0;min-height: 604px;}
ul.templateList li {width:208px; list-style:none; position: relative; vertical-align: top; overflow: hidden; margin:10px 15px;float:left; -webkit-box-shadow: 0 1px 4px #eee; box-shadow: 0 1px 4px #eee;}
ul.templateList li .img {width:208px; height: 208px;overflow: hidden; background: #fff; position: relative;}
ul.templateList li .img img {width:100%; height: auto; }
ul.templateList .desc {-webkit-box-sizing: border-box;box-sizing: border-box; border:1px solid #eee; border-top:none; background:#fff;}
ul.templateList .desc p {padding-left:15px; -webkit-box-sizing: border-box; box-sizing: border-box; margin:0 auto; line-height: 1.5; padding:10px; font-size:14px; color:#4a4a4a;overflow: hidden}
ul.templateList .desc .app_name{float: right;}
ul.templateList .desc .money {-webkit-box-sizing: border-box;box-sizing: border-box; padding:0 10px 10px 10px; font-size:14px; color:#959595;}
ul.templateList .desc .money span:last-child {float:right; }
ul.templateList .desc .money span:last-child i {color:#F5D314;}
ul.templateList li .maskLayer {position: absolute; width:100%; height: 100%; left:0; top:0; z-index: 999; opacity: 0; -webkit-transition:all .3s; transition:all .3s;text-align: center;}
ul.templateList li .maskLayer:hover {display: block; background:rgba(0,0,0,.8);opacity: 0.9; }
ul.templateList li .maskLayer .maskimg {width:160px; height: 160px; margin:0 auto;padding-top:14%;}
ul.templateList li .maskLayer img {width:100%; height:100%;}
ul.templateList li .maskLayer .button {margin-top:30px; border-radius:0;}
.select {width:150px;margin-right: 14px;}
.select_search {width:320px;}
.select_left {width:140px;}
.tem {font-size:16px; margin:0;}
.tem li {margin-bottom:10px;line-height: 34px;}
.tem li span:first-child {font-weight:bolder;}
.down-qr{text-align: center;}
.down-btn{color: #fff;background: #50aaee;font-size: 16px;line-height: 40px;padding: 8px 30px;border-radius: 5px;margin: 0 20px;text-decoration:none;}
.down-btn:hover{background:#6fb7ec}
.loaded2{width:100%;height:281px;text-align:center;line-height:281px;font-weight:bold;}
.loaded2 .el-icon-warning{color:#7e7bff;font-weight:normal;margin-right:14px;}
/* 预览模板 */
.mubanyulan{background:#fff;padding:0 25px;position:fixed;border:1px #eee solid;z-index:9996; left:0; top:0; bottom: 0; right: 0; margin:auto; 
			width:840px!important;height: 660px;overflow: hidden;}
			/* background: url(/static/img/mob.png) no-repeat; */
.mubanyulan .mobyulan1 {width: 315px;height: 646px;overflow: hidden;position: absolute;left: 40px;top:6px;}
.mubanyulan .mobyulan1 .iframe-con{width: 275px;height: 485px;background: #fff;margin: 75px 0 0 18px;overflow: hidden;}
#preview{width: 309px;height: 100%;overflow: hidden;border:0;}
.mubanyulan .mobyulan2 {position: relative;width: 300px;height: 570px;border: 1px #eee solid;position: absolute;right: 60px;top: 0;bottom: 0;margin: auto 0;}
.mubanyulan .mobyulan2 .mobyulan2-1{width: 200px;height: 220px;border: 1px #eee solid;text-align: center;color: #333;
									position:absolute;top:14%;left: calc(50% - 100px);}
.mubanyulan .mobyulan2 .mobyulan2-1 .pic{width: 148px;height: 148px;border: 1px #eee solid;margin: 16px 25px;}
.mubanyulan .mobyulan2 .mobyulan2-1 .qrImg2{width: 100%;height: 100%;}
.mubanyulan .mobyulan2 .usemb{width: 140px;text-align: center;position:absolute;top:360px;left: calc(50% - 70px);}
.mubanyulan .el-icon-close{position: absolute;right: 10px;top:10px; font-weight: bold;cursor: pointer;}
.black{ width: 100%; height: 100%; background: rgba(0,0,0,0.5); position: absolute; left: 0; top: 0; z-index: 9995;  }
.el-form .el-input{width:360px;}
.el-form .subOnline{width: 220px;margin-left:40px;margin-top:20px;padding:14px 16px; }
</style>