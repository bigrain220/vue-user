import Vue from 'vue'
import Vuex from 'vuex'
import util from '../api/util'
Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        userMsg:{},
        langConfig:{options:[] , name:''},
        widList:[],

    },
    mutations: {
        getUsername(state , value){
            value.expired = util.format(value.expired , 'yyyy-MM-dd')
            value.modified = util.format(value.modified , 'yyyy-MM-dd')
            state.userMsg = value;
        },
        getLanglist(state , value){
            state.langConfig.options = value;
            value.map(element => {
				if(element.disabled){state.langConfig.name = element.name;}
			});
        },
        getwidList(state , value){
            state.widList = value;
        },
        clear(state){
            state.userMsg = {};
            state.langConfig = {options:[] , name:''}
        },
    },
    getters:{

    }
})

export default store