<template>
	<div class="addJobcats">
        <addCats v-bind:catsKey = 'catsKey'></addCats>
	</div>
</template>
<script>
	import addCats from '../../common/addCats.vue';
	export default {
		components:{addCats},
		name: 'addJobcats',
		data() {
			return {
				catsKey:{id:'jobs', name:'招聘', path:'Job' , icon:'icon-job'},	
			}
		},
		methods: {
			
		},

	}
</script>