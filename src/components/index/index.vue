<template>
    <div class="index">
        <el-row :gutter="20" type="flex"   class="row1">
            <el-col :span="16" class="col1">
                <el-card class="box-card box">
                    <div slot="header" class="clearfix">
                        <span>网站数据</span>
                    </div>
                    <el-row class="item item1" >
                        <el-col :span="6"><p>{{overview.news}}</p><p>新闻</p></el-col>
                        <el-col :span="6"><p>{{overview.product}}</p><p>产品</p></el-col>
                        <el-col :span="6"><p>{{overview.case}}</p><p>案例</p></el-col>
                        <el-col :span="6"><p>{{overview.video}}</p><p>视频</p></el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="8" class="col2">
                <el-card class="box-card box">
                    <div slot="header" class="clearfix">
                        <span>账户信息</span>
                    </div>
                    <ul class="item item2">
                        <li class="admin"><span>用户名称</span><b>{{userMsg.username}}</b></li>
                        <li><span>用户ID</span><b>{{userMsg.uid}}</b></li>
                        <li><span>用户角色</span><b>一站通用户</b></li>
                        <li><span>到期时间</span><b>{{userMsg.expired}}</b></li>
                        
                    </ul>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" class="row2">
            <el-col :span="16">
                <el-card class="box-card box">
                    <div slot="header" class="clearfix">
                        <span>快捷方式</span>
                    </div>
                    <ul class="item item3">
                        <router-link to="/user/Article"><img src="@/assets/img/icon1.png" alt=""><p>自动优化</p></router-link>
                        <router-link to="/user/News/1"><img src="@/assets/img/icon2.png" alt=""><p>新闻管理</p></router-link>
                        <router-link to="/user/Product/1"><img src="@/assets/img/icon3.png" alt=""><p>产品管理</p></router-link>
                        <!-- <router-link to="http://qyt.g3usr.com/m.php"><img src="@/assets/img/icon4.png" alt=""><p>在线沟通</p></router-link> -->
                        <!-- <a href="http://qyt.g3usr.com/m.php"><img src="@/assets/img/icon4.png" alt=""><p>在线沟通</p></a> -->
                        <router-link to="/user/Feedback"><img src="@/assets/img/icon5.png" alt=""><p>留言反馈</p></router-link>
                        <router-link to="/user/Link"><img src="@/assets/img/icon6.png" alt=""><p>友情链接</p></router-link>
                    </ul>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card box">
                    <div slot="header" class="clearfix">
                        <span>收录情况</span>
                        <el-button v-show="isSeoShow" style="float: right; padding: 3px 0" type="text" @click="toDomain">当前域名没有绑定请先去绑定域名</el-button>
                    </div>
                    <ul class="item item4">
                        <li><p>{{seo.bd}}</p><p>百度收录</p></li>
                        <li><p>{{seo.so}}</p><p>360收录</p></li>
                        <li><p>{{seo.sg}}</p><p>搜狗收录</p></li>
                    </ul>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" class="row3">
            <el-col :span="16" class="images">
                <div class="img"><img src="@/assets/img/img1.jpg" alt="" @click="toYun"></div>
                <div class="img"><img src="@/assets/img/img2.jpg" alt="" @click="toG3shop"></div>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card box">
                    <div slot="header" class="clearfix">
                        <span>平台动态</span>
                    </div>
                    <ul class="item5">
                        <!-- <li><a href="javascript:;">这里是标题，设置个最长不超过30个字吧，后面是...</a><span>2018-08-30</span></li>
                        <li><a href="javascript:;">这里是标题，设置个最长不超过30个字吧，后面是...</a><span>2018-08-30</span></li>
                        <li><a href="javascript:;">这里是标题，设置个最长不超过30个字吧，后面是...</a><span>2018-08-30</span></li>
                        <li><a href="javascript:;">这里是标题，设置个最长不超过30个字吧，后面是...</a><span>2018-08-30</span></li>
                        <li><a href="javascript:;">这里是标题，设置个最长不超过30个字吧，后面是...</a><span>2018-08-30</span></li>
                        <li><a href="javascript:;">这里是标题，设置个最长不超过30个字吧，后面是...</a><span>2018-08-30</span></li> -->
                        <div class="box">更多动态，敬请期待~</div>
                    </ul>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import API from '@/api/api.js'
    import {mapState} from 'vuex'
    export default {
        data() {
            return {
                overview:{ news:0,product:0,case:0,video:0},
                seo:{bd:0,so:0,sg:0},
                isSeoShow:false,
            }
        },
        methods: {
           toQYT(){ window.open('http://qyt.g3usrt.com/m.php')},
        //    toYun(){ window.open('http://www.51g3.net/g3qwyx'); },
           toYun(){ window.open('http://www.51g3.net/g3shop/'); },
           toG3shop(){ window.open('http://www.51g3.net/g3shop') },
           toDomain(){ this.$router.push({'path':'/user/website/2'}) },
           async init(){
               const rs1 = await API.modules({}).catch(err => console.log(err));
               this.overview = rs1;
               const rs2 = await API.seo({}).catch(err => console.log(err));
               if(rs2.code == 0 && rs2.msg == 'ILLEGAL_DOMAIN_NOT_EXIST'){
                   this.isSeoShow = true;
               }else{
                   this.seo = rs2;
               }
               if(JSON.stringify(this.$store.state.userMsg) == "{}"){// 或者用es6来判断 Object.keys(value).length == 0 
                    const rs3 = await API.userGet({}).catch(err => console.log(err)) || {}
                    const rs4 = await API.langList({}).catch(err=>{ console.log(err)}) || []
                    this.$store.commit('getUsername',rs3);
                    this.$store.commit('getLanglist',rs4);
                }
            },
        },
        mounted() {
            this.init();
        },
        computed:mapState(['userMsg']),
        
    }

