<template>
	<div class="addCasecats">
        <addCats v-bind:catsKey = 'catsKey'></addCats>
	</div>
</template>
<script>
	import addCats from '../../common/addCats.vue';
	export default {
		components:{addCats},
		name: 'addCasecats',
		data() {
			return {
				catsKey:{id:'news', name:'新闻', path:'News' , icon:'icon-xinwen'},	
			}
		},
		methods: {
			
		},

	}
</script>