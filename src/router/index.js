import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect: '/user/Index'
    },
    {
      path:'/nofound',
      component:resolve => require(['@/components/common/nofound.vue'],resolve)
    },
    {
      path:'/login',
      name:'Login',
      component:resolve => require(['@/components/login/login'],resolve)
    },
    {
    	path:'/user',
      component: resolve => require(['@/components/common/home'], resolve),
    	children:[

        // {path:'', component:WebSite, name:'WebSite'},
    	  {
    	    path: 'webSite/:id',
    	    component: resolve => require(['@/components/Web/webSite'], resolve),
    	    name: 'WebSite',
    	    meta: {
    	      requireAuth: true
    	    }
    	  }, {
    	    path: 'News/:id',
          component: resolve => require(['@/components/AddData/News/News'], resolve),
    	    name: 'News',
    	    meta: {
    	      requireAuth: true
    	    }
    	  }, {
    	    path: 'News/:id/addNews',
    	    component: resolve => require(['@/components/AddData/News/addNews'], resolve),
    	    name: 'addNews',
    	    meta: {
    	      requireAuth: true
    	    }
    	  }, {
    	    path: 'News/editNews/:editId',
    	    component: resolve => require(['@/components/AddData/News/editNews'], resolve),
    	    name: 'editNews',
    	    meta: {
    	      requireAuth: true
    	    }
    	  }, {
    	    path: 'News/:id/addNewscats',
    	    component: resolve => require(['@/components/AddData/News/addNewscats'], resolve),
    	    name: 'addNewscats',
    	    meta: {
    	      requireAuth: true
    	    }
    	  }, {
    	    path: 'News/editNewscats/:id',
    	    component: resolve => require(['@/components/AddData/News/editNewscats'], resolve),
    	    name: 'editNewscats',
    	    meta: {
    	      requireAuth: true
    	    }
    	  },

        {
          path: 'Case/:id',
          component: resolve => require(['@/components/AddData/Case/Case'], resolve),
          name: 'Case',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Case/:id/addCase',
          component: resolve => require(['@/components/AddData/Case/addCase'], resolve),
          name: 'addCase',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Case/editCase/:editId',
          component: resolve => require(['@/components/AddData/Case/editCase'], resolve),
          name: 'editCase',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Case/:id/addCasecats',
          component: resolve => require(['@/components/AddData/Case/addCasecats'], resolve),
          name: 'addCasecats',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Case/editCasecats/:id',
          component: resolve => require(['@/components/AddData/Case/editCasecats'], resolve),
          name: 'editCasecats',
          meta: {
            requireAuth: true
          }
        },

        {
          path: 'Product/:id',
          component: resolve => require(['@/components/AddData/Product/Product'], resolve),
          name: 'Product',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Product/:id/addProduct',
          component: resolve => require(['@/components/AddData/Product/addProduct'], resolve),
          name: 'addProduct',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Product/editProduct/:editId',
          component: resolve => require(['@/components/AddData/Product/editProduct'], resolve),
          name: 'editProduct',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Product/:id/addProductcats',
          component: resolve => require(['@/components/AddData/Product/addProductcats'], resolve),
          name: 'addProductcats',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Product/editProductcats/:id',
          component: resolve => require(['@/components/AddData/Product/editProductcats'], resolve),
          name: 'editProductcats',
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'Down/:id',
          component: resolve => require(['@/components/AddData/Download/Down'], resolve),
          name: 'Down',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Down/:id/addDown',
          component: resolve => require(['@/components/AddData/Download/addDown'], resolve),
          name: 'addDown',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Down/editDown/:editId',
          component: resolve => require(['@/components/AddData/Download/editDown'], resolve),
          name: 'editDown',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Down/:id/addDowncats',
          component: resolve => require(['@/components/AddData/Download/addDowncats'], resolve),
          name: 'addDowncats',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Down/editDowncats/:id',
          component: resolve => require(['@/components/AddData/Download/editDowncats'], resolve),
          name: 'editDowncats',
          meta: {
            requireAuth: true
          }
        },

        {
          path: 'Video/:id',
          component: resolve => require(['@/components/AddData/Video/Video'], resolve),
          name: 'Video',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Video/:id/addVideo',
          component: resolve => require(['@/components/AddData/Video/addVideo'], resolve),
          name: 'addVideo',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Video/editVideo/:editId',
          component: resolve => require(['@/components/AddData/Video/editVideo'], resolve),
          name: 'editVideo',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Video/:id/addVideocats',
          component: resolve => require(['@/components/AddData/Video/addVideocats'], resolve),
          name: 'addVideocats',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Video/editVideocats/:id',
          component: resolve => require(['@/components/AddData/Video/editVideocats'], resolve),
          name: 'editVideocats',
          meta: {
            requireAuth: true
          }
        },

        {
          path: 'Job/:id',
          component: resolve => require(['@/components/AddData/Job/Job'], resolve),
          name: 'Job',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Job/:id/addJob',
          component: resolve => require(['@/components/AddData/Job/addJob'], resolve),
          name: 'addJob',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Job/editJob/:editId',
          component: resolve => require(['@/components/AddData/Job/editJob'], resolve),
          name: 'editJob',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Job/:id/addJobcats',
          component: resolve => require(['@/components/AddData/Job/addJobcats'], resolve),
          name: 'addJobcats',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Job/editJobcats/:id',
          component: resolve => require(['@/components/AddData/Job/editJobcats'], resolve),
          name: 'editJobcats',
          meta: {
            requireAuth: true
          }
        },

        {
          path: 'Support/:id',
          component: resolve => require(['@/components/AddData/Support/Support'], resolve),
          name: 'Support',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Support/:id/addSupport',
          component: resolve => require(['@/components/AddData/Support/addSupport'], resolve),
          name: 'addSupport',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Support/editSupport/:editId',
          component: resolve => require(['@/components/AddData/Support/editSupport'], resolve),
          name: 'editSupport',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Support/:id/addSupportcats',
          component: resolve => require(['@/components/AddData/Support/addSupportcats'], resolve),
          name: 'addSupportcats',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Support/editSupportcats/:id',
          component: resolve => require(['@/components/AddData/Support/editSupportcats'], resolve),
          name: 'editSupportcats',
          meta: {
            requireAuth: true
          }
        },

        {
          path: 'Feedback',
          component: resolve => require(['@/components/AddData/Feedback/feedback'], resolve),
          name: 'Feedback',
          meta: {
            requireAuth: true
          }
        },

        {
          path: 'Template',
          component: resolve => require(['@/components/Template/Template'], resolve),
          name: 'Template',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Lanuage',
          component: resolve => require(['@/components/Template/Lanuage'], resolve),
          name: 'Lanuage',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'templateOwn',
          component: resolve => require(['@/components/Template/templateOwn'], resolve),
          name: 'templateOwn',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Order',
          component: resolve => require(['@/components/Template/Order'], resolve),
          name: 'Order',
          meta: {
            requireAuth: true
          }
        }, 
        {
          path: 'minApp',
          component: resolve => require(['@/components/Template/minApp'], resolve),
          name: 'minApp',
          meta: {
            requireAuth: true
          }
        },
        

        {
          path: 'Single',
          component: resolve => require(['@/components/AddData/Single/Single'], resolve),
          name: 'Single',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Single/addSingle',
          component: resolve => require(['@/components/AddData/Single/addSingle'], resolve),
          name: 'addSingle',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Single/editSingle/:editId',
          component: resolve => require(['@/components/AddData/Single/editSingle'], resolve),
          name: 'editSingle',
          meta: {
            requireAuth: true
          }
        },

        {
          path: 'Link',
          component: resolve => require(['@/components/AddData/Link/Link'], resolve),
          name: 'Link',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Link/addLink',
          component: resolve => require(['@/components/AddData/Link/addLink'], resolve),
          name: 'addLink',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Link/editLink/:editId',
          component: resolve => require(['@/components/AddData/Link/editLink'], resolve),
          name: 'editLink',
          meta: {
            requireAuth: true
          }
        },

        {
          path: 'Banner',
          component: resolve => require(['@/components/AddData/Banner/Banner'], resolve),
          name: 'Banner',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Banner/addBanner',
          component: resolve => require(['@/components/AddData/Banner/addBanner'], resolve),
          name: 'addBanner',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Banner/editBanner/:editId',
          component: resolve => require(['@/components/AddData/Banner/editBanner'], resolve),
          name: 'editBanner',
          meta: {
            requireAuth: true
          }
        },

        {
          path: 'Notice',
          component: resolve => require(['@/components/AddData/Notice/Notice'], resolve),
          name: 'Notice',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Notice/addNotice',
          component: resolve => require(['@/components/AddData/Notice/addNotice'], resolve),
          name: 'addNotice',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Notice/editNotice/:editId',
          component: resolve => require(['@/components/AddData/Notice/editNotice'], resolve),
          name: 'editNotice',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Module',
          component: resolve => require(['@/components/Module/module'], resolve),
          name: 'Module',
          meta: {
            requireAuth: true
          }
        },

        {
          path: 'Code/code',
          component: resolve => require(['@/components/code/code'], resolve),
          name: 'Code',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Code/editCode',
          component: resolve => require(['@/components/code/editCode'], resolve),
          name: 'editCode',
          meta: {
            requireAuth: true
          }
        },

        {
          path: 'Index',
          component: resolve => require(['@/components/index/index'], resolve),
          name: 'Index',
          meta: {
            requireAuth: true,
            title: '首页'
          }
        },

        {
          path: 'Keywords',
          component: resolve => require(['@/components/optimize/keywords'], resolve),
          name: 'Keywords',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Title',
          component: resolve => require(['@/components/optimize/title'], resolve),
          name: 'Title',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Paragraph',
          component: resolve => require(['@/components/optimize/paragraph'], resolve),
          name: 'Paragraph',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Published',
          component: resolve => require(['@/components/optimize/published'], resolve),
          name: 'Published',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Setting',
          component: resolve => require(['@/components/optimize/setting'], resolve),
          name: 'Setting',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'Article',
          component: resolve => require(['@/components/optimize/article'], resolve),
          name: 'Article',
          meta: {
            requireAuth: true
          }
        }, {
          path: 'ArticleAuto',
          component: resolve => require(['@/components/autoArticle/autoArticle'], resolve),
          name: 'ArticleAuto',
          meta: {
            requireAuth: true
          }
        },
        
      ]
    },
    {
        path:'*',
        // redirect:'/user/webSite/1'
        redirect:'/user/Index'
    }
  ]
})
