import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login/login'
import Home from '@/components/common/home'

import WebSite from '@/components/Web/webSite'
import News from '@/components/AddData/News/News'
import addNews from '@/components/AddData/News/addNews'
import editNews from '@/components/AddData/News/editNews'
import addNewscats from '@/components/AddData/News/addNewscats'
import editNewscats from '@/components/AddData/News/editNewscats'
import Case from '@/components/AddData/Case/Case'
import addCase from '@/components/AddData/Case/addCase'
import editCase from '@/components/AddData/Case/editCase'
import addCasecats from '@/components/AddData/Case/addCasecats'
import editCasecats from '@/components/AddData/Case/editCasecats'

import Product from '@/components/AddData/Product/product'
import addProduct from '@/components/AddData/Product/addProduct'
import editProduct from '@/components/AddData/Product/editProduct'
import addProductcats from '@/components/AddData/Product/addProductcats'
import editProductcats from '@/components/AddData/Product/editProductcats'

import Down from '@/components/AddData/Download/Down'
import addDown from '@/components/AddData/Download/addDown'
import editDown from '@/components/AddData/Download/editDown'
import addDowncats from '@/components/AddData/Download/addDowncats'
import editDowncats from '@/components/AddData/Download/editDowncats'

import Video from '@/components/AddData/Video/Video'
import addVideo from '@/components/AddData/Video/addVideo'
import editVideo from '@/components/AddData/Video/editVideo'
import addVideocats from '@/components/AddData/Video/addVideocats'
import editVideocats from '@/components/AddData/Video/editVideocats'

import Job from '@/components/AddData/Job/Job'
import addJob from '@/components/AddData/Job/addJob'
import editJob from '@/components/AddData/Job/editJob'
import addJobcats from '@/components/AddData/Job/addJobcats'
import editJobcats from '@/components/AddData/Job/editJobcats'

import Support from '@/components/AddData/Support/Support'
import addSupport from '@/components/AddData/Support/addSupport'
import editSupport from '@/components/AddData/Support/editSupport'
import addSupportcats from '@/components/AddData/Support/addSupportcats'
import editSupportcats from '@/components/AddData/Support/editSupportcats'

import Template from '@/components/Template/Template'
import Lanuage from '@/components/Template/Lanuage'
import templateOwn from '@/components/Template/templateOwn'
import Order from '@/components/Template/Order'

import Single from '@/components/AddData/Single/Single'
import addSingle from '@/components/AddData/Single/addSingle'
import editSingle from '@/components/AddData/Single/editSingle'

import Link from '@/components/AddData/Link/Link'
import addLink from '@/components/AddData/Link/addLink'
import editLink from '@/components/AddData/Link/editLink'

import Banner from '@/components/AddData/Banner/Banner'
import addBanner from '@/components/AddData/Banner/addBanner'
import editBanner from '@/components/AddData/Banner/editBanner'

import Notice from '@/components/AddData/Notice/Notice'
import addNotice from '@/components/AddData/Notice/addNotice'
import editNotice from '@/components/AddData/Notice/editNotice'

import Feedback from '@/components/AddData/Feedback/feedback'

import Module from '@/components/Module/module'

import Code from '@/components/code/code'
import editCode from '@/components/code/editCode'

import Index from '@/components/index/index'

import Keywords from '@/components/SEO/keywords'
import Paragraph from '@/components/SEO/paragraph'
import Published from '@/components/SEO/published'
import Title from '@/components/SEO/title'
import Setting from '@/components/SEO/setting'
import Article from '@/components/SEO/article'

