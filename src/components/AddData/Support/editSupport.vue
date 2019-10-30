<template>
	<div class="editSupport">
		<editModules v-bind:catsKey="catsKey"></editModules>
	</div>
</template>
<script>
	// import elSingleUpload from '../../common/singleUploadImage.vue';
	// import editor from '../../common/imageUpload.vue';
	// import API from '../../../api/api';
	import editModules from '../../common/editModules.vue'
	export default {
		name: 'editSupport',
		components: {editModules},
		data() {
			return {
				catsKey:{id:'support', name:'帮助', path:'Support' , icon:'icon-help'},	
			}
				
		},
		mouthed:function(){

		},

	}
</script>