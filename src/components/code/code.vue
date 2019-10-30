<template>
    
    <div :loading="loading">
        <div v-if="flag" class="el-form">
            <span>请输入代码管理密码：</span>
            <el-input type="password" v-model="ruleForm.password" placeholder="输入密码" @keydown.enter.native="managerLogin" ></el-input>
            <el-button :loading="barloading" type="primary" @click="managerLogin">确定</el-button>
        </div>
        <div v-else>
            <div class="fixed">
                <el-button type="success" @click="turnon">初始化模板</el-button>
                <el-button type="danger" @click="turnoff">关闭模板</el-button>
                <el-button type="primary" @click="downClick">模板标签文档下载(docx)</el-button>
                <el-button type="primary" @click="downClick2">模板标签文档下载(pdf)</el-button>
            </div>
            <el-table v-loading="tableLoading" :data="tableList" :row-style="showRow" border id="codeTable" >
                <el-table-column prop="name" label="文件名">
                    <template slot-scope="scope">
                            <span style="padding-left:10px;">
                                <i v-if="scope.row.type === 'dir'" class="iconfont icon-folder"></i>
                                <i v-else class="el-icon-document"></i>
                            </span>
                            <span class="tree-ctrl" @click="backFolder(scope)" v-if="scope.row.name === '..'">返回上一级</span>
                            <span class="tree-ctrl" @click="openFolder(scope)" v-else-if="scope.row.type === 'dir'">{{ scope.row.name }}</span>
                            <span class="tree-ctrl" @click="lookFiles(scope)" v-else-if="scope.row.extension === 'jpg' || scope.row.extension === 'png'" >{{ scope.row.name }}</span>
                            <span class="tree-ctrl" @click="editFiles(scope)" v-else>{{ scope.row.name }}</span>
                        </template>
                </el-table-column>
                <el-table-column prop="filemtime" label="时间" :formatter="formatCreate"></el-table-column>
                <el-table-column fixed="right" label="操作"  width="200">
                    <template  slot-scope="scope">
                            <el-button v-show="scope.row.extension === 'jpg' || scope.row.extension === 'png'" type="text" size="small" @click="lookFiles(scope)">预览</el-button>
                            <el-button v-show="scope.row.type === 'dir' && scope.row.name !== '..'" type="text" size="small" @click="openFolder(scope)">查看</el-button>
                            <el-button v-show="scope.row.type === 'file'" type="text" size="small" @click="copeFiles(scope)">复制</el-button>
                            <el-button v-show="scope.row.type === 'file' && scope.row.extension !== 'jpg' && scope.row.extension !== 'png'" type="text" size="small" @click="editFiles(scope)">编辑</el-button>
                            <el-button v-show="scope.row.type === 'file'" type="text" size="small" @click="openRenameFiles(scope)">重命名</el-button>
                            <el-button v-show="scope.row.type !== 'dir'" type="text" size="small" class="danger" @click="delFiles(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
        <el-dialog class="rename" :visible.sync="renameFilesVisibles"  width="800px" title="文件重命名">
            <el-form :model="renameForm" :rules="renameRules" ref="renameForm" label-width="100px" class="demo-ruleForm" style="width:100%;">
				<el-form-item label="原文件名：" prop="file">
					<el-input v-model="renameForm.file" disabled></el-input>
				</el-form-item>
				<el-form-item label="新文件名：" prop="newfile">
					<el-input class="names" v-model="renameForm.newfile" placeholder="新文件只用填写名称，不用写后缀名"></el-input>
                    <span>{{renameForm.names}}</span>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="renameFiles('renameForm')">确定</el-button>
				</el-form-item>
			</el-form>
        </el-dialog>
        <el-dialog :visible.sync="imgVisiblie" width="800px" title="预览图片">
            <img class="image" :src="image" alt="">
        </el-dialog>
    </div>
</template>

