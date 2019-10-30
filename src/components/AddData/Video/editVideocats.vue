<template>
	<div class="Video">
        <editCats v-bind:catsKey = 'catsKey'></editCats>
	</div>
</template>
<script>
	import editCats from '../../common/editCats.vue'
	export default {
		components:{editCats},
		name: 'editVideocats',
		data() {
			return {
				catsKey:{id:'video', name:'视频', path:'Video' , icon:'icon-video'},
			}
		},
		methods: {
			
		}

	}
</script>
