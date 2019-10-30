<template>
    <div id="keywords">
        <div class="handle-box">
        	<el-button type="success" @click="addArticle">添加文章</el-button>
            <el-input placeholder="搜索关键字" clearable v-model="articleForm.value" class="input-with-select" @keydown.enter.native="searchForm">
				<el-select v-model="articleForm.name" slot="prepend" placeholder="标题">
                    <el-option label="标题名" value="title"></el-option>
					<el-option label="文章ID" value="id"></el-option>
				</el-select>
			</el-input>
            <el-select v-model="articleForm.tid" placeholder="类型" class="handle_select">
                <el-option label="手动" value="0"></el-option>
                <el-option label="自动" value="1"></el-option>
            </el-select>
            <el-select v-model="articleForm.status" placeholder="状态" class="handle_select">
                <el-option label="正常" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
            </el-select>
            <el-button type="primary"   @click="searchForm" style="margin-left:20px;">查询</el-button>
            <el-button @click="resetSearch" >重置</el-button>
            <el-tooltip class="item" effect="dark" placement="bottom">
                <div slot="content">当标题、段落都选择同一词库并且<br/>段落内容字数大于850字才可随机生成<br/>文章</div>
                <el-button type="primary" @click="articleMake">生成文章</el-button>
            </el-tooltip>
        	
        </div>
        <el-table stripe :data="dataList" border style="width: 100%">
            <el-table-column  prop="id" label="ID" width="120px"></el-table-column>
            <el-table-column  prop="title" label="文章标题"></el-table-column>
            <el-table-column  prop="created" label="创建时间" :formatter="formatCreated" width="220px"></el-table-column>
            <el-table-column prop="status" label="状态" width="220px">
                <template slot-scope="scope"><el-switch v-model="dataList[scope.$index].status"  @change="changeStatus(scope.row)"  active-value="1" inactive-value="0"></el-switch></template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit" size="mini" type="primary" @click="Edit(scope.row.id)"></el-button>
                    <el-button icon="el-icon-delete" size="mini" type="danger" @click="Del(scope.row.id)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pager.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pager.size" layout="total, sizes, prev, pager, next, jumper" :total="pager.total"></el-pagination>

        <el-dialog title="编辑文章" :visible.sync="visible.editArticle"  width="65%">
            <el-form :model="Editform" :rules="rules" ref="Editform" label-width="100px" class="demo-ruleForm">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="Editform.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item label="标签" prop="word">
                    <el-input v-model="Editform.word" placeholder="标签"></el-input>
                </el-form-item>
                <el-form-item label="导语" prop="intro">
                    <el-input v-model="Editform.intro" placeholder="导语" type="textarea" autosize @keydown.native="listen($event)"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <!-- <el-input v-model="Editform.section" placeholder="段落内容" type="textarea" :autosize="{ minRows: 10, maxRows: 20}"></el-input> -->
                    <editor ref="myQuillEditor" v-model="Editform.content" @input="(content) => {Editform.content = content }"></editor>
                </el-form-item>
                <el-form-item label="状态" prop="staus">
                    <el-switch v-model="Editform.status" active-value="1" inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible.editArticle = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('Editform')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加文章" :visible.sync="visible.addArticle"  width="65%">
            <el-form :model="Addform" :rules="rules" ref="Addform" label-width="100px" class="demo-ruleForm">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="Addform.title" placeholder="标题"></el-input>
                </el-form-item>
                 <el-form-item label="标签" prop="word">
                    <el-input v-model="Addform.word" placeholder="标签"></el-input>
                </el-form-item>
                 <el-form-item label="导语" prop="intro">
                    <el-input v-model="Addform.intro" placeholder="导语" type="textarea" autosize @keydown.native="listen($event)"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <!-- <el-input v-model="Addform.section" placeholder="段落内容" type="textarea" :autosize="{ minRows: 10, maxRows: 20}"></el-input> -->
                    <editor ref="Editor" v-model="Addform.content" @input="(content) => {Addform.content = content}"></editor>
                </el-form-item>
                <!-- <el-form-item label="状态" prop="staus">
                    <el-switch v-model="Addform.status" active-value="1" inactive-value="0"></el-switch>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible.addArticle = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('Addform')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import API from "../../api/api.js";
