<template>
	<div class="editVideo">
		<editModules v-bind:catsKey="catsKey"></editModules>
	</div>
</template>
<script>
	// import elSingleUpload from '../../common/singleUploadImage.vue';
	// import editor from '../../common/imageUpload.vue';
	// import API from '../../../api/api';
	import editModules from '../../common/editModules.vue'
	export default {
		name: 'editVideo',
		components: {editModules},
		data() {
			return {
				catsKey:{ids:'video', name:'视频', path:'Video' , icon:'icon-video'},	
			}
				
		},
		mouthed:function(){
		},

	}
</script>