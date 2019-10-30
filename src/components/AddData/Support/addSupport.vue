<template>
	<div class="addSupport">
		<addModules v-bind:catsKey="catsKey"></addModules>
	</div>
</template>
<script>
	import addModules from '../../common/addModules.vue'
	export default {
		name: 'addSupport',
		components: {addModules},
		data() {
			return {
				catsKey:{id:'support', name:'帮助', path:'Support' , icon:'icon-help'},	
			}
		},
		methods: {
			
		}

	}
</script>
