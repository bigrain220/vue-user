<template>
	<div class="Video">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-video"></i>视频</el-breadcrumb-item>
                <el-breadcrumb-item>视频分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<catsList v-bind:catsKey = 'catsKey'></catsList>
	</div>
</template>
<script>
	import catsList from '../../common/catsList.vue'
	export default {
		components:{catsList},
		name: 'Videocats',
		data() {
			return {
				catsKey:{id:'video',name:'视频'}	
			}
		},
		methods: {

		}
	}
</script>