<template>
	<div class="editDowncats">
         <editCats v-bind:catsKey = 'catsKey'></editCats>
	</div>
</template>
<script>
	import editCats from '../../common/editCats.vue'
	export default {
		components:{editCats},
		name: 'editDowncats',
		data() {
			return {
				catsKey:{id:'download', name:'下载', path:'Down' , icon:'icon-xiazai'},	
			}
		},
		methods: {
			
		}

	}
</script>