</script>

<style scoped>
    .row1{margin-bottom:20px;}
    .row2 {margin-bottom:20px;}
    .clearfix:before,
    .clearfix:after { display: table; content: "";}
    .clearfix:after { clear: both }
    .index {width:100%; height:100%; overflow-x:hidden; overflow-y:scroll; background:#f4f4f4; box-sizing: border-box; padding:20px;}
    .el-col .box{background:#fff;}
    .item1 {text-align: center;}
    .item1 .el-col:nth-child(1) p:nth-child(1) {font-size:30px; color:#fd4d2b;line-height:1.5; margin:0;}
    .item1 .el-col:nth-child(2) p:nth-child(1) {font-size:30px; color:#2497fb;line-height:1.5; margin:0;}
    .item1 .el-col:nth-child(3) p:nth-child(1) {font-size:30px; color:#00a175;line-height:1.5; margin:0;}
    .item1 .el-col:nth-child(4) p:nth-child(1) {font-size:30px; color:#e01cc7;line-height:1.5; margin:0;}
    .item1 .el-col p:nth-child(2) {font-size:14px; color:#666666; line-height:2.5; margin:0}
    .item2 li {font-size:14px; line-height: 31px; margin:0;}
    .item2 li span {width:60; display:inline-block; color:#bbbbbb; margin-right:20px;}
    .item2 li b {font-weight: normal; color:#333333;}
    .item2 li.admin b {color:#fd4d2b;}
    .item3 { overflow:hidden;}
    .item3 a { display:block; width:116px; float:left; text-align: center; margin:15px;  transition:all .4s ease;}
    .item3 a:hover {transform:translateY(-5px); transition:all .4s ease;}
    .item3 a p {font-size:14px; color:#666666; margin:14px 0;}
    .item3 a:hover {text-decoration: none;}
    .item3 a:hover p {color:#00a175; font-weight: bold;}
    .item4 {display:flex; justify-content: space-around; padding:16px 0;}
    .item4 li p:nth-child(1) {font-size:30px; color:#333333; margin:0; text-align: center;}
    .item4 li p:nth-child(2) {font-size:14px; color:#666666; margin:14px 0;}
    .item5 li  {    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    font-size: 14px;
    line-height: 2;}
    .item5 li a {    width: 70%;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;}
    .row3 .images {display: flex;}
    .row3 .images .img {display:block; width:50%;}
    .row3 .images .img img {width:100%; cursor: pointer;}
    .row3 .images .img:nth-child(1){padding-right:10px; box-sizing: border-box;}
    .row3 .images .img:nth-child(2){padding-left:10px; box-sizing: border-box;}
</style>