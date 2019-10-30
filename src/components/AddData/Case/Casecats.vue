<template>
	<div class="case">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-anliguanli"></i>案例</el-breadcrumb-item>
                <el-breadcrumb-item>案例分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<catsList v-bind:catsKey = 'catsKey'></catsList>
	</div>
</template>
<script>
	import catsList from '../../common/catsList.vue'
	export default {
		components:{catsList},
		name: 'Casecats',
		data() {
			return {
				catsKey:{id:'case' , name:'案例'}	
			}
		},
		methods: {

		}
	}
</script>