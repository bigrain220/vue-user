<template>
  <div id="keywords">
    <div class="handle-box">
      <el-button type="success" @click="importWord" class="handle_add">万词导入</el-button>
      <div class="right" v-if="expiredDate">
        <span>到期时间 : </span><span style="font-size:14px;margin:0 20px 0 0;color:#409EFF;">{{expiredDate}}</span>
       <el-button type="primary" @click="buyClick" class="handle_add">续费</el-button>
      </div>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item :title="item" :name="index"  v-for="(item, index) in fieldsData" :key="index" class="inputBox">
            <div v-if="itemsData[index].length==0" style="color:#999;margin-left:10px;">暂无数据</div>
            <el-autocomplete  :maxlength="20" :popper-class="`cname${index}${inputIndex} cname`" v-model="itemsData[index][inputIndex]" 
              :fetch-suggestions="querySearch" size="small"  placeholder="字数限制 2-20"
              :debounce=0  @select="handleSelect" v-for="(inputItem, inputIndex) in itemsData[index]" :key="inputIndex" @focus="oop('cname'+index+inputIndex)">
            </el-autocomplete> 
            <el-button type="primary" size="small" @click="addInput(index)" class="add-btn">添加词库</el-button>
            <keywordsTxt @getTxt="getTxt" :indexData="index"></keywordsTxt>
        </el-collapse-item>
    </el-collapse>
    <div class="save-btn">
        <el-button type="primary" size="medium" @click="saveInput">保存</el-button>
    </div>
    <el-dialog title="续费(1000币/年)" :visible.sync="visible.buy"  width="65%">
             <div>
                 开通续费： <el-input-number v-model="year" :min="1" :max="10" label="描述文字"></el-input-number><span style="margin-left:20px;">年</span>
                 <span style="margin-left:30px;">总计：{{year*1000}} 币</span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible.buy = false">取 消</el-button>
                <el-button type="primary" @click="buyConfirm">确 定</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
