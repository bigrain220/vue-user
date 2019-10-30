<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon-mokuaiguanli iconfont"></i>优化设置</el-breadcrumb-item>
                <el-breadcrumb-item>分类设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div id="modules">
            <el-table stripe :data="dataList" style="width: 100%">
                <el-table-column prop="id" label="ID" sortable width="120"></el-table-column>
                <el-table-column prop="name" label="导航标题" ></el-table-column>
                <el-table-column prop="title" label="网页标题" ></el-table-column>
                <el-table-column prop="keywords" label="网页关键词" ></el-table-column>
                <el-table-column prop="description" label="网页描述"></el-table-column>
                <el-table-column prop="rows" label="行数"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope"><el-switch v-model="dataList[scope.$index].status"  @change="changeStatus(scope.row)"  active-value="1" inactive-value="0"></el-switch></template>
                </el-table-column>
                <el-table-column label="操作" width="220">
                    <template slot-scope="scope">
                    <el-button icon="el-icon-edit" size="mini" type="primary" @click="edit(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="编辑模块" :visible.sync="dialogVisible"  width="50%">
            <el-form :model="Editform" :rules="rules" ref="Editform" label-width="100px" class="demo-ruleForm">
                <el-form-item label="导航标题" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="Editform.name" placeholder="字数限制 20 字以内" :maxlength="20" @input="descInput('name')"></el-input>
                    <div class="remnant"><span class="contentcount">{{remnant1}}</span>/20</div>
                </el-form-item>
                <el-form-item label="网页标题" prop="title" :label-width="formLabelWidth">
                    <el-input v-model="Editform.title" placeholder="字数限制 30 字以内" :maxlength="30" @input="descInput('title')"></el-input>
                    <div class="remnant"><span class="contentcount">{{remnant2}}</span>/30</div>
                </el-form-item>
               <el-form-item label="网页关键词" prop="keywords" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" v-model="Editform.keywords" auto-complete="off" placeholder="字数限制 80 字以内" :maxlength="80" @input="descInput('keywords')"></el-input>
                    <div class="remnant"><span class="contentcount">{{remnant3}}</span>/80</div>
                </el-form-item>
                <el-form-item label="网页描述" prop="description" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" v-model="Editform.description" auto-complete="off" placeholder="字数限制 100 字以内" :maxlength="100" @input="descInput('description')"></el-input>
                    <div class="remnant"><span class="contentcount">{{remnant4}}</span>/100</div>
                </el-form-item>
                <el-form-item label="行数" prop="rows" :label-width="formLabelWidth">
                    <el-input-number :min="1" v-model="Editform.rows" controls-position="right"></el-input-number>
                    <span>注：在每个模板对应的列表页面中每页个数</span>
                </el-form-item>
                <el-form-item label="排序" prop="level" :label-width="formLabelWidth">
                   <el-input-number :min="0" v-model="Editform.level" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item label="状态" prop="staus">
                    <el-switch v-model="Editform.status"   active-text="启用" inactive-text="禁止" active-value="1" inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('Editform')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import API from '../../api/api.js'
    export default {
        name:'Module',
        data() {
            return {
                remnant:'',
                remnant1:0,
                remnant2:0,
                remnant3:0,
                remnant4:0,
                dataList:[],
                dialogVisible:false,
                Editform:{
                    id:'',name:'',title:'',keywords:'',description:'',rows:'',level:'',status:''
                },
                formLabelWidth:'120px',
                rules:{
                    name:[{ max: 20, message: '长度在 20 个字数以内', trigger: 'blur' }],
                    title:[{ max: 30, message: '长度在 30 个字数以内', trigger: 'blur' }],
                    keywords:[{ max: 80, message: '长度在 80 个字数以内', trigger: 'blur' }],
                    description:[{ max: 100, message: '长度在 100 个字数以内', trigger: 'blur' }],
                }
            }
        },
        methods: {
            descInput(key){
                switch(key) {
                    case 'name':
                        this.remnant = this.Editform.name.length;
                        if(this.remnant>20){this.remnant1 = 20;}
                        else{this.remnant1 = this.remnant;}
                    break;
                    case 'title':
                        this.remnant = this.Editform.title.length;
                        if(this.remnant>30){this.remnant2 = 30;}
                        else{this.remnant2 = this.remnant;}
                    break;
                    case 'keywords':
                        this.remnant = this.Editform.keywords.length;
                        if(this.remnant>80){this.remnant3 = 80;}
                        else{this.remnant3 = this.remnant;}
                    break;
                    case 'description':
                        this.remnant = this.Editform.description.length;
                        if(this.remnant>100){this.remnant4 = 100;}
                        else{this.remnant4 = this.remnant;}
                    break;
                }
            },
            getModules() {
                API.ModuleList({}).then(rs => {
                    // rs.unshift({id:'0',title:'首页标题',keywords:'首页关键词',description:'首页描述',status:"1",level:"1"});
                    this.dataList = rs;
                }).catch(error => {console.log(error)})  
            },
            edit(id){
                API.ModuleList({id:id}).then(rs => {
                    this.Editform = rs;
                    this.remnant1 = this.Editform.name.length;
                    this.remnant2 = this.Editform.title.length;
                    this.remnant3 = this.Editform.keywords.length;
                    this.remnant4 = this.Editform.description.length;
                }).catch(error => {console.log(error)})
                this.dialogVisible = true;
            },
            changeStatus(row){
				let params = {id:row.id , status: row.status}
				 API.ModuleEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！'); /*this.getModules();*/}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});
			},
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                if (valid) {
                   API.ModuleEdit(this.Editform).then(rs => {
                       if(rs.code == 1){
                           this.$message.success('信息修改成功');
                           this.$refs[formName].resetFields();
                           this.dialogVisible = false;
                           this.getModules();  
                       }else{
                           this.$message.error(rs.msg)
                       }
                   }).catch(error => {console.log(error)})
                } else {
                    return false;
                }
                });
            },
        },
        mounted:function(){
            this.getModules();  
        }
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin:0; padding:0;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 400px;
        margin-right: 20px;
        margin-bottom: 20px;
    }
    ul li {list-style: none; padding-bottom:10px; overflow: hidden;}
    #modules {display: flex; flex-wrap: wrap; }
    #modules .el-table {margin-top:0;}
    li span:nth-child(1) {width:60px; text-align: right; padding-right:14px; font-weight: bold; display: inline-block;}
    .el-col {    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #19aa8d;}
    .el-row {padding-top:20px;}
    .remnant {position: absolute; bottom:0; right:10px; font-size: 12px; color: #606266;}
</style>