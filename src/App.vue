<template>
  <div id="app">
     <!-- <transition name="el-fade-in-linear"><router-view v-show="show"></router-view><transition -->
     <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  provide () {
    return {
      reload: this.reload
    }
  },
  data: () => {
  	return {
      show:true,
      isRouterAlive: true,
  	}
  },
  methods: {
    reload (){
      this.isRouterAlive = false;
      this.$nextTick(function(){
          this.isRouterAlive = true
       })
    },

  },

}
</script>
