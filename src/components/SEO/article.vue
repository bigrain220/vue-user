<template>
    <div class="article">
        <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="词库" name="first">
                <Keywords ref="keywords"></Keywords>
            </el-tab-pane>
            <el-tab-pane label="标题" name="second">
                <Title ref="title"></Title>
            </el-tab-pane>
            <el-tab-pane label="段落" name="third">
                <Paragraph ref="paragraph"></Paragraph>
            </el-tab-pane>
            <el-tab-pane label="文章" name="fourth">
                <Published ref="published"></Published>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import Keywords from './keywords.vue'
    import Title from './title.vue'
    import Paragraph from './paragraph.vue'
    import Published from './published.vue'
    export default {
        components:{Keywords , Title , Paragraph , Published},
        data() {
            return {
              activeName:'first'
            }
        },
        methods: {
            handleClick() {
                
            },
            handleClick(){
                switch (this.activeName) {
                    case 'first' : if(this.$refs.keywords.dataList.length == 0) this.$refs.keywords.init({}); break ;
                    case 'second' :  if(this.$refs.title.dataList.length == 0) this.$refs.title.init({}); break ;
                    case 'third' :  if(this.$refs.paragraph.dataList.length == 0) this.$refs.paragraph.init({}); break ;
                    case 'fourth' :  if(this.$refs.published.dataList.length == 0) this.$refs.published.init({}); break ;
                    default: break;
                }
            }
        },
        mounted(){
            this.handleClick();
        },
    }
</script>

<style scoped>
    .el-tabs__active-bar {display:none;}
    
</style>
<style>
.tabs .el-tabs__item {padding:0 5px; margin:0 10px;}
.tabs .el-tabs__item::after {content:''; background:url('../../assets/img/arrow-right.png') no-repeat center;    position: absolute;right: -27px;top: 0;width: 100%;height: 100%;}
.tabs .el-tabs__item:last-child::after {display:none;}
.tabs .el-tabs__active-bar {display:none;}
.tabs .el-tabs__item:nth-child(1) {margin-left:0;}
.tabs .el-tabs__header {margin:0 0 25px;}
.tabs .el-table {margin-top:10px;}
.tabs .handle_add {margin:0;}
.el-tabs__item.is-active {font-size:18px; font-weight:bold;}
</style>
<style>
    .tabs .el-table td {padding:5px 0 !important;}
</style>

