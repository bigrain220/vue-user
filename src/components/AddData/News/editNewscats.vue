<template>
	<div class="editNewscats">
         <editCats v-bind:catsKey = 'catsKey'></editCats>
	</div>
</template>
<script>
	import editCats from '../../common/editCats.vue'
	export default {
		components:{editCats},
		name: 'editNewscats',
		data() {
			return {
				catsKey:{id:'news', name:'新闻', path:'News' , icon:'icon-xinwen'},	
			}
		},
		methods: {
			
		}

	}
</script>
