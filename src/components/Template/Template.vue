<template>
	<div class="Template" id="Template">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-moban"></i>模板</el-breadcrumb-item>
                <el-breadcrumb-item>模板列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
			<el-input placeholder="请输入模板编号或标题" v-model="values" class="select select_search" @keydown.enter.native="search">
				<el-select v-model="select_name_id" slot="prepend" placeholder="请选择" class="select_left">
					<el-option label="模板编号" value="select_id"></el-option>
					<el-option label="模板名" value="select_name"></el-option>
				</el-select>
			</el-input>
			<el-cascader placeholder="字段/排序" expand-trigger="hover" :options="options" v-model="selectedOptions" @change="search" class="select"></el-cascader>

			<el-select class="select" v-model="select_cid" placeholder="颜色" @change="search">
				<el-option v-for="item in select_cids" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
			<el-select class="select" v-model="select_iid" placeholder="行业" @change="search">
				<el-option v-for="item in select_iids" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
			<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> 
            <el-button @click="resetSearch" >重置</el-button>
        </div>
 		<ul class="templateList">
 			<li v-for="(item , index) in dataList" :key="index"> 
 				<div class="img"><img :src='imgSrc(item.image)' alt=""></div>
 				<div class="desc">
 					<p>ID: {{item.id}} <span class="tem_name">{{item.name}}</span></p>
 					<div class="money">
 						<span>销量：{{item.sale}}</span>
 						<span><i class="iconfont icon-money"></i> {{item.price}}</span>
 					</div>
 				</div>
 				<div class="maskLayer">
 					<div class="maskimg"><vue-qr class="qrImg"  :text="qrSrc(item.id)"  :size=120 :margin=10></vue-qr></div>
 					<el-button type="primary" @click="OnlineLooking(item.id)" class="button">预览</el-button>
 					<el-button type="success"  @click="OnlineBuy(item)" class="button">购买</el-button>
 				</div>
			</li>
		</ul>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[ 10, 20, 30]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		<el-dialog :visible.sync = "TemplateVisible" width="800px" title="订单">
			<ul class="tem">
				<li><span>模板ID：</span><span>{{TemplateForm.id}}</span></li>
				<li><span>模板名：</span><span>{{TemplateForm.name}}</span></li>
				<li><span>价格：</span><span>￥{{TemplateForm.price}}</span></li>
				<li>
					<el-button type="primary" @click="BuyOrder(TemplateForm.id)">确定购买</el-button>
					<el-button @click="TemplateVisible = false">取消</el-button>
				</li>
			</ul>
		</el-dialog>
	</div>
