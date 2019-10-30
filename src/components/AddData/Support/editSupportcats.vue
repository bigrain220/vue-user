<template>
	<div class="editSupportcats">
        <editCats v-bind:catsKey = 'catsKey'></editCats>
	</div>
</template>
<script>
	import editCats from '../../common/editCats.vue'
	export default {
		components:{editCats},
		name: 'editSupportcats',
		data() {
			return {
				catsKey:{id:'support', name:'帮助', path:'Support' , icon:'icon-help'},
			}
		},
		methods: {
			
		}

	}
</script>