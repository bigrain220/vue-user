
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import util from './api/util.js'
import { Message } from 'element-ui'
import store from './vuex/store'
import 'babel-polyfill'

Vue.use(ElementUi)
Vue.config.productionTip = false;

if(util.changHost().indexOf('g3wei')>0){
// 线上
router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
        if(navigator.userAgent.indexOf('MSIE') > -1 && (to.path === '/user/News/addNews' || to.path === '/user/Case/addCase' || to.path === '/user/Product/addProduct' || to.path === '/user/Down/addDown' || to.path === '/user/Video/addVideo' || to.path === '/user/Job/addJob' || to.path === '/user/Support/addSupport' || to.path === '/user/Single/addSingle' || to.path === '/user/Banner/addBanner' || to.path === '/user/Notice/addNotice' || to.path === '/user/Link/addLink')){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else if(util.getCookie('auth') == null){
          if(window.configFlag == true){//如果是第一次进入
            window.configFlag = false;
            next({path:'/login'})
          }else{
            Message.success('抱歉，你还没有登录请重新登录');
            next({ path:'/login'})
          }
        }else{
          window.addEventListener('load', function(){
            next({ path:'/'})
          })
          next();
        }
    }else{
        next();
    }
})
}

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

