<template>
    <div class="setting">
        <h3>文章自动定时发布设置</h3>
        <el-form :model="Editform" :rules="rules" ref="Editform" label-width="100px" class="demo-ruleForm" width="500px">
            <el-form-item label="新闻分类" prop="selectCid" required>
                <el-cascader v-if="Editform.selectCid" v-model="Editform.selectCid" placeholder="请选择"  :show-all-levels="false" :options="options" :props="props"   change-on-select  @change="handClick"></el-cascader>
                <el-cascader v-else></el-cascader>
            </el-form-item>
            <el-form-item label="运行周期" required> 
                <el-col :span="11">
                    <el-form-item prop="interval_no">
                        <el-select v-model="Editform.interval_no">
                            <el-option v-for="item in 12" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="2"> - </el-col>
                <el-col :span="11">
                    <el-form-item prop="interval_unit">
                        <el-select v-model="Editform.interval_unit" placeholder="单位">
                            <el-option label="时" value="HOUR"></el-option>
                            <el-option label="天" value="DAY"></el-option>
                            <el-option label="周" value="WEEK"></el-option>
                            <el-option label="月" value="MONTH"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="时间范围">
                <el-date-picker
                v-model="Editform.date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd hh:mm:ss"
                 @change="changeDate">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="staus">
                <el-switch v-model="Editform.status" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('Editform')">保存</el-button>
                <el-button type="danger" @click="Del">删除</el-button>
                <el-button @click="resert">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import API from "../../api/api.js";
    import util from "../../api/util.js";
    function filterCids(arrays , a){
        for(var i = 0; i<arrays.length; i++){
            if(arrays[i].hasOwnProperty('children')){
                a.push({id:arrays[i].id , name:arrays[i].name})
                filterCids(arrays[i].children , a)
            }else{
                a.push(arrays[i]);
            }
        }
    }
    export default {
        name:'Setting',
        data() {
            return {
                Editform:{
                    cid:'',
                    interval_no:'',
                    interval_unit:'',
                    start_time:'',
                    end_time:'',
                    status:'1',
                    date:[],
                    selectCid:[]
                },
                rules:{
                    selectCid: [{required: true, message: '请选择新闻分类', trigger: 'change'}],
                    interval_no: [{required: true, message: '请选择运行期限', trigger: 'change'}],
                    interval_unit: [{required: true, message: '请选择周期单位', trigger: 'change'}],
                },
                options:[],
				props: {
					value: 'id',
					label:'name',
					children: 'children'
                },
            }
        },
        methods: {
           async init(){
               const rs1 = await API.GetEvent({}).catch(err => console.log(err))
                if(rs1 != null){
                    this.Editform.status = String(rs1.status)
                    this.Editform.interval_unit = rs1.interval_unit;
                    this.Editform.interval_no = rs1.interval_no;
                    this.Editform.cid = rs1.cid;
                    this.Editform.selectCid[0] = this.Editform.cid;
                    if(rs1.start_time != 0 && rs1.end_time != 0){
                        this.Editform.start_time = util.format(rs1.start_time , 'yyyy-MM-dd hh:mm:ss')
                        this.Editform.end_time = util.format(rs1.end_time , 'yyyy-MM-dd hh:mm:ss')
                        this.Editform.date = [this.Editform.start_time , this.Editform.end_time]
                    }
                    
                }else{
                    this.Editform = {
                        cid:'',
                        interval_no:'',
                        interval_unit:'',
                        start_time:'',
                        end_time:'',
                        status:'1',
                        date:[],
                    }
                    this.Editform.selectCid = [];
                }
                if(this.options.length == 0){
                    const rs2 = await API.NewscatsGet({}).catch(err => console.log(err))
                    rs2.splice(0,1);
                    filterCids(rs2 , this.options);
                }
            },
           changeDate(value){
                if(value == null){
                    this.Editform.start_time ='';
                    this.Editform.end_time = '';
                }else{
                    this.Editform.start_time = value[0];
                    this.Editform.end_time = value[1];
                }
           },
           submitForm(formName) {
               this.$refs[formName].validate((valid) => {
                   if(valid){
                       API.EditEvent(this.Editform).then(rs => {
                           if(rs.code == 1){
                               this.$message.success('设置成功');
                            //    this.$emit("init",{});
                           }else{
                               this.$message.error(rs.msg);
                           }
                       }).catch(err => console.log(err))
                   }
               })
           },
           Del(){
               API.DelEvent({}).then(rs => {
                   if(rs.code == 1){
                       this.$message.success('已取消新闻自动发布！');
                       this.$refs['Editform'].resetFields();
                       this.init();
                   }else if(rs.msg == 'ILLEGAL_EVENT_NOT_EXIST'){
                       this.$message.info('当前没有设置新闻自动发布！');

                   }else{
                       this.$message.error(rs.msg);
                   }
               }).catch(err => console.log(err))
           },
           resert(){
               this.init();
           },
           handClick(value){
               this.Editform.cid = value[value.length - 1];
           },
        },
        mounted(){
            // this.init();
        }
    }
</script>

<style scoped>
    .el-form {width:500px;}
    .el-select {width:100%;}
    .el-cascader {width:100%;}
    .el-date-picker {width:100%;}
    .el-col-2 {text-align: center;}
    h3 {margin:0; padding:0px 20px; background:#eef1f6; margin-bottom:20px; height:48px; line-height: 48px; font-size:18px;}
</style>