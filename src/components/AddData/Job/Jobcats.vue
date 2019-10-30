<template>
	<div class="Job">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-job"></i>招聘</el-breadcrumb-item>
                <el-breadcrumb-item>招聘分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<catsList v-bind:catsKey = 'catsKey'></catsList>
	</div>
</template>
<script>
	import catsList from '../../common/catsList.vue'
	export default {
		components:{catsList},
		name: 'Jobcats',
		data() {
			return {
				catsKey:{id:'jobs',name:'招聘'}
			}
		},
		methods: {

		}
	}
</script>