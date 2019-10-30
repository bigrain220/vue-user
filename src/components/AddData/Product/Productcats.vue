<template>
	<div class="Product">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-chanpinzhongxin"></i>产品</el-breadcrumb-item>
                <el-breadcrumb-item>产品分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<catsList v-bind:catsKey = 'catsKey'></catsList>
	</div>
</template>
<script>
	import catsList from '../../common/catsList.vue'
	export default {
		components:{catsList},
		name: 'Productcats',
		data() {
			return {
				catsKey:{id:'product',name:'产品'}	
			}
		},
		methods: {

		}
	}
</script>
