<template>
    <div id="keywords">
        <div class="handle-box">
        	<el-button type="success" @click="addWord" class="handle_add">添加词库</el-button>
            <el-input placeholder="词库" clearable v-model="search.value" class="input-with-select" @keydown.enter.native="Search">
				<el-select v-model="search.name" slot="prepend" placeholder="词库">
					<el-option label="词库ID" value="id"></el-option>
					<el-option label="词库名" value="word"></el-option>
				</el-select>
			</el-input>
            <el-select v-model="search.status" slot="prepend" placeholder="状态">
                <el-option label="正常" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
            </el-select>
            <el-button @click="Search" type="primary">查询</el-button>
        </div>
        <el-table stripe :data="dataList" style="width: 100%">
            <el-table-column  prop="id" label="ID" width="220px"></el-table-column>
            <el-table-column  prop="word" label="词库"></el-table-column>
            <el-table-column  prop="created" label="创建时间" :formatter="formatCreated"></el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope"><el-switch v-model="dataList[scope.$index].status"  @change="changeStatus(scope.row)"  active-value="1" inactive-value="0"></el-switch></template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit"  type="text" @click="Edit(scope.row.id)"></el-button>
                    <el-button icon="el-icon-delete"  type="text" @click="Del(scope.row.id)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pager.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pager.size" layout="total, sizes, prev, pager, next, jumper" :total="pager.total"></el-pagination>

        <el-dialog title="编辑词库" :visible.sync="visible.editword"  width="50%">
            <el-form :model="Editform" :rules="rules" ref="Editform" label-width="100px" class="demo-ruleForm">
                <el-form-item label="词库名" prop="word">
                    <el-input v-model="Editform.word" placeholder="字数限制 20 字以内" :maxlength="20" @input="descInput('editForm')"></el-input>
                    <div class="remnant"><span class="contentcount">{{remnant1}}</span>/20</div>
                </el-form-item>
                <el-form-item label="状态" prop="staus">
                    <el-switch v-model="Editform.status" active-value="1" inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible.editword = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('Editform')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加词库" :visible.sync="visible.addword"  width="50%">
            <el-form :model="Addform" :rules="rules" ref="Addform" label-width="100px" class="demo-ruleForm">
                <el-form-item label="词库名" prop="word">
                    <el-input v-model="Addform.word" placeholder="字数限制 20 字以内" :maxlength="20" @input="descInput('addForm')"></el-input>
                    <div class="remnant"><span class="contentcount">{{remnant2}}</span>/20</div>
                </el-form-item>
                <el-form-item label="状态" prop="staus">
                    <el-switch v-model="Addform.status" active-value="1" inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible.addword = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('Addform')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import API from "../../api/api.js";
import util from "../../api/util.js"
export default {
    name: "Keywords",
    data() {
        return {
            dataList:[],
            pager:{
                total:10,
				currentPage:1,
				size:10
            },
            searchValue:'',
            pager1:{total:10 , size:20},
            wordList:[],
            visible:{addword:false, editword:false, loading:false, },
            Editform:{word:'', status:'1'},
            Addform:{word:'', status:'1'},
            rules:{word:[{ required: true, message: '请输入词库', trigger: 'change' }]},
            remnant1:0,
            remnant2:0,
            search: { name:'word' , status:'' , value:'' }
        }
    },
    methods: {
        Search(){
            const param = {};
            if(this.search.value){
                this.search.name == 'word' ? param.word = this.search.value : param.id = this.search.value ;
            }
            if(this.search.status){
                param.status = this.search.status;
            }
            if(JSON.stringify(param) != "{}"){
                this.pager.currentPage = 1;
                param.page = 1
                param.rows = this.pager.size
                API.wordList(param).then(rs => {
                    rs.rows.map(ele => { ele.status = String(ele.status)})
                    this.dataList = rs.rows;
                    this.pager.total = rs.total;
                }).catch(err => console.log(err))
            }
        },
        formatCreated(row, column, cellValue, index){
            return util.format(row.created , 'MM-dd hh:mm')
        },
        changeStatus(rows){
            API.wordEdit({id:rows.id , status:rows.status}).then(rs => {
                rs.code == 1 ? this.$message.success('修改成功') : this.$message.error(rs.msg) ;
            }).catch(err => console.log(err))
        },
        descInput(name){
            if(name == 'addForm'){
                this.remnant2 = this.Addform.word.length;
            }else{
                this.remnant1 = this.Editform.word.length;
            }
        },
        addWord(){
            this.visible.addword = true;
            this.remnant = '';
        },
        Edit(rows){
            this.Editform = {word:'', status:''}
            this.visible.editword = true;
            API.wordList({id:rows}).then(rs => {
                this.Editform = rs[0];
                this.Editform.status = String(this.Editform.status);
                this.remnant = this.Editform.word;
                this.remnant1 = this.Editform.word.length;
            }).catch(err => console.log(err))
        },
        Del(rows){
            this.$confirm('是否删除此条关键词?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                API.wordDel({id:rows}).then(rs => {
                    if(rs.code == 1){
                        this.init({})
                    }else if (rs.msg == 'ILLEGAL_WORD_IN_USE'){
                        this.$message.warning('此条词库在标题、段落中有应用到，不能删除！') 
                    }else{
                        this.$message.error(rs.msg) 
                    }
                })		        	
            }).catch(error => {console.log(error)});
        },
        init(param){
            param.page = this.pager.currentPage;
            param.rows = this.pager.size;
            API.wordList(param).then(rs => {
                rs.rows.map(ele => { ele.status = String(ele.status)})
                this.dataList = rs.rows;
                this.pager.total = rs.total;
            }).catch(err => console.log(err))
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
                        API.wordEdit(this.Editform).then(rs => {
                            if(rs.code == 1){
                                this.$message.success('修改成功');
                                 this.$refs[formName].resetFields();
                                this.visible.editword = false;
                                this.init({});  
                            }else if (rs.msg == 'ILLEGAL_WORD_EXISTS'){
                                this.$message.error('已有相同的词库标题了，请重新填写词库名！');
                            }else{
                                this.$message.error(rs.msg)
                            }
                        }).catch(error => {console.log(error)})
                    }
                    if(formName == 'Addform'){
                        API.wordAdd(this.Addform).then(rs => {
                            if(rs.code == 1){
                                this.$message.success('新增成功');
                                 this.$refs[formName].resetFields();
                                this.visible.addword = false;
                                this.init({});  
                            }else if (rs.msg == 'ILLEGAL_WORD_EXISTS'){
                                this.$message.error('已有相同的词库标题了，请重新填写词库名！');
                            }else{
                                this.$message.error(rs.msg)
                            }
                        }).catch(error => {console.log(error)})
                    }
                   
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
    .remnant {position: absolute; bottom:0; right:10px; font-size: 12px; color: #606266;}
    .el-input-group {width:300px;}
    .el-input-group .el-select {width:100px;}
</style>

