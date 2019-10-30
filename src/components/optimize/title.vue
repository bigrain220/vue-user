<template>
    <div id="keywords">
        <div class="handle-box">
        	<el-button type="success" @click="addTitle">添加标题</el-button>
            <el-input placeholder="搜索关键字" clearable v-model="search.value" class="input-with-select" @keydown.enter.native="Search">
				<el-select v-model="search.name" slot="prepend" placeholder="标题">
					<el-option label="标题ID" value="id"></el-option>
					<el-option label="标题名" value="title"></el-option>
				</el-select>
			</el-input>
            <el-select v-model="search.status" slot="prepend" placeholder="状态">
                <el-option label="正常" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
            </el-select>
            <el-button @click="Search" type="primary" style="margin-left:20px;">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
        </div>
        <el-table stripe :data="dataList" border style="width: 100%">
            <el-table-column  prop="id" label="ID" width="120px"></el-table-column>
            <el-table-column  prop="title" label="标题"></el-table-column>
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

        <el-dialog title="编辑标题" :visible.sync="visible.editword"  width="1000px">
            <el-form :model="Editform" :rules="rules" ref="Editform" label-width="80px" class="demo-ruleForm">
                <el-form-item label="所属词库" prop="wid">
                    <el-tag v-if="tagName">{{tagName}}</el-tag>
                    <div class="right">
                            <el-input placeholder="搜索词库" clearable size="mini" v-model="searchValue" class="input-with-select" @keydown.enter.native="handleSearch"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
                            <el-button size="mini" @click="handleSearch" type="primary" style="margin-left:6px;">查询</el-button>
                            <el-button size="mini" @click="resetOptions" style="margin-left:0;">重置</el-button>
                    </div>
                    <div style="clear:both"></div>
                    <el-collapse v-model="activeNames" @change="handleChange"  class="titleInputBox" style="margin-top:20px;">
                        <el-collapse-item :title="item" :name="index"  v-for="(item, index) in fieldsData" :key="index">
                            <div v-if="itemsData[index].length==0" style="color:#999;margin-left:10px;">暂无数据</div>
                            <el-radio-group v-model="Editform.wid" size="mini">
                                <el-radio v-for="(inputItem, inputIndex) in itemsData[index]" :key="inputIndex" :label="inputItem[0]"  border>{{inputItem[1]}}</el-radio>
                            </el-radio-group>
                        </el-collapse-item>
                    </el-collapse>
                </el-form-item>
                <el-form-item label="标题名" prop="title">
                    <el-input v-model="Editform.title" placeholder="词库标题"></el-input>
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
        <el-dialog title="添加标题" :visible.sync="visible.addword"  width="1000px">
            <el-form :model="Addform" :rules="rules" ref="Addform" label-width="80px" class="demo-ruleForm">
                <el-form-item label="所属词库" prop="wid" >
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
                <el-form-item label="标题名" prop="title">
                    <el-input v-model="Addform.title" placeholder="标题"></el-input>
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
import API from "../../api/api.js"
import util from "../../api/util.js"