import API from "../../api/api.js";
import util from "../../api/util.js"
export default {
    name: "autoKeywords",
    components:{
      keywordsTxt:()=>import('../common/keywordsTxt.vue')
    },
    data() {
        return {
            visible:{addword:false, editword:false, loading:false,buy:false },
            Editform:{word:'',cid:'',status:'1'},
            Addform:{word:'', cid:'',status:'1'},
            rules:{
                    word:[{ required: true, message: '请输入词库', trigger: 'change' }],
                    cid:[{ required: true, message: '请选择分类'}]
                    },
            search: { name:'word' , status:'' , value:'',cid:''},
            activeNames:[0,1,2,3,4],
            fieldsData:[],
            itemsData:[],
            expiredDate:"",
            year:"1",
            cname:""
        }
    },
    methods: {
        oop(e){
            this.cname=e;
        },
        querySearch(queryString, cb) {
            var tem_list=[];
            API.wordSuggest({word: queryString}).then(rs=>{
                // console.log(rs,'opreate')
                rs.map((item,index)=>{
                    var tem_obj ={};
                    tem_obj.value=item;
                    tem_list.push(tem_obj);
                })
                var restaurants = tem_list;
                // console.log(restaurants,'666')
                var $cname= document.querySelector('.'+this.cname);
                restaurants.length>0?$cname.style.display="block":"";
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            }).catch(error => {console.log(error)})
              
        },
       createFilter(queryString) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            }
        },
        handleSelect(item) {
            // console.log(item); 
        },
        importWord(){
            API.wordImport({}).then(rs=>{
                if(rs.msg =="SUCCESS"){
                    this.$alert('导入成功', '万词导入', {
                            confirmButtonText: '确定',
                            callback: action => {
                               this.init({});
                            }
                    });
                }else{
                    this.$alert('导入失败', '万词导入', {
                            confirmButtonText: '确定',
                            callback: action => {
                                
                            }
                    });
                }
            })
        },
        handleChange(val) {
                // console.log(val);
        },
        init(param){
            API.seoGet().then(rs=>{
                   if(rs!==null){
                        this.expiredDate = util.format(rs.expired , 'yyyy-MM-dd');
                   }
            });
            param.tid=1;
            API.wordList(param).then(rs => {
              console.log(rs,'listlist')
              this.fieldsData = rs.fields;
              this.itemsData = rs.items;
              rs.items.map((item,index)=>{
                //  this.itemsData[index] = this.initeArr(item);
                  item.map((data,i)=>{
                    this.itemsData[index][i]=data[1];
                })
              });
              
            }).catch(err => console.log(err))
        },
        initeArr(params){
          var arr=[];
          if(params.length<16){
            for(var i=0;i<(16-params.length);i++){
              arr.push("");
            }
          }
          return params.concat(arr);
        },
        addInput(params){
            this.itemsData[params].push("");
        },
        saveInput(){
            var params={};
            var validLength=true;
            var validType = true;
            var pattern1 = /[\u4e00-\u9fa5]/;
            var pattern2= /[A-Za-z]/
            params.tid='1';
            this.itemsData.map((item,index)=>{
                  item.map((data,i)=>{
                      if(data.toString().trim().length==1 || data.toString().trim().length>20){
                        validLength=false;
                      }else{
                        var temArr = data.split('');
                        temArr.map((temItem,temIndex)=>{
                            if(pattern1.test(temItem) || Number(temItem) >=0 || temItem==="-" || pattern2.test(temItem) ){
                            }else{
                              console.log(temItem,'error')
                              validType=false;
                            }
                        });
                          validType ==true ? params[`word[${index}][${i+1}]`]=data : "";     
                      }
                  })
            })
            // console.log(params)
            var arr = Object.values(params);
            var arr2 = [...new Set(arr)];
            var r1 = arr.filter(function (s) {
                return s && s.trim();
            });
            var r2 = arr2.filter(function (s) {
                return s && s.trim();
            });
            //  console.log(r1,r2)
            if(r1.length!=r2.length){
              this.$message.warning('请不要保存重复词库名！');
            }else if(!validLength){
              this.$message.warning('词库名长度应在2-20位之间！');
            }else if(!validType){
              this.$message.warning('只能存入中文，数字，字母及"-"符号！');
            }else{
               API.wordSave(params).then(rs => {
                  if(rs.msg == "SUCCESS"){
                    var result="保存成功";
                    var type="success";
                  }else if(rs.msg =="FAILURE"){
                    var result="保存失败";
                    var type="error";
                  }
                  this.$alert(result, '保存词库', {
                    confirmButtonText: '确定',
                    type:type,
                    callback: action => {
                      this.init({});
                    }
                  });
              }).catch(err => console.log(err))
            }
        },
        buyClick(){
              this.visible.buy = true;
        },
        buyConfirm(){
              const _loading = this.$loading({
                  lock: true,
                  text: '正在购买,请稍等...',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
              });
              API.seoBuy({year:this.year}).then(rs=>{
                  // console.log(rs,"seobuy")
                  _loading.close();
                  if(rs.msg=="ILLEGAL_COIN_NOT_ENOUGH"){
                        this.$confirm('购买失败，您的币种余额不足', '提示', {confirmButtonText: '充值钻石',cancelButtonText: '取消',type: 'warning'
                        }).then(() => {
                          window.open('//www.g3wei.com/user/pay/index');
                        }).catch(error => {});
                  }else if(rs.code==1){
                        this.$message.success('购买成功！');
                        this.init({});
                  }else{
                      this.$alert('购买失败，请重试', '购买失败', {
                        confirmButtonText: '确定',
                        type: 'error',
                        callback: action => {
                        //    this.init({});
                        }
                      });
                  }
              }).catch(err => console.log(err))
              
        },
        getTxt(params,i){
          // console.log(params,i,'txt',this.itemsData[i]);
            this.itemsData.splice(i,1,params);
        }



    },
    mounted(){
        this.init({});
    },
};
</script>

<style scoped>
.remnant {
  position: absolute;
  bottom: 0;
  right: 10px;
  font-size: 12px;
  color: #606266;
}
.el-input-group {
  width: 300px;
}
.el-input-group .el-select {
  width: 100px;
}
.handle-box{margin-bottom: 20px;overflow:hidden;}
.handle-box .right{float: right;}
.save-btn{
  width: 100%;
  text-align: center;
  margin-top: 30px;
}
.save-btn>button{width: 250px;}
</style>
<style>
.el-autocomplete-suggestion.cname{
  display: none;
}
.inputBox  .el-collapse-item__content{
  padding-right: 180px;
  min-height: 80px;
  padding-top: 6px;
  padding-bottom: 6px;
}
.inputBox  .el-collapse-item__content>div{
    margin: 0 4px 4px 0;
}
.inputBox .el-collapse-item__header{
  background: #eef1f6;
}
.inputBox .el-collapse-item__header:hover{background: rgb(170, 195, 224);}
.inputBox .el-collapse-item__wrap{position: relative;}
.inputBox .el-collapse-item__wrap .add-btn{position: absolute;top:6px;right:0px;}
.inputBox .el-collapse-item__wrap .txt-btn{position: absolute;top:6px;right:80px;}
</style>





