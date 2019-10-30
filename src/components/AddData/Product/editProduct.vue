
<template>
	<div class="editProduct">
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
				catsKey:{id:'product', name:'产品', path:'Product' , icon:'icon-chanpinzhongxin'},	
			}
		},
		mounted:function(){
		
		},

	}
</script>
