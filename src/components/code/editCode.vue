<template>
<div id="editCode">
    <div class="editCode">
        <div class="setting">
            <div class="filename">
                <span>{{files.filespath}}</span>
                <span>{{files.filesize}}</span>
                <span class="notation">(注意：此为您的模板源代码，请谨慎修改！)</span>
            </div>
            <div class="right">
                <el-button type="primary" @click="back">返回</el-button>
                <el-button type="success" @click="save">保存</el-button> 
            </div>        
        </div>
        <div id="code">
            <textarea v-loading="editLoading" name="code" ref="textarea">http://www.cnblogs.com/oldphper</textarea>
        </div>
    </div>
</div>
</template>
<script>
import Vue from 'vue'
import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/lib/codemirror.js'
import 'codemirror/theme/base16-dark.css'

import API from '@/api/api.js'
export default {
    name:'editCode',
    data() {
        return {
            ContentForm:{type:'',content:''},
            Editor: false,
            editLoading:true,
            filemessage:false,
            files:{filespath:'',filesize:''},
        }
    },
    methods: {
        back(){ 
            const param = {path:this.filemessage.path}
            this.$router.push({name:'Code' , params:param}) 
        },
        save(){
            const param = {file:this.$router.history.current.params.name , path:this.$router.history.current.params.path}
            param.content = this.Editor.getValue();
            API.ManagerEdit(param).then(rs => {
                if(rs.code == 1){
                    this.$message.success('文件保存成功');
                }
            }).catch(err => console.log(err))
        }
    },
    mounted() {
        if(JSON.stringify(this.$router.history.current.params) == "{}"){
            this.$router.push({path:'/user/Code/code'}); 
        }else{
            this.filemessage = this.$router.history.current.params
            console.log(this.filemessage)
            this.files.filesize = (this.filemessage.filesize/1024).toFixed(2);
            if(this.files.filesize >= 0 && this.files.filemessage < 1){
                this.files.filesize = this.filemessage.filesize + 'byte'
            }else{
                this.files.filesize = parseInt(this.files.filesize) + 'k';
            }
            const path = this.filemessage.path.replace(/\\/g,'/')
            this.files.filespath = path + '/' + this.filemessage.name;
            console.log(this.filemessage)
            this.Editor = CodeMirror.fromTextArea(this.$refs.textarea, {
                lineNumbers: true,
                // mode: 'text/html',
                gutters: ['CodeMirror-lint-markers'],
                // theme: 'base16-dark',
                lint: true,
                indentUnit : 2,
            })
            const height = document.getElementById('editCode').offsetHeight - 91;
            this.Editor.setSize('100%',height)
            const param = {file:this.filemessage.name , path:this.filemessage.path}
            API.ManagerGet(param).then(rs => {
                if(rs.code == 0){this.$message.error(rs.msg)}
                else{
                    this.ContentForm = rs;
                    this.Editor.setValue(this.ContentForm.content)
                    this.editLoading = false;
                }
            }).catch(err => console.log(err))
        }
       
    },
    computed: {
        
    },
}
</script>

<style scoped>
    
    .setting {border-bottom:1px solid #ddd; background:#fafbfc; box-sizing: border-box; padding:5px 10px; display:flex; justify-content: space-between; align-items: center;}
    .setting span {padding-right:10px; border-right:1px solid #ddd; font-size:14px; display:inline-block; padding-right:10px; margin-right:10px; height:16px; line-height: 16px;}
    .setting .notation {color:red; border-right:none;}
    #editCode {width:100%; height:100%; overflow:hidden; box-sizing: border-box;padding-top:20px;}
    .editCode {width:100%; height:100%; border:1px solid #ddd;}
    #code { height:100%; font:14px Helvetica Neue,Helvetica,PingFang SC,Tahoma,Arial,sans-serif; line-height: 1.5;}
    
</style>