<template>
	<div class="editJobcats">
        <editCats v-bind:catsKey = 'catsKey'></editCats>
	</div>
</template>
<script>
	import editCats from '../../common/editCats.vue'
	export default {
		components:{editCats},
		name: 'editJobcats',
		data() {
			return {
				catsKey:{id:'jobs', name:'招聘', path:'Job' , icon:'icon-job'},
			}
		},
		methods: {
			
		}

	}
</script>