import Nofound from '@/components/common/nofound.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect: '/user/Index'
    },
    {
      path:'/nofound',
      component:Nofound,
    },
    {
      path:'/login',
      name:'Login',
      component:Login
    },
    {
    	path:'/user',
    	component:Home,
    	children:[

        // {path:'', component:WebSite, name:'WebSite'},
    	  {path:'webSite/:id', component:WebSite, name:'WebSite',meta: {requireAuth: true}},
        {path:'News/:id', component:News, name:'News',meta: {requireAuth: true}},
        {path:'News/:id/addNews', component:addNews, name:'addNews',meta: {requireAuth: true}},
        {path:'News/editNews/:editId', component:editNews, name:'editNews',meta: {requireAuth: true}},
        {path:'News/:id/addNewscats', component:addNewscats, name:'addNewscats',meta: {requireAuth: true}},
        {path:'News/editNewscats/:id', component:editNewscats, name:'editNewscats',meta: {requireAuth: true}},

        {path:'Case/:id', component:Case, name:'Case',meta: {requireAuth: true}},
        {path:'Case/:id/addCase', component:addCase, name:'addCase',meta: {requireAuth: true}},
        {path:'Case/editCase/:editId', component:editCase, name:'editCase',meta: {requireAuth: true}},
        {path:'Case/:id/addCasecats', component:addCasecats, name:'addCasecats',meta: {requireAuth: true}},
        {path:'Case/editCasecats/:id', component:editCasecats, name:'editCasecats',meta: {requireAuth: true}},

        {path:'Product/:id', component:Product, name:'Product',meta: {requireAuth: true}},
        {path:'Product/:id/addProduct', component:addProduct, name:'addProduct',meta: {requireAuth: true}},
        {path:'Product/editProduct/:editId', component:editProduct, name:'editProduct',meta: {requireAuth: true}},
        {path:'Product/:id/addProductcats', component:addProductcats, name:'addProductcats',meta: {requireAuth: true}},
        {path:'Product/editProductcats/:id', component:editProductcats, name:'editProductcats',meta: {requireAuth: true}},
        
        {path:'Down/:id', component:Down, name:'Down',meta: {requireAuth: true}},
        {path:'Down/:id/addDown', component:addDown, name:'addDown',meta: {requireAuth: true}},
        {path:'Down/editDown/:editId', component:editDown, name:'editDown',meta: {requireAuth: true}},
        {path:'Down/:id/addDowncats', component:addDowncats, name:'addDowncats',meta: {requireAuth: true}},
        {path:'Down/editDowncats/:id', component:editDowncats, name:'editDowncats',meta: {requireAuth: true}},

        {path:'Video/:id', component:Video, name:'Video',meta: {requireAuth: true}},
        {path:'Video/:id/addVideo', component:addVideo, name:'addVideo',meta: {requireAuth: true}},
        {path:'Video/editVideo/:editId', component:editVideo, name:'editVideo',meta: {requireAuth: true}},
        {path:'Video/:id/addVideocats', component:addVideocats, name:'addVideocats',meta: {requireAuth: true}},
        {path:'Video/editVideocats/:id', component:editVideocats, name:'editVideocats',meta: {requireAuth: true}},

        {path:'Job/:id', component:Job, name:'Job',meta: {requireAuth: true}},
        {path:'Job/:id/addJob', component:addJob, name:'addJob',meta: {requireAuth: true}},
        {path:'Job/editJob/:editId', component:editJob, name:'editJob',meta: {requireAuth: true}},
        {path:'Job/:id/addJobcats', component:addJobcats, name:'addJobcats',meta: {requireAuth: true}},
        {path:'Job/editJobcats/:id', component:editJobcats, name:'editJobcats',meta: {requireAuth: true}},

        {path:'Support/:id', component:Support, name:'Support',meta: {requireAuth: true}},
        {path:'Support/:id/addSupport', component:addSupport, name:'addSupport',meta: {requireAuth: true}},
        {path:'Support/editSupport/:editId', component:editSupport, name:'editSupport',meta: {requireAuth: true}},
        {path:'Support/:id/addSupportcats', component:addSupportcats, name:'addSupportcats',meta: {requireAuth: true}},
        {path:'Support/editSupportcats/:id', component:editSupportcats, name:'editSupportcats',meta: {requireAuth: true}},

        {path:'Feedback', component:Feedback, name:'Feedback', meta: {requireAuth:true}},

        {path:'Template', component:Template, name:'Template',meta: {requireAuth: true}},
        {path:'Lanuage', component:Lanuage, name:'Lanuage',meta: {requireAuth: true}},
        {path:'templateOwn', component:templateOwn, name:'templateOwn',meta: {requireAuth: true}},
        {path:'Order', component:Order, name:'Order',meta: {requireAuth: true}},

        {path:'Single', component:Single, name:'Single',meta: {requireAuth: true}},
        {path:'Single/addSingle', component:addSingle, name:'addSingle',meta: {requireAuth: true}},
        {path:'Single/editSingle/:editId', component:editSingle, name:'editSingle',meta: {requireAuth: true}},   

        {path:'Link', component:Link, name:'Link',meta: {requireAuth: true}},
        {path:'Link/addLink', component:addLink, name:'addLink',meta: {requireAuth: true}},
        {path:'Link/editLink/:editId', component:editLink, name:'editLink',meta: {requireAuth: true}},

        {path:'Banner', component:Banner, name:'Banner',meta: {requireAuth: true}},
        {path:'Banner/addBanner', component:addBanner, name:'addBanner',meta: {requireAuth: true}},
        {path:'Banner/editBanner/:editId', component:editBanner, name:'editBanner',meta: {requireAuth: true}},

        {path:'Notice', component:Notice, name:'Notice',meta: {requireAuth: true}},
        {path:'Notice/addNotice', component:addNotice, name:'addNotice',meta: {requireAuth: true}},
        {path:'Notice/editNotice/:editId', component:editNotice, name:'editNotice',meta: {requireAuth: true}},
        {path:'Module', component:Module, name:'Module',meta: {requireAuth: true}},

        {path:'Code/code',component:Code , name:'Code',meta: {requireAuth:true}},
        {path:'Code/editCode',component:editCode , name:'editCode',meta: {requireAuth:true}},

        {path:'Index',component:Index , name:'Index',meta: {requireAuth:true , title:'首页'}},

        {path:'Keywords', component:Keywords, name:'Keywords',meta: {requireAuth: true}},
        {path:'Title', component:Title, name:'Title',meta: {requireAuth: true}},
        {path:'Paragraph', component:Paragraph, name:'Paragraph',meta: {requireAuth: true}},
        {path:'Published', component:Published, name:'Published',meta: {requireAuth: true}},
        {path:'Setting', component:Setting, name:'Setting',meta: {requireAuth: true}},
        {path:'Article', component:Article, name:'Article',meta: {requireAuth: true}},
        
      ]
    },
    {
        path:'*',
        // redirect:'/user/webSite/1'
        redirect:'/user/Index'
    }
  ]
})