export default {
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
            visible:{addword:false, editword:false },
            Editform:{title:'', status:'1',wid:""},
            Addform:{title:'', status:'1',wid:""},
            rules:{ 
                title:[{ required: true, message: '请输入标题', trigger: 'change' }],
                wid:[{ required: true, message: '请选择词库', trigger: 'change' }]
            },
            search:{name:'title' , status:'' , value:''},
            activeNames:[0,1,2],
            fieldsData:[],
            itemsData:[],
            tagName:""         
        }
    },
    methods: {
        Search(){
            const param = {};
            if(this.search.value){
                this.search.name == 'title' ? param.title = this.search.value : param.wid = this.search.value ;
            }
            if(this.search.status){
                param.status = this.search.status;
            }
            if(JSON.stringify(param) != "{}"){
                this.pager.currentPage = 1;
                param.page = 1
                param.rows = this.pager.size
                API.titleList(param).then(rs => {
                    rs.rows.map(ele => { ele.status = String(ele.status)})
                    this.dataList = rs.rows;
                    this.pager.total = rs.total;
                }).catch(err => console.log(err))
            }
        },
        resetSearch(){
            this.search.value='';
            this.search.name='title';
            this.search.status='';
            this.init({})
        },
        formatCreated(row, column, cellValue, index){
            return util.format(row.created , 'MM-dd hh:mm')
        },
        changeStatus(rows){
            API.titleEdit({id:rows.id , status:rows.status}).then(rs => {
                rs.code == 1 ? this.$message.success('修改成功') : this.$message.error(rs.msg) ;
            }).catch(err => console.log(err))
        },
        async Edit(rows){
            this.resetOptions();
            this.Editform = {title:'', status:''}
            this.visible.editword = true;
            const rs1 = await API.titleList({id:rows}).catch(err => console.log(err))
            // console.log(rs1,'editrs1')
            this.Editform =  Object.assign(rs1[0]);;
            this.Editform.status = String(this.Editform.status)
            const rs2 = await API.wordList({id:this.Editform.wid}).catch(err => console.log(err))
            // console.log(rs2,"rs2")
            this.tagName="";
            rs2.items.map(item=>{
                if(item.length>0){
                    this.tagName= item[0][1];
                    return;
                }
            })
    
        },
        addTitle(){
            this.resetOptions();
            this.visible.addword = true;
            this.Addform = {title:'', status:'1',wid:""}
        },
        Del(rows){
            this.$confirm('是否删除此条标题?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                API.titleDel({id:rows}).then(rs => { 
                    rs.code == 1 ? this.init({}) : this.$message.error(rs.msg) 
                })		        	
            }).catch(error => {console.log(error)});
        },
        async init(param){
            param.page = this.pager.currentPage;
            param.rows = this.pager.size;
            const rs1 = await API.titleList(param).catch(err => console.log(err))
            rs1.rows.map(ele => { ele.status = String(ele.status)})
            this.dataList = rs1.rows;
            this.pager.total = rs1.total;
            const rs2 = await API.wordList({tid:"0", status:1 }).catch(err => console.log(err))
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
        handleSearch(){
            const param = {tid:0,status:1};
            if(this.searchValue){
                param.word = this.searchValue ;
                API.wordList(param).then(rs => {
                     this.itemsData = rs.items;
                }).catch(err => console.log(err))
            }
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                     this.searchValue="";
                    if(formName == 'Editform'){
                            API.titleEdit(this.Editform).then(rs => {
                                if(rs.code == 1){
                                    this.$message.success('修改成功');
                                    this.$refs[formName].resetFields();
                                    this.Editform = {title:'', status:'1', wid:''}
                                    this.visible.editword = false;
                                    this.init({});  
                                }else{
                                    this.$message.error(rs.msg)
                                }
                            }).catch(error => {console.log(error)})
                    }
                    if(formName == 'Addform'){
                            API.titleAdd(this.Addform).then(rs => {
                                if(rs.code == 1){
                                    this.$message.success('新增成功');
                                    this.Addform.title = '';
                                    this.Addform.wid="";
                                    // this.visible.addword = false;
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
    // computed:mapState(['widList']),
};
</script>

<style scoped>
    .el-radio.is-bordered {margin:0 10px 10px 0 !important;}
    .el-pagination.is-background {margin:10px 0 0 0 ;}
    .input-with-select {width:200px;}
    .el-radio-group {width:100%;}
    .wordName {margin-bottom:15px;}
    .el-input-group {width:300px;}
    .el-input-group .el-select {width:100px;}
    .right {float:right;}
    .wid {overflow: hidden;}
    .wid .el-tag {float:left;}
</style>
<style>
    .titleInputBox .el-collapse-item__header{background: #eef1f6;}
    .titleInputBox .el-collapse-item__header:hover{background: rgb(170, 195, 224);}
    .titleInputBox  .el-collapse-item__content{
        padding-top: 6px;
        padding-bottom: 6px;
    }
</style>