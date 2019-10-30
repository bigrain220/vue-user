<template>
	<div id="main">
		<Header></Header>
		<leftNav></leftNav>
		<div class="content" id="content">
			<transition name="el-fade-in" mode="out-in" appear><router-view></router-view></transition>
		</div>
		
	</div>
</template>
<script>
	import Header from './header.vue'
	import leftNav from './leftNav.vue'
	export default {
		name:'Home',
		components: {Header , leftNav},
		methods:{
		},
	}
</script>