import util from "../../api/util.js"
import editor from '../common/Tinymce/index.vue';
export default {
    name: "autoParagraph",
    components: { editor },
    data() {
        return {
            dataList:[],
            pager:{
                total:10,
				currentPage:1,
				size:10
            },
            visible:{addArticle:false, editArticle:false},
            Editform:{title:'', status:'1',content:'',word:'',intro:''},
            Addform:{title:'', status:'1',content:'',word:'',intro:''},
            articleForm:{name:'title',tid:'',value:'',status:''},
            rules:{
                title:[{ required: true, message: '请输入文章标题', trigger: 'change' } ], 
                content:[{ required: true, message: '请输入文章内容', trigger: 'change' }],
            },
            CurrentWords: 0 ,
        }
    },
    methods: {
        searchForm(){
            var params={};
            this.articleForm.tid?params.tid=this.articleForm.tid:"";
            this.articleForm.status?params.status=this.articleForm.status:"";
            if(this.articleForm.value){
                this.articleForm.name == 'title' ? params.title = this.articleForm.value : params.id = this.articleForm.value ;
            }
            params.page=this.pager.currentPage;
            params.rows=this.pager.size;
            API.articleList(params).then(rs=>{
                console.log(rs,'666');
                if( rs.rows){
                    this.dataList = rs.rows;
                    rs.rows.map(ele => { ele.status = String(ele.status)});
                }else{
                    this.dataList=rs;
                }
                this.pager.total = rs.total;
            }).catch(err=>console.log(err));
        },
        resetSearch(){
            this.articleForm={name:'title',tid:'',value:'',status:''};
            this.pager.currentPage=1;
            this.pager.size=10;
            this.searchForm();
        },

        formatCreated(row, column, cellValue, index){
            return util.format(row.created , 'MM-dd hh:mm')
        },
        changeStatus(rows){
            API.articleEdit({id:rows.id , status:rows.status}).then(rs => {
                rs.code == 1 ? this.$message.success('修改成功') : this.$message.error(rs.msg) ;
            }).catch(err => console.log(err))
        },
        descInput(){
            this.CurrentWords = this.Addform.content.length ;

        },
        addArticle(){
            this.visible.addArticle = true;
            this.Addform={title:'', status:'1',content:'',word:'',intro:''};
            this.$nextTick(() => {
                this.$refs.Addform.clearValidate();
            });     
        },
        articleMake(){
            API.articleMake({}).then(rs => {
                if(rs == 0){
                    this.$message.info('当前没有文章生成！');
                }else{
                    this.$message.success('已成功生成'+rs+'篇文章');
                }
                
            }).catch(err => console.log(err))
        },
        async Edit(rows){
            this.Editform.title = ''
            this.Editform.status = ''
            this.visible.editArticle = true;
            const rs1 = await API.articleList({id:rows}).catch(err => console.log(err))
            this.$refs.myQuillEditor.hasChange = false;
            this.Editform =  Object.assign(rs1[0]);
            this.Editform.status = String(this.Editform.status)
            
        },
        Del(rows){
            this.$confirm('是否删除此条文章?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                API.articleDel({id:rows}).then(rs => { rs.code == 1 ? this.init({}) : this.$message.error(rs.msg) })		        	
            }).catch(error => {console.log(error)});
        },
        async init(param){
            console.log('init')
            param.page = this.pager.currentPage;
            param.rows = this.pager.size;
            const rs1 = await API.articleList(param).catch(err => console.log(err))
            rs1.rows.map(ele => { ele.status = String(ele.status)})
            this.dataList = rs1.rows;
            this.pager.total = rs1.total;
            // if(this.$refs.setting.Editform.cid == ''){
            //     this.$refs.setting.init({})
            // }
        },
        listen (event) {
            if (event.keyCode === 13) {
                event.preventDefault() // 阻止浏览器默认换行操作
                return false
            }
        },
        handleSizeChange(val){
            this.pager.size = val; this.init({});
        },
        handleCurrentChange(val){
            this.pager.currentPage = val; this.init({});
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(formName == 'Editform'){
                        API.articleEdit(this.Editform).then(rs => {
                            if(rs.code == 1){
                                this.$message.success('修改成功');
                                // this.$refs[formName].resetFields();
                                this.visible.editArticle = false;
                                this.init({});  
                            }else{
                                this.$message.error(rs.msg)
                            }
                        }).catch(error => {console.log(error)})
                    }
                    if(formName == 'Addform'){
                        // console.log(formName)
                        API.articleAdd(this.Addform).then(rs => {
                            if(rs.code == 1){
                                this.$message.success('新增成功');
                                this.$refs[formName].resetFields();
                                this.$refs.Editor.clearTinymce();
                                // this.visible.addArticle = false;
                                this.init({});  
                            }else{
                                this.$message.error(rs.msg)
                            }
                        }).catch(error => {console.log(error)})
                    }
                    this.$refs[formName].resetFields();
                } else {
                    return false;
                }
            });
        },
        

    },
    mounted(){
        // this.init({});
    }
};
</script>
<style scoped>
    .el-radio.is-bordered {margin:0 10px 10px 0 !important;}
    .el-pagination.is-background {margin:10px 0 0 0 ;}
    .input-with-select {margin-bottom:10px;}
    .input-with-select {width:200px;}
    .el-radio-group {width:100%;}
    .wordName {margin-bottom:15px;}
    .words {  display: block;width: 100%;height: 28px;line-height: 28px;text-align: right;box-sizing: border-box;padding: 0 15px;position: absolute;bottom: 0;font-size: 12px;}
    .el-input-group {width:300px;}
    .el-input-group .el-select {width:100px;}
    /* .handle-box {position:absolute; top:4px; right:5px;} */
    .handle-box .item{float: right;}
    .handle-box{overflow: hidden;margin-bottom: 20px;}
	.handle_select{ width: 120px;}
</style>
<style>
 #keywords .el-dialog__body{padding-bottom: 10px;}
 @media screen and (min-width: 1700px) {
        #keywords .el-dialog{width: 50%!important}
    }
</style>