<template>
	<div class="addCase">
		<addModules v-bind:catsKey="catsKey"></addModules>
	</div>
</template>
<script>
	import addModules from '../../common/addModules.vue'
	export default {
		name: 'addCase',
		components: {addModules},
		data() {
			return {
				catsKey:{id:'case', name:'案例', path:'Case' , icon:'icon-anliguanli'},	
			}
		},
		methods: {
			
		}

	}
</script>
