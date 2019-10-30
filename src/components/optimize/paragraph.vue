<template>
    <div id="keywords">
        <div class="handle-box">
        	<el-button type="success" @click="addSection" class="handle_add">添加段落</el-button>
            <el-select v-model="search.status" slot="prepend" placeholder="状态">
                <el-option label="正常" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
            </el-select>
            <el-button @click="Search" type="primary" style="margin-left:20px;">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
        </div>
        <el-table stripe :data="dataList" border style="width: 100%">
            <el-table-column  prop="id" label="ID" width="80px"></el-table-column>
            <el-table-column  prop="section" label="段落" :formatter="formatSection"></el-table-column>
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

        <el-dialog title="编辑段落" :visible.sync="visible.editSection"  width="1000px">
            <el-form :model="Editform" :rules="rules" ref="Editform" label-width="80px" class="demo-ruleForm" >
                <el-form-item label="所属词库" prop="wid">
                    <div class="wid">
                        <el-tag v-if="tagName">{{tagName}}</el-tag>
                        <div class="right">
                            <el-input placeholder="搜索词库" clearable size="mini" v-model="searchValue" class="input-with-select" @keydown.enter.native="handleSearch"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
                            <el-button size="mini" @click="handleSearch" type="primary" style="margin-left:6px;">查询</el-button>
                            <el-button size="mini" @click="resetOptions" style="margin-left:0;">重置</el-button>
                        </div>
                    </div>
                    <el-collapse v-model="activeNames" @change="handleChange"  class="titleInputBox" style="margin-top:20px;">
                        <el-collapse-item :title="item" :name="index"  v-for="(item, index) in fieldsData" :key="index">
                            <div v-if="itemsData[index].length==0" style="color:#999;margin-left:10px;">暂无数据</div>
                            <el-radio-group v-model="Editform.wid" size="mini">
                                <el-radio v-for="(inputItem, inputIndex) in itemsData[index]" :key="inputIndex" :label="inputItem[0]"  border>{{inputItem[1]}}</el-radio>
                            </el-radio-group>
                        </el-collapse-item>
                    </el-collapse>
                </el-form-item>
                <el-form-item label="段落内容" prop="section">
                    <!-- <el-input v-model="Editform.section" placeholder="段落内容" type="textarea" :autosize="{ minRows: 10, maxRows: 20}"></el-input> -->
                    <editor ref="myQuillEditor" :height="200" v-model="Editform.section" @input="(section) => {Editform.section = section }"></editor>
                </el-form-item>
                <el-form-item label="状态" prop="staus">
                    <el-switch v-model="Editform.status" active-value="1" inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible.editSection = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('Editform')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加段落" :visible.sync="visible.addSection"  width="1000px">
            <el-form :model="Addform" :rules="rules" ref="Addform" label-width="80px" class="demo-ruleForm">
                <el-form-item label="所属词库" prop="wid">
                    <el-input placeholder="搜索词库" clearable size="mini" v-model="searchValue" class="input-with-select" @keydown.enter.native="handleSearch"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
                    <el-button size="mini" @click="handleSearch" type="primary" style="margin-left:6px;">查询</el-button>
                    <el-button size="mini" @click="resetOptions" style="margin-left:0;">重置</el-button>
                    <el-collapse v-model="activeNames" @change="handleChange" style="margin-top:20px;" class="titleInputBox">
                        <el-collapse-item :title="item" :name="index"  v-for="(item, index) in fieldsData" :key="index">
                            <div v-if="itemsData[index].length==0" style="color:#999;margin-left:10px;">暂无数据</div>
                            <el-radio-group v-model="Addform.wid" size="mini">
                                <el-radio v-for="(inputItem, inputIndex) in itemsData[index]" :key="inputIndex" :label="inputItem[0]"  border>{{inputItem[1]}}</el-radio>
                            </el-radio-group>
                        </el-collapse-item>
                    </el-collapse>
                </el-form-item>
                <el-form-item label="段落内容" prop="section">
                    <!-- <el-input v-model="Addform.section" placeholder="段落内容" type="textarea" :autosize="{ minRows: 10, maxRows: 20}"></el-input> -->
                    <editor ref="Editor" :height="200" v-model="Addform.section" @input="(section) => {Addform.section = section}"></editor>
                </el-form-item>
                <el-form-item label="状态" prop="staus">
                    <el-switch v-model="Addform.status" active-value="1" inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible.addSection = false">取 消</el-button>
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
    components: { editor },
    name: "Paragraph",
    data() {
        return {
            dataList:[],
            pager:{
                total:10,
				currentPage:1,
				size:10
            },
            searchValue:'',
            visible:{addSection:false, editSection:false, loading:false, },
            Editform:{section:'', status:'1',wid:''},
            Addform:{section:'', status:'1',wid:''},
            rules:{
                section:[{ required: true, message: '请输入词库', trigger: 'change' }],
                wid:[{ required: true, message: '请选择词库', trigger: 'change' }]
            },
            search:{ status:''},
            tagName:'',
            activeNames:[0,1,2],
            fieldsData:[],
            itemsData:[],
        }
    },
    methods: {
        Search(){
            const param = {};
            if(this.search.status){
                param.status = this.search.status;
            }
            if(JSON.stringify(param) != "{}"){
                this.pager.currentPage = 1;
                param.page = 1;
                param.rows = this.pager.size
                API.sectionList(param).then(rs => {
                    rs.rows.map(ele => { ele.status = String(ele.status)})
                    this.dataList = rs.rows;
                    this.pager.total = rs.total;
                    // console.log(this.dataList , this.pager)
                }).catch(err => console.log(err))
            }
        },
        resetSearch(){
            this.search.status='';
            this.init({})
        },
        formatSection(row, column, cellValue, index){
            return util.filterHTMLTag(row.section)
        },
        formatCreated(row, column, cellValue, index){
            return util.format(row.created , 'MM-dd hh:mm')
        },
        handleSearch(){
            const param = {tid:0,status:1};
            if(this.searchValue){
                param.word = this.searchValue ;
                API.wordList(param).then(rs => {
                    // console.log(rs);
                    this.itemsData = rs.items;
                }).catch(err => console.log(err))
            }
        },
        changeStatus(rows){
            API.sectionEdit({id:rows.id , status:rows.status}).then(rs => {
                rs.code == 1 ? this.$message.success('修改成功') : this.$message.error(rs.msg) ;
            }).catch(err => console.log(err))
        },
        addSection(){
            this.resetOptions();
            this.visible.addSection = true;
            this.Addform = {section:'', status:'1', wid:''} 
        },
        async Edit(rows){
            this.resetOptions();
            this.Editform.wid = '';
            this.Editform.status = '';
            this.visible.editSection = true;
            const rs1 = await API.sectionList({id:rows}).catch(err => console.log(err))
            this.Editform =  Object.assign(rs1[0]);;
            this.$refs.myQuillEditor.hasChange = false;
            this.Editform.status = String(this.Editform.status)
            const rs2 = await API.wordList({id:this.Editform.wid}).catch(err => console.log(err));
            this.tagName="";
            rs2.items.map(item=>{
                if(item.length>0){
                    this.tagName= item[0][1];
                    return;
                }
            })
        },
        Del(rows){
            // console.log(rows)
            this.$confirm('是否删除此条段落?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                API.sectionDel({id:rows}).then(rs => {
                     rs.code == 1 ? this.init({}) : this.$message.error(rs.msg)
                })		        	
            }).catch(error => {console.log(error)});
        },
        async init(param){
            param.page = this.pager.currentPage;
            param.rows = this.pager.size;
            const rs1 = await API.sectionList(param).catch(err => console.log(err))
            rs1.rows.map(ele => { ele.status = String(ele.status)})
            this.dataList = rs1.rows;
            this.pager.total = rs1.total;
            const rs2 = await API.wordList({tid:0, status:1 }).catch(err => console.log(err))
            this.fieldsData = rs2.fields;
            this.itemsData = rs2.items;
           
        },
        handleSizeChange(val){
            this.pager.size = val; this.init({});
        },
        handleCurrentChange(val){
            this.pager.currentPage = val; this.init({});
        },
        handleChange(val) {
                // console.log(val);
        },
        resetOptions(){
            this.searchValue="";
            this.Addform.wid="";
            this.init({});
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.searchValue="";
                    if(formName == 'Editform'){
                        API.sectionEdit(this.Editform).then(rs => {
                            if(rs.code == 1){
                                this.$message.success('修改成功');
                                 this.$refs[formName].resetFields();
                                //  this.$refs.myQuillEditor.clearTinymce();
                                this.visible.editSection = false;
                                this.init({});  
                            }else{
                                this.$message.error(rs.msg)
                            }
                        }).catch(error => {console.log(error)})
                    }
                    if(formName == 'Addform'){
                        // console.log(formName)
                        API.sectionAdd(this.Addform).then(rs => {
                            if(rs.code == 1){
                                this.$message.success('新增成功');
                                this.$refs.Editor.clearTinymce();
                                this.init({});  
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
    },
};
</script>
<style scoped>
    .el-radio.is-bordered {margin:0 10px 10px 0 !important;}
    .el-pagination.is-background {margin:10px 0 0 0 ;}
    .input-with-select {width:200px;}
    .el-radio-group {width:100%;}
    .wordName {margin-bottom:15px;}
    .currentWords {font-size:14px; height:28px; line-height:28px; display:inline-block; width:100%; text-align: right; box-sizing: border-box; padding:0 10px; 
                    position: absolute; bottom:-28px; left:0;}
    .el-input-group {width:300px;}
    .el-input-group .el-select {width:100px;}
    .right {float:right;}
    .wid {overflow: hidden;}
    .wid .el-tag {float:left;}
    .smallPages {line-height: 30px; margin:0; padding:0;}
</style>
<style>
.titleInputBox  .el-collapse-item__content{
  padding-top: 6px;
  padding-bottom: 6px;
}
</style>
