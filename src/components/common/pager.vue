<template>
    <div class="pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[ 10,20, 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                size:10,
            }
        },
        methods: {
            handleSizeChange(val){
				this.size = val;
				this.getList({});
			},
        },
    }
</script>

<style scoped>

</style>