</template>
<script>
	import API from '../../api/api';
	import  util  from '../../api/util.js';
	import VueQr from 'vue-qr';
	export default {
		name: 'Template',
		components:{VueQr},
		data() {
			return {
				values:'',
				select_name_id:'select_id',
				dataList:[],
				total:0,
				currentPage:1,
				size:30,
				select_cids:[],
				select_iids:[],
				select_cid:'',
				select_iid:'',
				src:'',
				src2:'',
				TemplateVisible:false,
				TemplateForm:{},
				loading:false,
				selectedOptions:[],
				options:[
					{value:'level',label:'排序',children:[{value:'asc',label:'升序'},{value:'desc',label:'降序'}]},
					{value:'sale',label:'销量',children:[{value:'asc',label:'升序'},{value:'desc',label:'降序'}]},
					{value:'price',label:'价格',children:[{value:'asc',label:'升序'},{value:'desc',label:'降序'}]},
					{value:'created',label:'时间',children:[{value:'asc',label:'升序'},{value:'desc',label:'降序'}]}
				]
			}
		},
		methods: {
			imgSrc(image){
				return image+'?x-oss-process=image/resize,w_200';
			},
			getTemplateList(param){
				API.TemplateList(param).then(rs => {
					// console.log(rs)
					this.total = Number(rs.total);
					this.dataList = rs.rows;
					this.getColor();
				}).catch(error => {console.log(error)});
			},
			getColor(){
				API.ColorList({rows:1000}).then(rs => {
					this.select_cids = rs.rows;
					this.getIndustry();
				}).catch(error => {console.log(error)});	
			},
			getIndustry(){
				API.IndustryList({rows:1000}).then(rs => {
					this.select_iids = rs.rows;
				}).catch(error => {console.log(error)});	
			},
			qrSrc(id){
				return 'http://'+ document.domain + '/demo/' + id;
			},
			OnlineLooking(id){
				const Demosrc = this.qrSrc(id);
				window.open(Demosrc);
			},
			OnlineBuy(item){
				// this.$router.push({path: '/user/Template/TemplateBuy/'+id});
				this.TemplateVisible = true;
				this.TemplateForm = item;
			},
			BuyOrder(id){
				API.TemplateBuy({id:id}).then(rs => {
					this.TemplateVisible = false;
					if(rs.code == 1){
						this.$confirm('您成功购买'+id+'模板，现在可前往模板语言配置模板就可使用，是否前往配置？','提示', {confirmButtonText:'确定'}).then(() => {
							this.$router.push({'path':'/user/website/3'})
						}).catch(error => {console.log(error)});
					}else if(rs.msg == 'ILLEGAL_COIN_NOT_ENOUGH'){
						this.$confirm('您的币种余额不足', '提示', {confirmButtonText: '充值钻石',cancelButtonText: '取消',type: 'warning'
							}).then(() => {
								this.TemplateVisible = false;
								window.open('//www.g3wei.com/user/pay/index');
							}).catch(error => {});
					}else if(rs.msg == 'ILLEGAL_TEMPLATE_EXISTS'){
						this.$alert('您已购买'+id+'模板', '提示', {confirmButtonText: '确定'}).then(() => {

						}).catch(error => {console.log(error)});
					}else if (rs.msg == 'ILLEGAL_TEMPLATE_NOT_EXIST'){
						this.$alert(id+'模板已下架', '提示', {confirmButtonText: '确定'}).then(() => {
						}).catch(error => {console.log(error)});
					}else{
						this.$alert(rs.msg, '提示', {confirmButtonText: '确定'}).then(() => {
						}).catch(error => {console.log(error)});
					}
				})
			},	
			search(){
				const param = {page:this.currentPage, rows:this.size};
				if(this.select_name_id == 'select_id'){param.id = this.values;}
				if(this.select_name_id == 'select_name'){param.name = this.values;}
				if(this.select_iid){param.iid = this.select_iid;}
				if(this.select_cid){param.cid = this.select_cid;}
				if(this.selectedOptions){
					param.sort_by = this.selectedOptions[0];
					param.sort_order = this.selectedOptions[1];
				}	
				// console.log(param)		
				this.getTemplateList(param);
			},
			resetSearch(){
				this.select_cid = '';
				this.select_iid = '';
				this.select_name = '';
				this.values = '';
				this.select_name_id = '';
				this.selectedOptions = [];
				this.getTemplateList({page:this.currentPage, rows:this.size});
			},
			handleSizeChange(val){
				this.size = val;
				this.getTemplateList({page:this.currentPage, rows:this.size});
			},
			handleCurrentChange(val){
				this.currentPage = val;
				this.getTemplateList({page:this.currentPage, rows:this.size});
			},
		},
		mounted:function(){
			this.getTemplateList({page:this.currentPage,rows:this.size});
		}

	}
</script>
<style scoped>
	.content { background: #f8f8f8;}
	.el-table {border:1px solid #eee; margin-top:20px;}
	.el-pagination {text-align: center; margin:20px 0;}
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	}
	.avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	}
	.avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	}
	.handle-box{
    margin-bottom: 20px;
	}
	.handle_select{
	    width: 120px;
	}
	.handle-input{
	    width: 250px;
	    display: inline-block;
	}
	.handle_add {margin-right: 20px;}
	ul.templateList {width:100%; overflow: hidden; padding:0;}
	ul.templateList li {width:208px; list-style:none; position: relative; vertical-align: top; overflow: hidden; margin:10px 15px;float:left; box-shadow: 0 1px 4px #eee;}
	ul.templateList li .img {width:208px; height: 208px;overflow: hidden; background: #fff; position: relative;}
	ul.templateList li .img img {width:100%; height: auto; }
	ul.templateList .desc {box-sizing: border-box; border:1px solid #eee; border-top:none; background:#fff;}
	ul.templateList .desc p {padding-left:15px; box-sizing: border-box; margin:0 auto; line-height: 1.5; padding:10px; font-size:14px; color:#4a4a4a; cursor: pointer;overflow: hidden;}
	ul.templateList .desc p:hover {color:#409EFF;}
	ul.templateList .desc p .tem_name{float: right;}
	ul.templateList .desc .money {box-sizing: border-box; padding:0 10px 10px 10px; font-size:14px; color:#959595;}
	ul.templateList .desc .money span:last-child {float:right; }
	ul.templateList .desc .money span:last-child i {color:#F5D314;}
	ul.templateList li .maskLayer {position: absolute; width:208px; height: 208px;  left:0; top:0; z-index: 999; opacity: 0; transition:all .5s;text-align: center;}
	ul.templateList li:hover .maskLayer{display: block; background:rgba(0,0,0,.7); transition:all .5s; opacity: 1; }
	ul.templateList li .maskLayer .maskimg {width:120px; height: 120px; margin:0 auto; padding-top:20px;}
	ul.templateList li .maskLayer img {width:100%; height:100%;}
	ul.templateList li .maskLayer .button {margin-top:10px; border-radius:0;}
	.select {width:150px;}
	.select_search {width:300px;}
	.select_left {width:120px;}
	.tem {font-size:16px; margin:0;}
	.tem li {margin-bottom:10px;}
	.tem li:last-child {padding-top:20px;}
	.tem li span:first-child {font-weight:bold;}
</style>