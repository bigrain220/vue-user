<template>
  <el-dialog title="编辑地图" :visible.sync="dialogMapVisible" append-to-body>
    <el-form
      :inline="true"
      :model="form"
      class="demo-form-inline"
      label-position="right"
      size="small"
      ref="searchForm"
    >
      <el-form-item label="请输入地址"  prop="local"
      :rules="[
          { required: true, message: '请输入地址', trigger: ['blur', 'change'] },
      ]"
      >
        <el-input v-model="form.local" placeholder="请输入地址" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchByStationName" style="margin-right:50px;">查询</el-button>
      </el-form-item>
      <el-form-item label="查询结果(经纬度)">
        <el-input v-model="form.num" placeholder="经纬度"  :disabled="true"></el-input>
      </el-form-item>
       <el-form-item label="">
          <el-checkbox v-model="checked" style="margin-left:10px;">插入动态地图</el-checkbox>
      </el-form-item>
    </el-form>
    <div id="container" ref="container" style="position: relative; width: 100%;height: 400px;margin-top: 14px;border: 1px solid #999;overflow: hidden;">
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="mapCancel" size="medium" >取 消</el-button>
      <el-button type="primary" @click="mapSure" size="medium" >确 定</el-button>
    </div>
  </el-dialog>
</template>


<script>
export default {
    name:'editorMap',
  data() {
    return {
      dialogMapVisible: true,
      form: {
        local: "",
        num: ""
      },
      map:"",
      localSearch:"",
      hasSearch:false,
      checked:false
    };
  },
    
    mounted() {
        this.$nextTick(() => {
            this.map = new BMap.Map("container");
            this.map.centerAndZoom("深圳", 12);
            this.map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
            this.map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

            this.localSearch = new BMap.LocalSearch(this.map);
            this.localSearch.enableAutoViewport(); //允许自动调节窗体大小
        })
  },
  methods: {
    mapSure() {
       this.$refs.searchForm.validate((valid) => {
          if (valid) {
              if (this.hasSearch == true) {
                  this.$emit("mapContainer",this.form,this.checked);
                  this.dialogMapVisible = false;
                } else {
                  this.$alert('请点击查询按钮确认位置', '温馨提示：', {
                      confirmButtonText: '确定',
                      callback: action => {
                          return;
                      }
                  });
                }
          }else{
               return false;
          }
      })
    },
    mapCancel(){
      this.dialogMapVisible = false;
    },
    searchByStationName() {
      this.map.clearOverlays(); //清空原来的标注
      var that = this;
      this.localSearch.setSearchCompleteCallback(function(searchResult) {
        var poi = searchResult.getPoi(0);
         if(!poi){
             that.hasSearch=false;
             that.$alert('定位失败，请确保输入的地址无误', '提示：', {
                      confirmButtonText: '确定',
                      type: 'warning',
                      callback: action => {
                          return;
                      }
                  });
         }else{
            that.hasSearch=true;
            that.form.num = poi.point.lng + "," + poi.point.lat;
            that.map.centerAndZoom(poi.point, 13);
            var marker = new BMap.Marker(
              new BMap.Point(poi.point.lng, poi.point.lat)
            ); // 创建标注，为要查询的地方对应的经纬度
            that.map.addOverlay(marker);
            var content = that.form.local; 
            var address = poi.address;       
            var infoWindow = new BMap.InfoWindow(
              "<p style='font-size:14px;'>" + content + "</p><p style='font-size:12px;color:#666;'>"+address+"</p>"
            );
            // console.log(that.map,that.localSearch,poi)
            marker.addEventListener("click", function() {
                this.openInfoWindow(infoWindow);
            });
         }
      });
      this.localSearch.search(that.form.local);
    },

  },
    watch: {
        dialogMapVisible(val) {
            this.$emit("mapEvent", val);
        }
    },

};
</script>

<style scoped>

</style>


