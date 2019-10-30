<template>
	<div class="Template" id="Template">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-moban"></i>模板</el-breadcrumb-item>
                <el-breadcrumb-item>我的模板</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<el-table stripe :data="dataList" style="width: 100%" v-loading="loading">
        	<el-table-column prop="id" label="ID"></el-table-column>
        	<el-table-column prop="tid" label="模板编号" ></el-table-column>
        	<el-table-column prop="name" label="模板名称"></el-table-column>
        	<el-table-column fixed="right" label="操作" width="200">
				<template slot-scope="scope">
					<!-- <el-button @click="config()" type="text" size="small">配置</el-button> -->
					<el-button @click="downClick(scope.row)" type="text" size="small">下载</el-button>
				</template>
				</el-table-column>
        </el-table>
	</div>
</template>
<script>
	import API from '../../api/api';
	import  util  from '../../api/util.js';
	import VueQr from 'vue-qr'
	export default {
		name: 'templateOwn',
		components:{VueQr},
		data() {
			return {
				dataList:[],
				loading:false,
				url:'',
			}
		},
		methods: {
			getTempList(){
				API.tempList({}).then(rs => {
					this.dataList = rs;
				}).catch(error => { console.log(error)})
			},
			downClick(row){
				window.location.href = 'http://'+document.domain+ '/spec/'+row.tid+'.zip';
			},
			config(){
				this.$router.push({path:'/user/WebSite'})
			}
		},
		mounted:function(){
			if(this.dataList.length == 0){
				this.getTempList();
			}
		}

	}
</script>
<style scoped>
	
</style>