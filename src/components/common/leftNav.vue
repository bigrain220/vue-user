<template>
	<div class="lefnav">
		<el-menu :default-active="onRoutes" class="el-menu-vertical-demo nav" background-color="#2f4050" unique-opened router text-color="rgb(191, 203, 217)" active-text-color="#fff" :collapse="isCollapse">
			<div class="img"><router-link to="/user/Index"><img v-if="!isCollapse" :src="image" ><img class="img1" v-else :src="image1"></router-link></div>
			<el-button class="radioGroup" id="radioGroup" @click="change"><i class="iconfont icon-nav"></i></el-button>
			<el-menu-item index="/user/Index">
               <i class="icon-home iconfont"></i><span slot="title">网站概况</span>
            </el-menu-item>
			<el-menu-item index="/user/WebSite/1">
               <i class="icon-wangzhan iconfont"></i><span slot="title">基本信息</span>
            </el-menu-item>
			<el-submenu index="Module">
				<template slot="title">
			        <i class="iconfont icon-mokuaiguanli"></i>
			        <span>优化设置</span>
		        </template>
				<el-menu-item index="/user/Module"><span class="space-item">分类设置</span></el-menu-item>
				<el-menu-item index="/user/Article"><span class="space-item">手动优化</span></el-menu-item>
				<el-menu-item index="/user/ArticleAuto"><span class="space-item">自动优化</span></el-menu-item>
				<el-menu-item index="/user/Link"><span class="space-item">友情链接</span></el-menu-item>
			</el-submenu>
            <el-submenu index="/">
            	<template slot="title">
			        <i class="iconfont icon-shuju"></i>
			        <span>数据设置</span>
		        </template>
				<el-menu-item index="/user/Single"><i class="icon-danye iconfont"></i><span slot="title">单页</span></el-menu-item>
				<el-menu-item index="/user/News/1"><i class="icon-xinwen iconfont"></i><span slot="title">新闻</span></el-menu-item>
				<el-menu-item index="/user/Product/1"><i class="icon-chanpinzhongxin iconfont"></i><span slot="title">产品</span></el-menu-item>
				<el-menu-item index="/user/Case/1"><i class="icon-anliguanli iconfont"></i><span slot="title">案例</span></el-menu-item>
				<el-menu-item index="/user/Down/1"><i class="icon-xiazai iconfont"></i><span slot="title">下载</span></el-menu-item>
				<el-menu-item index="/user/Video/1"><i class="icon-video iconfont"></i><span slot="title">视频</span></el-menu-item>
				<el-menu-item index="/user/Job/1"><i class="icon-job iconfont"></i><span slot="title">招聘</span></el-menu-item>
				<el-menu-item index="/user/Support/1"><i class="icon-help iconfont"></i><span slot="title">帮助</span></el-menu-item>
				<el-menu-item index="/user/Notice"><i class="icon-gonggao iconfont"></i><span slot="title">公告</span></el-menu-item>
				<el-menu-item index="/user/Banner"><i class="icon-guanggao iconfont"></i><span slot="title">广告</span></el-menu-item>
				<el-menu-item index="/user/Feedback"><i class="icon-message iconfont"></i><span slot="title">留言</span></el-menu-item>
			</el-submenu>
           <el-submenu index="11">
            	<template slot="title" id="titles"><i class="iconfont icon-moban"></i><span slot="title">增值服务</span>
				<!-- <i class="el-icon-star-on new-star"></i> -->
				</template>
				<el-menu-item index="/user/Lanuage"><span class="space-item">语言列表</span></el-menu-item>
				<el-menu-item index="/user/Template"><span class="space-item">网站模板</span></el-menu-item>
				<el-menu-item index="/user/minApp"><span class="space-item">小程序</span></el-menu-item>
				<el-menu-item index="/user/Order"><span class="space-item">订单列表</span></el-menu-item>
				<el-menu-item index="/user/templateOwn"><span class="space-item">我的模板</span></el-menu-item>
            </el-submenu>
			<el-menu-item index="/user/Code/code">
               <i class="icon-code iconfont"></i><span slot="title">模板代码</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
	export default {
		name:'leftNav',
		data() {
			return {
				isCollapse: false,
				image:'./static/img/logo.png',
				image1:'./static/img/logo2.png'
			}
		},
		methods:{
			change(){
				this.isCollapse = !this.isCollapse;
				this.getWidth(this.isCollapse);
			},
			getWidth(flag){
				if(flag == true){//影藏
				document.getElementById('radioGroup').style.backgroundColor = '#19aa8d';
				this.startAnimation(flag, 65);
					
				}else{
					this.startAnimation(flag, 200);
				}
			},
			startAnimation(flag,num){
				var timer = null ;
				clearInterval(timer);
				var _ele = document.getElementById('content');
				var _eles = document.getElementById('header');
				timer = setInterval(function(){
					if(flag == true){
						_ele.style.left = _ele.offsetLeft - 5 + 'px';
						_eles.style.left = _eles.offsetLeft - 5 + 'px';
						if(_ele.offsetLeft <= (num+5) ){
							_ele.style.left = '65px';
							_eles.style.left = '65px';
							clearInterval(timer);
						}
					}else{
						_ele.style.left = _ele.offsetLeft + 5 + 'px';
						_eles.style.left = _eles.offsetLeft + 5 + 'px';
						if(_ele.offsetLeft >= (num-5)){
							_ele.style.left = '200px';
							_eles.style.left = '200px';
							clearInterval(timer);
						}
						
					}
				},10);
			}
		},
		computed:{
			onRoutes(){
				return this.$route.path;
			}
		},
		
	}
</script>
<style scoped>
	.iconfont {    vertical-align: middle; margin-right: 5px;width: 24px;text-align: center;font-size: 16px;display: inline-block;}
	.icon-nav {font-size:20px; margin:0 auto; line-height: 36px;}
	.radioGroup { background: #333;color: #fff;text-align: center;width: 100%;border: none;border-radius: 0;}
	.radioGroup:hover {background:#19aa8d; transition:all .3s;}
	#app .el-menu-item  , #app .el-submenu , #app .el-menu-item,#app .el-submenu__title , #app #titles{font-weight: normal; height:40px !important; line-height: 40px !important;}
	.el-submenu__title span{font-weight: normal;float:left}
	.el-submenu__title i{float: left;}
	.el-submenu__title:after{display:block;clear:both;content:"";visibility:hidden;height:0;zoom: 1;}
	.img {height:58px; position: relative;}
	.img .img1 {height: 58px;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);}
	.el-menu {background-color:#2f4050;}
	.el-submenu .el-menu-item {background:#333 !important;}
	.space-item{padding-left:7px;}
	#app .el-menu-item.is-active{color:#fff;}
	@keyframes scaling{
		from{transform: scale(0.6)}
		to{transform: scale(1.2)}
	}
	.new-star{font-size: 6px;color: #00BCD4!important;animation:scaling 0.7s linear infinite;}
	/* .el-menu-item:focus, .el-menu-item:hover, .el-submenu__title:hover {background-color:#203040;} */
</style>