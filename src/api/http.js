import axios from 'axios'
import {getCookie} from 'util.js'

axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://web.51g4.com/user';


// http request 拦截器，通过这个，我们就可以把Cookie传到后台
axios.interceptors.request.use(
	config => {
		const token = getCookie('session');//h获取cookie
		config.data = JSON.stringify(config.data);
		config.headers = {
			'Content-Type':'application/x-www-form-urlencoded' //设置跨域头部
		};

		if(token) {
			config.params = {'token' : token}
		}
		return config;
	},
	err => {
		return Promise.reject(err);
	}
);



 export default axios;
/**
 * fetch 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
 export function fetch(url, params = {}) {
 	return new Promise((resolve, reject) => {
 		axios.get(url,{params:params})
 		.then(res => { resolve(res.data); })
 		.catch(err => { reject(err) })
 	})
 }
 /**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
 export function post(url, data = {}) {
 	return new Promise((resolve, reject) => {
 		axios.post(url, data)
 		.then(res => { resolve(res.data); }, err => { reject(err); })
 	})
}
/**
 * patch 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
 export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(res => {
        resolve(res.data);
      }, err => {
        reject(err);
      })
  })
}
 
/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(res => {
        resolve(res.data);
      }, err => {
        reject(err);
      })
  })
}

