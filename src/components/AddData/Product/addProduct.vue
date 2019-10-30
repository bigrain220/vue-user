<template>
	<div class="addProduct">
		<addModules v-bind:catsKey="catsKey"></addModules>
	</div>
</template>
<script>
	import addModules from '../../common/addModules.vue'
	export default {
		name: 'addProduct',
		components: {addModules},
		data() {
			return {
				catsKey:{id:'product', name:'产品', path:'Product' , icon:'icon-chanpinzhongxin'},	
			}
		},
		mounted:function(){
			
		},
		

	}
</script>
