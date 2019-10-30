<template>
	<div class="news">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-xinwen"></i>新闻</el-breadcrumb-item>
                <el-breadcrumb-item>新闻分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<catsList v-bind:catsKey = 'catsKey'></catsList>
	</div>
</template>
<script>
	import catsList from '../../common/catsList.vue'
	export default {
		components:{catsList},
		name: 'Newscats',
		data() {
			return {
				catsKey:{id:'news',name:'新闻'}	
			}
		},
		methods: {

		}
	}
</script>