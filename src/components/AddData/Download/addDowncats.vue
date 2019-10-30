<template>
	<div class="addDowncats">
        <addCats v-bind:catsKey = 'catsKey'></addCats>
	</div>
</template>
<script>
	import addCats from '../../common/addCats.vue';
	export default {
		components:{addCats},
		name: 'addDowncats',
		data() {
			return {
				catsKey:{id:'download', name:'下载', path:'Down' , icon:'icon-xiazai'},	
			}
		},
		methods: {
			
		},

	}
</script>