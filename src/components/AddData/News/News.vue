<template>
	<el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="新闻" name="one">
		    <div class="news">
				<Modules v-bind:catsKey = 'catsKey' ref="modules"></Modules>
		    </div>
      </el-tab-pane>
	  <el-tab-pane label="分类" name="two">
		  	<div class="news">
				<catsList v-bind:catsKey2 = 'catsKey2' ref="Cats"></catsList>
			</div>
	  </el-tab-pane>
	</el-tabs>
</template>
<script>
	import Modules from '../../common/modules.vue' 
	import catsList from '../../common/catsList.vue'
	export default {
		components:{Modules , catsList},
		name: 'News',
		data() {
			return {
				activeName:'one',
				catsKey:{id:'news', name:'新闻' , icon:'icon-xinwen'},
				catsKey2:{id:'news', name:'新闻'},
			}
		},
		methods: {
			handleClick(tab, event){
				if(tab.name == 'two' && this.$refs.Cats.dataList.length == 0){
					 this.$refs.Cats.getcatsList({});
				 }
				 if(tab.name == 'one' && this.$refs.modules.dataList.length == 0){
					 this.$refs.modules.getList({});
				 }
			},
		},
		mounted(){
			if(this.$router.history.current.params.id == 2){
				this.activeName = 'two';
				this.$refs.Cats.getcatsList({});
			}
			if(this.$router.history.current.params.id == 1){
				this.activeName = 'one';
				this.$refs.modules.getList({});
			}
		}


	}
</script>
<style scoped>

</style>

