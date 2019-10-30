<template>
	<div class="login-wrap">	
		<div class="page-info">
			<div class="page-brand">
				<div class="brand"><img :src="image" alt=""></div>
				<h2>一站通 网络管理用户后台系统</h2>
				<ul class="list">
					<li><i></i>一站通网站管理系统，企业网站建设神器。功能强大且拥有数千套精美网站模板，是企业建站最得力的建站神器。</li>
					<li><i></i>帮助企业轻松建站，打造网络营销新生态；强大的自助建站平台，为你解决公司网站搭建；网站模板丰富，可根据企业需要随意更换模板。</li>
				</ul>
				<div class="hidden-sm">
					<a href="http://www.g3wei.com/"><i></i>返回官网</a>
					<a href="http://www.g3wei.com/site/"><i></i>网站模板</a>
					<a href="javascript::"><i></i> 联系客服</a>
				</div>
			</div>
		</div>
		<div class="page-login">
			<div class="ms-title">一站通用户后台管理系统</div>
			<div class="ms-login">
				<el-form  :model="loginForm" ref="loginForm" :rules="ruleForm" class="demo-ruleForm login-container">
					<el-form-item prop="username">
						<el-input type="text" v-model="loginForm.username" placeholder="用户名" auto-complete="on"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" label="password" v-model="loginForm.password" placeholder="密码" @keydown.enter.native="handleSubmit"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" style="width:100%" :loading="logining" @click.native.prevent="handleSubmit">立即登录</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div id="bgImg"><img :src="bgImage" alt=""></div>
	</div>
</template>
<script>	
	import API from '../../api/api';
	export default {
		name:'Login',
		data() {
			return {
				image:'./static/img/logo1.png',
				bgImage:'./static/img/bg.jpg',
				logining: false,
				loginForm:{
					username: '',
					password: ''
				},
				ruleForm:{
					username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
					password: [{ required: true, message: '输入密码', trigger: 'blur' }]
				},
			}
		},
		methods: {
			handleSubmit(val){
				this.$refs.loginForm.validate((valid) => {
					if(valid){
						this.logining = true;
						API.login(this.loginForm).then(rs => {
							this.logining = false;
							if(rs.code == 1){
								window.username = this.loginForm.username;
								localStorage.setItem('g3_username',this.loginForm.username)
								this.$router.push({path: '/user/webSite'});
								this.$message.success('登录成功！');
								
							}else{
								this.$message.error('用户名或密码出错！');
							}
						})
					}
				})
			}
		},
		mounted:function(){
			this.$store.commit('clear'); //清空store 数据
		}
	}
	
</script>
<style scoped>
	.login-wrap{background:#324157;position:relative;width:100%;height:100%}
	.page-info{width:100%;height:100%;box-sizing:border-box;padding:20px 20px;padding-right:500px;position:absolute;z-index:99}
	.page-brand{position:absolute;height:auto;top:50%;transform:translateY(-50%);padding:0 60px 60px 60px;box-sizing:border-box}
	.brand{margin-bottom:22px}
	.brand img{height:50px}
	h2{font-size:20px;font-weight:500;color:#fff;margin:0 0 22px 0}
	.list{list-style:none;padding:0;color:#fff;font-size:14px;margin:0 0 22px 0}
	.list li{margin-bottom:6px}
	.hidden-sm a{color:#fff;background:#62a8ea;display:block;float:left;padding:5px 13px;border-radius:4px;margin-right:10px;text-decoration:none;font-size:14px}
	.hidden-sm a:nth-child(2){background:#46be8a}
	.hidden-sm a:nth-child(3){background:#57c7d4}
	.page-login{position:absolute;width:500px;height:100%;top:0;right:0;background:#fff;z-index:99;overflow:hidden;box-sizing:border-box;padding:0 60px}
	.ms-title{z-index:99;position:absolute;top:50%;left:0;width:100%;margin-top:-180px;text-align:center;font-size:30px;color:#333}
	.ms-login{z-index:99;width:100%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);box-sizing:border-box;padding:0 60px}
	.el-form-item{margin-bottom:30px}
	#bgImg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;opacity:.2}
	#bgImg img{width:100%;height:auto}
</style>