<template>
	<div class="Downcats">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-xiazai"></i>下载</el-breadcrumb-item>
                <el-breadcrumb-item>下载分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<catsList v-bind:catsKey = 'catsKey'></catsList>
	</div>
</template>
<script>
	import catsList from '../../common/catsList.vue'
	export default {
		components:{catsList},
		name: 'Downcats',
		data() {
			return {
				catsKey:{id:'download',name:'下载'}
			}
		},
		methods: {

		}
	}
</script>