<template>
	<div class="addProdutcats">
        <addCats v-bind:catsKey = 'catsKey'></addCats>
	</div>
</template>
<script>
	import addCats from '../../common/addCats.vue';
	export default {
		components:{addCats},
		name: 'addProdutcats',
		data() {
			return {
				catsKey:{id:'product', name:'产品', path:'Product' , icon:'icon-chanpinzhongxin'},		
			}
		},
		methods: {
			
		},

	}
</script>
