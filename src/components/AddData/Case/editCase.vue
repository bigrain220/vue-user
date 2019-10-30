<template>
	<div class="editCase">
		<editModules v-bind:catsKey="catsKey"></editModules>
	</div>
</template>
<script>
	import editModules from '../../common/editModules.vue'
	export default {
		name: 'editCase',
		components: {editModules},
		data() {
			return {
				catsKey:{id:'case', name:'案例', path:'Case' , icon:'icon-anliguanli'},	
			}
		},
		mouthed:function(){
			console.log('你是怎么进来的？',this.catsKey)
		},

	}
</script>
