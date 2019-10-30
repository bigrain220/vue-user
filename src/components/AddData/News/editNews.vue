<template>
	<div class="editNews">
		<editModules v-bind:catsKey="catsKey"></editModules>
	</div>
</template>
<script>
	import editModules from '../../common/editModules.vue'
	export default {
		name: 'editNews',
		components: {editModules},
		data() {
			return {
				catsKey:{id:'news', name:'新闻', path:'News' , icon:'icon-xinwen'},	
			}
		},
		mouthed:function(){
			
		},
		

	}
</script>
