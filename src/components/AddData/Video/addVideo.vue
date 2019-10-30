<template>
	<div class="addVideo">
		<addModules v-bind:catsKey="catsKey"></addModules>
	</div>
</template>
<script>
	// import editor from '../../common/imageUpload.vue';
	// import elSingleUpload from '../../common/singleUploadImage.vue';
	// import API from '../../../api/api';
	import addModules from '../../common/addModules.vue'
	export default {
		name: 'addVideo',
		components: {addModules},
		data() {
			return {
				catsKey:{id:'video', name:'视频', path:'Video',icon:"icon-video"},	
			}
		},
		methods: {
			
		}

	}
</script>
