<template>
	<div class="editProductcats">
        <editCats v-bind:catsKey = 'catsKey'></editCats>
	</div>
</template>
<script>
	import editCats from '../../common/editCats.vue'
	export default {
		components:{editCats},
		name: 'editProductcats',
		data() {
			return {
				catsKey:{id:'product', name:'产品', path:'Product' , icon:'icon-chanpinzhongxin'},	
			}
		},
		methods: {
			
		}

	}
</script>