<script>
    import API from  '@/api/api.js'
    import util from '@/api/util.js'
    export default {
        name:'Code',
        data() {
            var reg =  /[\\/:*?"<>| ]/;
            var checkFilename = (rule,value,callback) => {
                console.log(rule , value , reg.test(value))
				value == '' ? callback() : reg.test(value) ? callback(new Error('文件名不能包含以下任何字符 \\/:*?"<>| ')) : callback();
			}
            return {
              ruleForm:{password:''},
              loading: true,
              barloading:false,
              tableLoading:true,
              flag:true,
              tableList:[],
              renameFilesVisibles:false,
              renameForm :{path:'' , file:'' , newfile:''},
              renameRules:{
                   newfile: [
                       {required: true, message: '请输入文件名' , trigger: 'blur'},
                       {trigger: 'change', validator:checkFilename},
                       { min: 0, max: 255, message: '长度在 0 到 255 个字符', trigger: 'blur' }
                    ],
              },
              imgVisiblie:false,
              image:'',
              number:'',
              userid:'',
            }
        },
        methods: {
            formatSize(row,column,cellValue){
                return parseInt(cellValue/1000) + 'K';
            },
            formatCreate(row,column,cellValue){
                return util.format(cellValue,'yyyy-MM-dd hh:mm');
            },
            
            showRow(row){
       
            },
            downClick(){
                window.location.href = 'http://'+document.domain+ '/模板开发.docx';
            },
            downClick2(){
                window.location.href = 'http://'+document.domain+ '/模板开发.pdf';
            },
            turnon(){
                this.$confirm('确定初始化当前模板吗？模板一旦初始化成功，代码将恢复成默认模板代码','警告',{
                 confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning',confirmButtonClass: 'el-button--warning'
                }).then(()=> {
                    this.loading = true;
                    API.ManagerTurnon().then(rs => {
                        if(rs.code == 0){this.$message.error(rs.msg)}
                        else{this.$message.success('模板初始化完成'); this.getManager({})}
                        this.loading = false;
                        this.number = '';
                    }).catch(err => console.log(err))
                }).catch(err => {console.log(err)})
            },
            
            turnoff(){
                this.$confirm('确定删除当前模板吗？一旦删除以前所有的修改将被删除','警告',{
                 confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning',confirmButtonClass: 'el-button--warning'
                }).then(()=> {
                    this.loading = true;
                    API.ManagerTurnoff().then(rs => {
                        if(rs.code == 0){this.$message.error(rs.msg)}
                        else{this.$message.success('模板已关闭'); this.flag = true;}
                        this.loading = false;
                        this.number = '';
                    }).catch(err => console.log(err))
                }).catch(err => {console.log(err)})
            },

            backFolder(scope){//返回上一级
                const url = scope.row.path.split('\\');
                API.ManagerGet({path: url[url.length - 2]}).then(rs => {
                    this.tableList = rs;
                }).catch(err => console.log(err))
            },

            openFolder(scope){//打开文件夹
                API.ManagerGet({path:  (scope.row.path) + '/' + (scope.row.name)}).then(rs => {
                    let arr = [];
                    rs.map((item , index) => {
                        if(item.name == ".."){
                            arr.unshift(item);
                        }else{
                            arr.push(item)
                        }   
                    })
                    this.tableList = arr ;
                }).catch(err => console.log(err))
            },

            copeFiles(scope){//复制文件
                API.ManagerCopy({path:scope.row.path , file:scope.row.name}).then(rs => {
                    console.log(rs)
                    if(rs.code == 1){this.getManager({path:scope.row.path});}
                    else {this.$message.error(rs.msg)}
                }).catch(err => console.log(err))
            },

            editFiles(scope){
                // const param = {file:scope.row.name , path:scope.row.path}
                const param = scope.row;
                this.$router.push({name:'editCode',params:param})
               
            },

            renameFiles(formName){//文件重命名
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        const params = { path: this.renameForm.path , file: this.renameForm.file , newfile:this.renameForm.newfile}
                        API.ManagerRename(params).then(rs => {
                            if(rs.code == 1){this.renameFilesVisibles = false; this.getManager({path:this.renameForm.path}); this.$refs[formName].resetFields(); }
                            else{this.$message.error(rs.msg)}
                        }).catch(err => {console.log(err)})
                    }
                })
                
            },

            delFiles(scope){//删除文件
                this.$confirm('确定删除'+scope.row.name+'文件吗？一旦删除无法恢复','警告',{
                    confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'
                }).then(()=> {
                    API.ManagerDelete({path:scope.row.path , file:scope.row.name}).then(rs => {
                        if(rs.code == 1){this.$message.success(scope.row.name + '文件已删除');this.getManager({path:scope.row.path});}
                        else {this.$message.error(rs.msg)}
                    }).catch(err => {console.log(err)})
                }).catch(() => {})
                
            },

            async lookFiles(scope){//图片预览
                this.imgVisiblie = true;
                scope.row.path = scope.row.path.replace(/\\/g,'/');
                if(this.userid == ''){
                    const rs1 = await API.userGet({}).catch(err => console.log(err))
                    this.userid = rs1.uid;
                    console.log(rs1);
                }
                if(this.number !== ''){
                    this.image = '/views/user/' + this.userid + '/' + this.number  + scope.row.path + '/' + scope.row.name; 
                }else{
                    let lid = '';
                    const rs2 = await API.langList().catch(err => console.log(err));
                    rs2.map((item,index) => {
                        if(item.is_default == 1){
                            lid = item.lid;
                        }
                    })
                    const rs3 = await API.getuserConfig().catch(err => console.log(err));
                    rs3.map((item,index) => {
                        if(item.lid == lid){
                            this.number = item.tid;
                        }
                    })
                    this.image = '/views/user/' + this.userid + '/' + this.number + scope.row.path + '/' + scope.row.name;
                }
                
            },

            openRenameFiles(scope){
                this.renameFilesVisibles = true;
                this.renameForm.file = scope.row.name;
                this.renameForm.path = scope.row.path;
                const names = scope.row.name.split('.');
                this.renameForm.names = '.' + names[names.length - 1];
            },

            managerLogin(){
                this.barloading = true;
                API.ManagerLogin({password:this.ruleForm.password}).then(rs => { 
                    if(rs.code == 0 && rs.msg == 'FAILURE'){ this.$message.warning('密码不正确') }
                    else if (rs.code == 1){
                        this.flag = false;
                        this.getManager({});
                    }
                    else {this.$message.warning(rs.msg)}
                    this.barloading = false;
                    console.log(rs , this.tableList)
                 })
            },

            getManager(param){
                API.ManagerGet(param).then(rs => {
                    this.tableLoading = false;
                    if(rs.code == 1){this.$message.warning(rs.msg)}
                    else{
                        const arr = [];
                        rs.map((item,index) => {
                            if(item.name == '..'){
                                arr.unshift(item)
                            }else{
                                arr.push(item)
                            }
                        })
                        this.tableList = arr;
                    }
                }).catch(err => console.log(err))
            },
        },
        mounted: function(){
            API.ManagerGet({path:this.$router.history.current.params.path}).then(rs => {
                if(rs.code == 0){this.flag = true;}
                else {
                    this.flag = false; 
                    this.tableLoading = false; 
                    let arr = [];
                    rs.map((item , index) => {
                        if(item.name == '..'){
                            arr.unshift(item)
                        }else{
                            arr.push(item)
                        }
                    })
                    this.tableList = arr;
                }
                this.loading = false;
            }).catch(err => console.log(err))
        },
    }
</script>

<style scoped>
    .el-form {padding:20px;}
    .el-form .el-input {width:400px; margin-right:20px;}
    .icon-folder {color:#efb336;}
    .el-icon-plus {color:#409EFF;}
    .tree-ctrl {cursor: pointer;}
    .tree-ctrl:hover {  color:#409EFF; }
    .danger {color:#F56C6C;}
    label {display:block;}
    label input {width:100px; margin-right:10px;}
    .fixed {padding: 10px 0;
    position: fixed;
    top: 61px;
    width: 100%;
    z-index: 999;
    background: #fff;
    border-bottom: 1px solid #ddd;}
    .el-table {margin:0; margin-top:61px;}
    label .el-input {display:inline-block; width:200px;}
    .rename .el-form .el-input {margin:0;}
    .rename .el-form .el-input.names {width:350px;}
    .image {width:100%;}
    .el-table td, .el-table th {padding:5px 0;}
</style>