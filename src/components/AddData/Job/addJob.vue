<template>
	<div class="addJob">
		<addModules v-bind:catsKey="catsKey"></addModules>
	</div>
</template>
<script>
	// import editor from '../../common/imageUpload.vue';
	// import elSingleUpload from '../../common/singleUploadImage.vue';
	// import API from '../../../api/api';
	import addModules from '../../common/addModules.vue'
	export default {
		name: 'addJob',
		components: {addModules},
		data() {
			return {
				catsKey:{id:'jobs', name:'招聘', path:'Job' , icon:'icon-job'},	
			}
		},
		methods: {
			
		}

	}
</script>-
