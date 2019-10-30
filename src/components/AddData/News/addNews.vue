<template>
	<div class="addNews">
		<addModules v-bind:catsKey="catsKey"></addModules>
	</div>
</template>
<script>
	import addModules from '../../common/addModules.vue'
	export default {
		name: 'addNews',
		components: {addModules},
		data() {
			return {
				catsKey:{id:'news', name:'新闻', path:'News' , icon:'icon-xinwen'},	
			}
		},
		methods: {
			
		}

	}
</script>
