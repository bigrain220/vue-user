<template>
	<div class="Supportcats">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-help"></i>帮助</el-breadcrumb-item>
                <el-breadcrumb-item>帮助分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<catsList v-bind:catsKey = 'catsKey'></catsList>
	</div>
</template>
<script>
	import catsList from '../../common/catsList.vue'
	export default {
		components:{catsList},
		name: 'Supportcats',
		data() {
			return {
				catsKey:{id:'support',name:'帮助'}	
			}
		},
		methods: {

		}
	}
</script>