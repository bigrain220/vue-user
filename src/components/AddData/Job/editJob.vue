<template>
	<div class="editJob">
		<editModules v-bind:catsKey="catsKey"></editModules>
	</div>
</template>
<script>
	// import elSingleUpload from '../../common/singleUploadImage.vue';
	// import editor from '../../common/imageUpload.vue';
	// import API from '../../../api/api';
	import editModules from '../../common/editModules.vue'
	export default {
		name: 'editJob',
		components: {editModules},
		data() {
			return {
				catsKey:{id:'jobs', name:'招聘', path:'Job' , icon:'icon-job'},	
			}
				
		},
		mouthed:function(){

		},

	}
</script>