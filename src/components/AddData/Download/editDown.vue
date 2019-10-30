<template>
	<div class="editDown">
		<editModules v-bind:catsKey="catsKey"></editModules>
	</div>
</template>
<script>
	import editModules from '../../common/editModules.vue'
	export default {
		name: 'editDown',
		components: {editModules},
		data() {
			return {
				catsKey:{id:'download', name:'下载', path:'Down' , icon:'icon-xiazai'},	
			}
				
		},
		mouthed:function(){
			console.log('你是怎么进来的？',this.catsKey)
		},

	}
</script>
