<template>
	<div class="addSupportcats">
        <addCats v-bind:catsKey = 'catsKey'></addCats>
	</div>
</template>
<script>
	import addCats from '../../common/addCats.vue';
	export default {
		components:{addCats},
		name: 'addSupportcats',
		data() {
			return {
				catsKey:{id:'support', name:'帮助', path:'Support' , icon:'icon-help'},	
			}
		},
		methods: {
			
		},

	}
</script>