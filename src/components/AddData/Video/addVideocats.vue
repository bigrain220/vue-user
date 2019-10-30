<template>
	<div class="addVideocats">
       <addCats v-bind:catsKey = 'catsKey'></addCats>
	</div>
</template>
<script>
	import addCats from '../../common/addCats.vue';
	export default {
		components:{addCats},
		name: 'addVideocats',
		data() {
			return {
				catsKey:{id:'video', name:'视频', path:'Video',icon:"icon-video"},
			}
		},
		methods: {
			
		},

	}
</script>