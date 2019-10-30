<template>
	<div class="header" id="header">
		<!-- <div class="img"><img class="img1" :src="image"></div> -->
		<div class="box_top">
			<el-button @click="addQ" id="addQ" type="text">充值钻石</el-button>
			<el-button type="text" @click="preview" id="preview">预览网站</el-button>
			<el-select id="language" class="select" v-model="langConfig.name" placeholder="切换语言" @change="changeLang">
			<el-option v-for="item in langConfig.options" :key="item.lid" :label="item.name" :value="item.lid"></el-option>
			</el-select>	
			<el-dropdown trigger="click">
			  <span class="el-dropdown-link">
			    <img :src="src" alt="" class="userlogo" height="20">{{userMsg.username}}<i class="el-icon-caret-bottom el-icon--right"></i>
			  </span>
			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>
<script>
	import API from '../../api/api.js'
	import {mapState} from 'vuex'
	export default {
		inject: ['reload'],
		name:'Header',
		data() {
			return {
				loading:false,
				src:'./static/img/admin.png',
			}
		},
		methods:{
			addQ(){
				window.open('/user/pay/index');
			},
			preview(){
				window.open('http://'+ this.$store.state.userMsg.username +'.'+API.DomainName);
				
			},
			loginOut(){
				let that = this;
				this.$confirm('确认要退出系统吗?', '提示', {type: 'warning',
					confirmButtonClass: 'el-button--warning'
				}).then(() => {
					that.loading = true;
					API.loginOut({}).then(function (rs) {
				if(rs.code == 1){
					that.loading = false;
					that.$router.push({path: '/login'});
					that.$message.success('退出系统') 
				}else{
					this.$message.error(rs.msg);
				}
					}).catch(() => {
					that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
					})
				}).catch(() => {});
				
			},
			
			
			changeLang(value){
				console.log(this,value)
				this.loading = true;
				this.$confirm('即将切换语言数据库,是否要切换？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info'
				}).then(() => {
					API.lidSwitch({lid:value}).then(rs => {
						if(rs.code == 1){
							this.reload();
							this.$router.push({path:'/user/WebSite'})
							this.$message.success('语言切换成功');
						}else if (rs.code == 0 ){
							this.$message.error('语言切换失败');
						}
					}).catch(error => {console.log(error)})
				}).catch(() => {})
				
			},
		},
		computed:mapState(['langConfig' , 'userMsg']),
	}
</script>
<style scoped>
	.img {height:60px;}
	.img img {margin-left:-30px;}
	.el-dropdown-link {
		color: #fff;
    display: block;
    padding-left: 30px;
	}
	.userlogo {
		    height:16px;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
	}
	.el-select {width:150px;}
	.el-select .el-input__inner {background:rgba(0,0,0,.5)}
	.header {
		position: absolute;
		box-sizing: border-box;
		height: 60px;
		line-height: 60px;
		color: #fff;
		background: #242f42;
		top: 0;
		right: 0;
		left: 200px;
		overflow: hidden;
		display: flex;
		justify-content: flex-end;
		}
	.box_top {display:flex; margin-right:30px;}
	.box_top .el-button {margin:0 10px;}
	.box_top .el-button {margin:0 10px;}
	.box_top .el-select {margin:0 10px;}
	.box_top .el-input {margin:0 10px;}
	.box_top .el-dropdown {margin:0 10px;}
	.box_top .el-select.select{
		width: 115px;
  }
</style>