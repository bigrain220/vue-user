<template>
	<div class="editCasecats">
         <editCats v-bind:catsKey = 'catsKey'></editCats>
	</div>
</template>
<script>
	import editCats from '../../common/editCats.vue'
	export default {
		components:{editCats},
		name: 'editCasecats',
		data() {
			return {
				catsKey:{id:'case', name:'案例', path:'Case' , icon:'icon-anliguanli'},	
			}
		},
		methods: {
			
		}

	}
</script>