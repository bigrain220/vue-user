import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import util from './util.js'
import router from '../router/index.js'
import { MessageBox } from 'element-ui';


Vue.prototype.$axios = axios;

if(util.changHost().indexOf('g3wei')<0){
  // 线下域名
  var DomainName = 'web.51g4.com';
} else {
// 线上域名
  var DomainName = '';
  document.domain == 'www.g3wei.com' ? DomainName = 'b.g3wei.com' : DomainName = document.domain;
}
let rootUrl = '';
document.domain == 'www.g3wei.com' ? rootUrl = '//' + document.domain + '/user' : rootUrl = 'http://web.51g4.com/user';

  axios.defaults.timeout = 6000;
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.defaults.headers.post['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8';
  axios.defaults.withCredentials = true; //用axios发送post请求自动set cookie

//http response 服务器响应拦截器，
if(util.changHost().indexOf('g3wei')>0){
// 线上
axios.interceptors.response.use(
  response => {
      if(response.config.url == rootUrl+'/login' || response.config.url == rootUrl+'/logout'){
        return response;
      }else if(util.getCookie('auth') == null || (response.data != null && response.data.msg == 'FAILED_LOGIN')){
          MessageBox.alert('您已下线，请重新登录', '下线提示', {
            confirmButtonText: '确定',
            callback: action => {
              router.push({ path:'/login'})
            }
          });
      }else{
        return response;
      }
    },
  error => {
      return Promise.reject(error.response) 
})
}


export default {
  DomainName : DomainName ,
  login:  params => {
    return axios.post(`${rootUrl}/login`, qs.stringify(params)).then(rs => rs.data);
  },

  loginOut:  params => {
    return axios.post(`${rootUrl}/logout`, qs.stringify(params)).then(rs => rs.data);
  },

  userGet: params => {
    return axios.post(`${rootUrl}/user/get`, qs.stringify(params)).then(rs => rs.data);
  },

  //获取新闻列表
  newsList:  params => {
    return axios.post(`${rootUrl}/news/list`, qs.stringify(params)).then(rs => rs.data);
  },

  newsDel:  params => {
    return axios.post(`${rootUrl}/news/delete`, qs.stringify(params)).then(rs => rs.data);
  },

  newscatsList:  params => {
    return axios.post(`${rootUrl}/newscats/list`, qs.stringify(params)).then(rs => rs.data);
  },
  newsAdd:  params => {
    return axios.post(`${rootUrl}/news/add`, qs.stringify(params)).then(rs => rs.data);
  },
  newsEdit:  params => {
    return axios.post(`${rootUrl}/news/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  newscatsEdit:  params => {
    return axios.post(`${rootUrl}/newscats/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  newscatsAdd:  params => {
    return axios.post(`${rootUrl}/newscats/add`, qs.stringify(params)).then(rs => rs.data);
  },
  newscatsDel:  params => {
    return axios.post(`${rootUrl}/newscats/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  getConfig:  params => {
    return axios.post(`${rootUrl}/config/get`, qs.stringify(params)).then(rs => rs.data);
  },
  ConfigEdit:  params => {
    return axios.post(`${rootUrl}/config/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  getDomain:  params => {
    return axios.post(`${rootUrl}/domain/get`, qs.stringify(params)).then(rs => rs.data);
  },
  delDomain:  params => {
    return axios.post(`${rootUrl}/domain/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  addDomain:  params => {
    return axios.post(`${rootUrl}/domain/add`, qs.stringify(params)).then(rs => rs.data);
  },
  editDomain:  params => {
    return axios.post(`${rootUrl}/domain/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  getuserConfig:  params => {
    return axios.post(`${rootUrl}/userconfig/list`, qs.stringify(params)).then(rs => rs.data);
  },
  adduserConfig:  params => {
    return axios.post(`${rootUrl}/userconfig/add`, qs.stringify(params)).then(rs => rs.data);
  },
  edituserConfig:  params => {
    return axios.post(`${rootUrl}/userconfig/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  deluserConfig:  params => {
    return axios.post(`${rootUrl}/userconfig/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  langList:  params => {
    return axios.post(`${rootUrl}/userlanguage/list`, qs.stringify(params)).then(rs => rs.data);
  },
  lidSwitch: params => {
    return axios.post(`${rootUrl}/userlanguage/switch`, qs.stringify(params)).then(rs => rs.data);
  },
  tempList:  params => {
    return axios.post(`${rootUrl}/usertemplate/list`, qs.stringify(params)).then(rs => rs.data);
  },
  CaseList:  params => {
    return axios.post(`${rootUrl}/case/list`, qs.stringify(params)).then(rs => rs.data);
  },
  CaseAdd:  params => {
    return axios.post(`${rootUrl}/case/add`, qs.stringify(params)).then(rs => rs.data);
  },
  CaseDel:  params => {
    return axios.post(`${rootUrl}/case/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  CaseEdit:  params => {
    return axios.post(`${rootUrl}/case/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  CasecatsList:  params => {
    return axios.post(`${rootUrl}/casecats/list`, qs.stringify(params)).then(rs => rs.data);
  },
  CasecatsAdd:  params => {
    return axios.post(`${rootUrl}/casecats/add`, qs.stringify(params)).then(rs => rs.data);
  },
  CasecatsDel:  params => {
    return axios.post(`${rootUrl}/casecats/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  CasecatsEdit:  params => {
    return axios.post(`${rootUrl}/casecats/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  ProductcatsList:  params => {
    return axios.post(`${rootUrl}/productcats/list`, qs.stringify(params)).then(rs => rs.data);
  },
  ProductcatsGet:  params => {
    return axios.post(`${rootUrl}/productcats/get`, qs.stringify(params)).then(rs => rs.data);
  },
  NewscatsGet:  params => {
    return axios.post(`${rootUrl}/newscats/get`, qs.stringify(params)).then(rs => rs.data);
  },
  CasecatsGet:  params => {
    return axios.post(`${rootUrl}/casecats/get`, qs.stringify(params)).then(rs => rs.data);
  },
  DownloadcatsGet:  params => {
    return axios.post(`${rootUrl}/downloadcats/get`, qs.stringify(params)).then(rs => rs.data);
  },
  VideocatsGet:  params => {
    return axios.post(`${rootUrl}/videocats/get`, qs.stringify(params)).then(rs => rs.data);
  },
  JobscatsGet:  params => {
    return axios.post(`${rootUrl}/jobscats/get`, qs.stringify(params)).then(rs => rs.data);
  },
  SupportcatsGet:  params => {
    return axios.post(`${rootUrl}/supportcats/get`, qs.stringify(params)).then(rs => rs.data);
  },

  ProductcatsEdit:  params => {
    return axios.post(`${rootUrl}/productcats/edit`, qs.stringify(params)).then(rs => rs.data);
  },

  ProductcatsAdd:  params => {
    return axios.post(`${rootUrl}/productcats/add`, qs.stringify(params)).then(rs => rs.data);
  },
  ProductcatsDel:  params => {
    return axios.post(`${rootUrl}/productcats/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  ProductList:  params => {
    return axios.post(`${rootUrl}/product/list`, qs.stringify(params)).then(rs => rs.data);
  },
  ProductAdd:  params => {
    return axios.post(`${rootUrl}/product/add`, qs.stringify(params)).then(rs => rs.data);
  },

  ProductEdit:  params => {
    return axios.post(`${rootUrl}/product/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  ProductDel:  params => {
    return axios.post(`${rootUrl}/product/delete`, qs.stringify(params)).then(rs => rs.data);
  },


  DowncatsList:  params => {
    return axios.post(`${rootUrl}/downloadcats/list`, qs.stringify(params)).then(rs => rs.data);
  },

  DowncatsEdit:  params => {
    return axios.post(`${rootUrl}/downloadcats/edit`, qs.stringify(params)).then(rs => rs.data);
  },

  DowncatsAdd:  params => {
    return axios.post(`${rootUrl}/downloadcats/add`, qs.stringify(params)).then(rs => rs.data);
  },
  DowncatsDel:  params => {
    return axios.post(`${rootUrl}/downloadcats/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  DownList:  params => {
    return axios.post(`${rootUrl}/download/list`, qs.stringify(params)).then(rs => rs.data);
  },
  DownAdd:  params => {
    return axios.post(`${rootUrl}/download/add`, qs.stringify(params)).then(rs => rs.data);
  },

  DownEdit:  params => {
    return axios.post(`${rootUrl}/download/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  DownDel:  params => {
    return axios.post(`${rootUrl}/download/delete`, qs.stringify(params)).then(rs => rs.data);
  },

  VideocatsList:  params => {
    return axios.post(`${rootUrl}/videocats/list`, qs.stringify(params)).then(rs => rs.data);
  },

  VideocatsEdit:  params => {
    return axios.post(`${rootUrl}/videocats/edit`, qs.stringify(params)).then(rs => rs.data);
  },

  VideocatsAdd:  params => {
    return axios.post(`${rootUrl}/videocats/add`, qs.stringify(params)).then(rs => rs.data);
  },
  VideocatsDel:  params => {
    return axios.post(`${rootUrl}/videocats/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  VideoList:  params => {
    return axios.post(`${rootUrl}/video/list`, qs.stringify(params)).then(rs => rs.data);
  },
  VideoAdd:  params => {
    return axios.post(`${rootUrl}/video/add`, qs.stringify(params)).then(rs => rs.data);
  },

  VideoEdit:  params => {
    return axios.post(`${rootUrl}/video/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  VideoDel:  params => {
    return axios.post(`${rootUrl}/video/delete`, qs.stringify(params)).then(rs => rs.data);
  },


  JobcatsList:  params => {
    return axios.post(`${rootUrl}/jobscats/list`, qs.stringify(params)).then(rs => rs.data);
  },

  JobcatsEdit:  params => {
    return axios.post(`${rootUrl}/jobscats/edit`, qs.stringify(params)).then(rs => rs.data);
  },

  JobcatsAdd:  params => {
    return axios.post(`${rootUrl}/jobscats/add`, qs.stringify(params)).then(rs => rs.data);
  },
  JobcatsDel:  params => {
    return axios.post(`${rootUrl}/jobscats/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  JobList:  params => {
    return axios.post(`${rootUrl}/jobs/list`, qs.stringify(params)).then(rs => rs.data);
  },
  JobAdd:  params => {
    return axios.post(`${rootUrl}/jobs/add`, qs.stringify(params)).then(rs => rs.data);
  },

  JobEdit:  params => {
    return axios.post(`${rootUrl}/jobs/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  JobDel:  params => {
    return axios.post(`${rootUrl}/jobs/delete`, qs.stringify(params)).then(rs => rs.data);
  },


  SupportcatsList:  params => {
    return axios.post(`${rootUrl}/supportcats/list`, qs.stringify(params)).then(rs => rs.data);
  },

  SupportcatsEdit:  params => {
    return axios.post(`${rootUrl}/supportcats/edit`, qs.stringify(params)).then(rs => rs.data);
  },

  SupportcatsAdd:  params => {
    return axios.post(`${rootUrl}/supportcats/add`, qs.stringify(params)).then(rs => rs.data);
  },
  SupportcatsDel:  params => {
    return axios.post(`${rootUrl}/supportcats/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  SupportList:  params => {
    return axios.post(`${rootUrl}/support/list`, qs.stringify(params)).then(rs => rs.data);
  },
  SupportAdd:  params => {
    return axios.post(`${rootUrl}/support/add`, qs.stringify(params)).then(rs => rs.data);
  },

  SupportEdit:  params => {
    return axios.post(`${rootUrl}/support/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  SupportDel:  params => {
    return axios.post(`${rootUrl}/support/delete`, qs.stringify(params)).then(rs => rs.data);
  },

  TemplateList:  params => {
    return axios.post(`${rootUrl}/template/list`, qs.stringify(params)).then(rs => rs.data);
  },
  ColorList:  params => {
    return axios.post(`${rootUrl}/color/list`, qs.stringify(params)).then(rs => rs.data);
  },
  IndustryList:  params => {
    return axios.post(`${rootUrl}/industry/list`, qs.stringify(params)).then(rs => rs.data);
  },
  TemplateBuy:  params => {
    return axios.post(`${rootUrl}/template/buy`, qs.stringify(params)).then(rs => rs.data);
  },

  ConsumeList:  params => {
    return axios.post(`${rootUrl}/consume/list`, qs.stringify(params)).then(rs => rs.data);
  },
// 小程序
  AppList:  params => {
    return axios.post(`${rootUrl}/app/list`, qs.stringify(params)).then(rs => rs.data);
  },
  AppBuy:  params => {
    return axios.post(`${rootUrl}/app/buy`, qs.stringify(params),{timeout: 30000}).then(rs => rs.data);
  },
  AppMake:  params => {
    return axios.post(`${rootUrl}/app/make`, qs.stringify(params)).then(rs => rs.data);
  },
  AppDown:  params => {
    return axios.post(`${rootUrl}/app/down`, qs.stringify(params)).then(rs => rs.data);
  },

  SingleList:  params => {
    return axios.post(`${rootUrl}/single/list`, qs.stringify(params)).then(rs => rs.data);
  },

  SingleEdit:  params => {
    return axios.post(`${rootUrl}/single/edit`, qs.stringify(params)).then(rs => rs.data);
  },

  SingleAdd:  params => {
    return axios.post(`${rootUrl}/single/add`, qs.stringify(params)).then(rs => rs.data);
  },
  SingleDel:  params => {
    return axios.post(`${rootUrl}/single/delete`, qs.stringify(params)).then(rs => rs.data);
  },

  LinkList:  params => {
    return axios.post(`${rootUrl}/link/list`, qs.stringify(params)).then(rs => rs.data);
  },
  LinkAdd:  params => {
    return axios.post(`${rootUrl}/link/add`, qs.stringify(params)).then(rs => rs.data);
  },
  LinkEdit:  params => {
    return axios.post(`${rootUrl}/link/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  LinkDel:  params => {
    return axios.post(`${rootUrl}/link/delete`, qs.stringify(params)).then(rs => rs.data);
  },

  BannerList:  params => {
    return axios.post(`${rootUrl}/banner/list`, qs.stringify(params)).then(rs => rs.data);
  },
  BannerAdd:  params => {
    return axios.post(`${rootUrl}/banner/add`, qs.stringify(params)).then(rs => rs.data);
  },
  BannerEdit:  params => {
    return axios.post(`${rootUrl}/banner/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  BannerDel:  params => {
    return axios.post(`${rootUrl}/banner/delete`, qs.stringify(params)).then(rs => rs.data);
  },

  NoticeList:  params => {
    return axios.post(`${rootUrl}/notice/list`, qs.stringify(params)).then(rs => rs.data);
  },
  NoticeAdd:  params => {
    return axios.post(`${rootUrl}/notice/add`, qs.stringify(params)).then(rs => rs.data);
  },
  NoticeEdit:  params => {
    return axios.post(`${rootUrl}/notice/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  NoticeDel:  params => {
    return axios.post(`${rootUrl}/notice/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  FeedbackList: params => {
    return axios.post(`${rootUrl}/message/list`, qs.stringify(params)).then(rs => rs.data);
  },
  FeedbackDel: params => {
    return axios.post(`${rootUrl}/message/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  CompanyGet:  params => {
    return axios.post(`${rootUrl}/company/get`, qs.stringify(params)).then(rs => rs.data);
  },

  ModuleList: params => {
    return axios.post(`${rootUrl}/module/list`, qs.stringify(params)).then(rs => rs.data);
  },
//OSS 信息
  ossGet:  params => {
    return axios.post(`${rootUrl}/oss/get`, qs.stringify(params)).then(rs => rs.data);
  },
  ossList:  params => {
    return axios.post(`${rootUrl}/oss/list`, qs.stringify(params)).then(rs => rs.data);
  },
//空间信息
  getSpace:  params => {
    return axios.post(`${rootUrl}/oss/space`, qs.stringify(params)).then(rs => rs.data);
  },
//文件夹列表
  getFolder:  params => {
    return axios.post(`${rootUrl}/oss/folder`, qs.stringify(params)).then(rs => rs.data);
  },
//图片（视频）删除
  ossDelete: params => {
    return axios.post(`${rootUrl}/oss/delete`, qs.stringify(params)).then(rs => rs.data);
  },

  ossRename: params => {
    return axios.post(`${rootUrl}/oss/rename`, qs.stringify(params)).then(rs => rs.data);
  },

  ossMove: params => {
    return axios.post(`${rootUrl}/oss/move`, qs.stringify(params)).then(rs => rs.data);
  },

  ModuleEdit:  params => {
    return axios.post(`${rootUrl}/module/edit`, qs.stringify(params)).then(rs => rs.data);
  },

  ManagerLogin: params => {
    return axios.post(`${rootUrl}/manager/login`, qs.stringify(params)).then(rs => rs.data);
  },
  ManagerLogout: params => {
    return axios.post(`${rootUrl}/manager/logout`, qs.stringify(params)).then(rs => rs.data);
  },
  ManagerTurnon: params => {
    return axios.post(`${rootUrl}/manager/turnon`, qs.stringify(params)).then(rs => rs.data);
  },
  ManagerTurnoff: params => {
    return axios.post(`${rootUrl}/manager/turnoff`, qs.stringify(params)).then(rs => rs.data);
  },
  ManagerGet: params => {
    return axios.post(`${rootUrl}/manager/get`, qs.stringify(params)).then(rs => rs.data);
  },
  ManagerEdit: params => {
    return axios.post(`${rootUrl}/manager/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  ManagerRename: params => {
    return axios.post(`${rootUrl}/manager/rename`, qs.stringify(params)).then(rs => rs.data);
  },
  ManagerCopy: params => {
    return axios.post(`${rootUrl}/manager/copy`, qs.stringify(params)).then(rs => rs.data);
  },
  ManagerCopy: params => {
    return axios.post(`${rootUrl}/manager/copy`, qs.stringify(params)).then(rs => rs.data);
  },
  ManagerDelete: params => {
    return axios.post(`${rootUrl}/manager/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  languageGet: params => {
    return axios.post(`${rootUrl}/language/get`, qs.stringify(params)).then(rs => rs.data);
  },
  languageBuy: params => {
    return axios.post(`${rootUrl}/language/buy`, qs.stringify(params)).then(rs => rs.data);
  },
  modules: params => {
    return axios.post(`${rootUrl}/overview/module`, qs.stringify(params)).then(rs => rs.data);
  },
  seo: params => {
    return axios.post(`${rootUrl}/overview/seo`, qs.stringify(params)).then(rs => rs.data);
  },
  seoGet: params => {
    return axios.post(`${rootUrl}/seo/get`, qs.stringify(params)).then(rs => rs.data);
  },
  seoBuy: params => {
    return axios.post(`${rootUrl}/seo/buy`, qs.stringify(params),{timeout: 30000}).then(rs => rs.data);
  },
  wordList: params => {
    return axios.post(`${rootUrl}/word/list`, qs.stringify(params)).then(rs => rs.data);
  },
  wordAdd: params => {
    return axios.post(`${rootUrl}/word/add`, qs.stringify(params)).then(rs => rs.data);
  },
  wordEdit: params => {
    return axios.post(`${rootUrl}/word/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  wordDel: params => {
    return axios.post(`${rootUrl}/word/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  wordSuggest: params => {
    return axios.post(`${rootUrl}/suggest/word`, qs.stringify(params)).then(rs => rs.data);
  },
  wordImport: params => {
    return axios.post(`${rootUrl}/word/import`, qs.stringify(params)).then(rs => rs.data);
  },
  wordSave: params => {
    return axios.post(`${rootUrl}/word/save`, qs.stringify(params)).then(rs => rs.data);
  },
  titleList: params => {
    return axios.post(`${rootUrl}/title/list`, qs.stringify(params)).then(rs => rs.data);
  },
  titleAdd: params => {
    return axios.post(`${rootUrl}/title/add`, qs.stringify(params)).then(rs => rs.data);
  },
  titleEdit: params => {
    return axios.post(`${rootUrl}/title/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  titleDel: params => {
    return axios.post(`${rootUrl}/title/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  sectionList: params => {
    return axios.post(`${rootUrl}/section/list`, qs.stringify(params)).then(rs => rs.data);
  },
  sectionAdd: params => {
    return axios.post(`${rootUrl}/section/add`, qs.stringify(params)).then(rs => rs.data);
  },
  sectionEdit: params => {
    return axios.post(`${rootUrl}/section/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  sectionDel: params => {
    return axios.post(`${rootUrl}/section/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  articleMake: params => {
    return axios.post(`${rootUrl}/article/make`, qs.stringify(params)).then(rs => rs.data);
  },
  articleList: params => {
    return axios.post(`${rootUrl}/article/list`, qs.stringify(params)).then(rs => rs.data);
  },
  articleAdd: params => {
    return axios.post(`${rootUrl}/article/add`, qs.stringify(params)).then(rs => rs.data);
  },
  articleEdit: params => {
    return axios.post(`${rootUrl}/article/edit`, qs.stringify(params)).then(rs => rs.data);
  },
  articleDel: params => {
    return axios.post(`${rootUrl}/article/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  GetEvent: params => {
    return axios.post(`${rootUrl}/event/get`, qs.stringify(params)).then(rs => rs.data);
  },
  DelEvent: params => {
    return axios.post(`${rootUrl}/event/delete`, qs.stringify(params)).then(rs => rs.data);
  },
  EditEvent: params => {
    return axios.post(`${rootUrl}/event/edit`, qs.stringify(params)).then(rs => rs.data);
  }

}


