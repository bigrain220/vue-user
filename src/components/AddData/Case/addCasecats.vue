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
				catsKey:{id:'case', name:'案例', path:'Case' , icon:'icon-anliguanli'}	
			}
		},
		methods: {
			
		},

	}
</script>