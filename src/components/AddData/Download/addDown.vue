<template>
	<div class="addDown">
		<addModules v-bind:catsKey="catsKey"></addModules>
	</div>
</template>
<script>
	import addModules from '../../common/addModules.vue'
	export default {
		name: 'addDown',
		components: {addModules},
		data() {
			return {
				catsKey:{id:'download', name:'下载', path:'Down' , icon:'icon-xiazai'},	
			}
		},
		methods: {
			
		}

	}
</script>