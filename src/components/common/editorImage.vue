<template>
  <div class="upload-container">
    <el-dialog append-to-body :visible.sync="imageVisible" title="图片/视频管理" class="ImageManage" width="1000px" :before-close="imageClose">
      <div class="box">
        <div class="left">
          <el-tree :data="treeData" node-key="id" :props="defaultProps" accordion @node-click="handleNodeClick" highlight-current ref="tree"></el-tree>
        </div>
        <div class="right" v-loading="loading" element-loading-text="图片加载中">
            <div class="imgContent">
              <div class="header">
                <span style="font-weight:bold; font-size:18px;">{{currentFolder.totalName}}图片/视频</span>
                <div class="buttons">
                  <el-button type="primary" size="mini" @click="apendImgs">使用图片(视频)({{imgsUpload.number}}张)</el-button>
                  <el-upload  ref="upload" class="upload-imgs" :before-upload="beforeUpload"  :file-list="fileList" multiple :limit="10" :on-exceed="handleExceed"  :action="uploadParam.host" :data="imgData" :on-success="handleSuccess"  :on-remove="handleRemove" :on-change="handlefileChange" :on-progress="progress">
                    <el-tooltip content="可一次批量上传10张图片" placement="top-start"><el-button type="primary" size="mini" class="el-upload__text" @click="uploadImages">上传图片/视频</el-button></el-tooltip>
                  </el-upload>
                </div>
              </div>
              <div class="body">
                  <ul>
                    <li v-for="(item,index) in imgList.rows" :class= 'item.color ? "active" : "inactive"'  @click="toggle(index)" :key="item.id">
                      <div class="img">
                        <img class="image" :src="getImage(item.filename)" alt="">
                        <img class="icon" v-show="isVideos(item.filename)" src="@/assets/img/videoico.png">
                        <div class="preview" @click.stop>
                          <el-tooltip content="预览" placement="top-start"><el-button type="text" @click="preview(item)" icon="el-icon-view"></el-button></el-tooltip>
                          <el-tooltip content="重命名" placement="top-start"><el-button type="text" @click="rename(item)" icon="el-icon-edit"></el-button></el-tooltip>
                          <el-tooltip content="移动" placement="top-start"><el-button type="text" @click="move(item)" icon="el-icon-upload2"></el-button></el-tooltip>
                          <el-tooltip content="删除" placement="top-start"><el-button type="text" @click="delImg(item)" icon="el-icon-delete"></el-button></el-tooltip>
                        </div>
                      </div>
                      <div class="title">{{item.name}}.{{item.filename.split('.')[1]}}</div>
                    </li>
                  </ul>
              </div>
            </div>
            <div class="bottom">
              <div class="pagination">
                 <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="imgList.pagination.page" :page-sizes="[8, 16, 24, 32]" :page-size="imgList.pagination.size" layout="total, sizes, prev, pager, next" :total="imgList.total"></el-pagination>
              </div>
              <div class="total">
                <span>空间{{space.total}}MB,</span><span>已使用{{space.used}}MB</span>
              </div>
            </div>
        </div>
      </div>
      
    </el-dialog>
    <el-dialog :title="previewItem.filename" class="previewImg" width="500px" :visible.sync="previewVisible" :before-close="imagePreview" >
      <video id="media" v-if="isVideo == 1" :src="getVideo(previewItem.filename)" controls autoplay></video>
      <img v-else-if="isVideo == 2" :src="getPreIco(previewItem.filename)" alt="">
      <img v-else :src="getPreview(previewItem.filename)" alt="">
    </el-dialog>
    <el-dialog title="位置移动" width="500px" :visible.sync="moveVisible">
      <el-form :model="moveForm" ref="moveForm" :rules="moveRules" label-width="100px" class="demo-ruleForm move" style="width:100%;">
				<el-form-item label="文件：" prop="filename">
					<!-- <el-input v-model="moveForm.filename" disabled></el-input> -->
          <img :src="getImage(moveForm.filename)" alt="">
				</el-form-item>
				<el-form-item label="移动位置：" prop="fid">
          <el-select v-model="moveForm.fid" placeholder="请选择">
            <el-option v-for="item in selectTree" :key="item.id"  :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="moveFiles('moveForm')">确定</el-button>
        </el-form-item>
			</el-form>
    </el-dialog>
    <el-dialog title="文件命名" width="500px" :visible.sync="renameVisible">
      <el-form :model="renameForm" ref="renameForm" :rules="renameRules" label-width="100px" class="demo-ruleForm rename" style="width:100%">
          <el-form-item label="文件：" prop="image">
            <img :src="renameForm.image">
          </el-form-item>
          <el-form-item label="原文件名：" prop="file">
            <el-input v-model="renameForm.file" disabled></el-input>
          </el-form-item>
          <el-form-item label="新文件名：" prop="newfile">
            <el-input class="newfile" v-model="renameForm.newfile" placeholder="新文件只用填写名称，不用写后缀名"></el-input> <span>{{renameForm.suffix}}</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="renameFiles('renameForm')">确定</el-button>
          </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import API from "../../api/api";
import util from "../../api/util.js";
export default {
  name: "editorSlideUpload",
  props: {
    Keys: { type: Object, required: true }
  },
  data() {
    var reg = /[\\/:*?"<>| ]/;
    var checkFilename = (rule, value, callback) => {
      value == ""
        ? callback()
        : reg.test(value)
          ? callback(new Error('文件名不能包含以下任何字符 \\/:*?"<>| '))
          : callback();
    };
    return {
      moveForm: { id: "", filename: "", fid: "" },
      moveRules: {
        fid: [
          { required: true, message: "请选择移动文件夹", trigger: "change" }
        ]
      },
      moveVisible: false,
      renameForm: { id: "", file: "", newfile: "", suffix: "", image: "" },
      renameRules: {
        newfile: [
          { required: true, message: "请输入文件名", trigger: "blur" },
          { trigger: "change", validator: checkFilename },
          {
            min: 0,
            max: 255,
            message: "长度在 0 到 255 个字符",
            trigger: "blur"
          }
        ]
      },
      renameVisible: false,
      fileList: [],
      ossExpire: 0,
      loading: false,
      response: "",
      currentFolder: { fid: "", totalName: "全部" },
      defaultFid: "",
      imageVisible: false,
      isVideo: 0,
      space: { used: 0, total: 0 },
      treeData: [{ id: 0, name: "全部" }],
      selectTree: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      // listObj: {},
      uploadParam: {
        accessid: "",
        host: "",
        expire: 0,
        dir: "",
        callback: "",
        policy: "",
        signature: "",
        count: -1,
        flag: true
      },
      imgData: {
        key: "",
        policy: "",
        OSSAccessKeyId: "",
        success_action_status: 200,
        signature: "",
        callback: ""
      },
      imgList: {
        //当前浏览的图片
        pagination: { page: 1, size: 8 },
        rows: [],
        total: 0
      },
      imgsUpload: { number: 0, list: [] },
      previewVisible: false,
      previewItem: {}
    };
  },
  methods: {
    changesss(item){
      // return item.
    },
    isVideos(filename) {
      filename = filename.split(".")[1];
      if (filename == "mp4") {
        return true;
      } else {
        return false;
      }
    },
    uploadImages() {
      this.uploadParam.uploadCount = 0;
      this.uploadParam.name = [];
      this.$refs.upload.clearFiles();
    },
    imagePreview() {
      if (this.isVideo == 1) {
        const video = document.getElementById("media");
        video.pause();
      }
      this.previewVisible = false;
    },
    preview(item) {
      const filename = item.filename.split(".")[1];
      if (filename == "mp4") {
        this.isVideo = 1;
      } else if(filename == "ico"){
        this.isVideo = 2;
      }else{
        this.isVideo = 3;
      }
      this.previewVisible = true;
      this.previewItem = item;
    },
    move(item) {
      this.moveForm.fid = "";
      this.moveForm.filename = item.filename;
      this.moveForm.id = item.id;
      this.moveVisible = true;
    },
    moveFiles(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = { id: this.moveForm.id, fid: this.moveForm.fid };
          API.ossMove(param)
            .then(rs => {
              if (rs.code == 1) {
                this.$message.success("文件移动成功");
                this.moveVisible = false;

                const params = {
                  fid: this.currentFolder.fid,
                  page: this.imgList.pagination.page,
                  rows: this.imgList.pagination.size
                };
                this.ossList(params);
              }
            })
            .catch(err => console.log(err));
        }
      });
    },
    rename(item) {
      // this.$refs['renameForm'].resetFields();
      this.renameForm.id = item.id;
      this.renameForm.suffix = "." + item.filename.split(".")[1];
      this.renameForm.file = item.name + this.renameForm.suffix;
      this.renameForm.newfile = "";
      console.log(this.renameForm.suffix);
      if (this.renameForm.suffix == ".mp4") {
        this.renameForm.image =
          "http://img01.g3wei.com/" +
          item.filename +
          "?x-oss-process=video/snapshot,t_3000,f_jpg,w_165,h_165";
      } else if(this.renameForm.suffix == ".ico"){
        this.renameForm.image = "http://img01.g3wei.com/" + item.filename ;
      }else{
        this.renameForm.image =
          "http://img01.g3wei.com/" +
          item.filename +
          "?x-oss-process=image/resize,m_pad,h_165,w_165,color_FFFFFF";
      }
      this.renameVisible = true;
    },
    renameFiles(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            id: this.renameForm.id,
            name: this.renameForm.newfile
          };
          API.ossRename(params)
            .then(rs => {
              if (rs.code == 1) {
                this.renameVisible = false;
                const params = {
                  fid: this.currentFolder.fid,
                  page: this.imgList.pagination.page,
                  rows: this.imgList.pagination.size
                };
                this.ossList(params);
              } else {
                this.$message.error(rs.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    delImg(item) {
      this.loading = true;
      API.ossDelete({ id: [item.id] })
        .then(rs => {
          if (rs.code == 1) {
            this.$message.success("删除成功");
            const params = {
              fid: this.currentFolder.fid,
              page: this.imgList.pagination.page,
              rows: this.imgList.pagination.size
            };
            this.ossList(params);
          } else {
            this.$message.error(rs.msg);
          }
          this.loading = false;
        })
        .catch(err => console.log(err));
    },
    ossList(param) {
      this.loading = true;
      API.ossList(param)
        .then(rs => {
          this.imgList.rows = rs.rows;
          this.imgList.total = rs.total;
          this.loading = false;
        })
        .catch(err => console.log(err));
    },
    imageClose() {
      this.imageVisible = false;
      this.imageInit();
    },
    toggle(index) {
      //选中当前图片 高亮
      this.imgList.rows.map((item, index) => {
        if (!item.color) {
          this.$set(item, "color");
        }
      });
      this.imgList.rows[index].color = !this.imgList.rows[index].color;
      if (this.imgList.rows[index].color) {
        this.imgsUpload.list.push(this.imgList.rows[index]);
      } else {
        this.imgsUpload.list.map((ele, idx) => {
          if (ele.id == this.imgList.rows[index].id) {
            this.imgsUpload.list.splice(idx, 1);
          }
        });
      }
      this.imgsUpload.number = this.imgsUpload.list.length;
    },
    apendImgs() {
      //使用图片
      if (this.imgsUpload.number > 0) {
        let arr = [];
        let flags = false;
        this.imgsUpload.list.map(ele => {
          const obj = { url: "" };
          const filename = ele.filename.split(".")[1];
          if (filename == "mp4" && this.Keys.video) {
            obj.url = "http://img01.g3wei.com/" + ele.filename;
            arr.push(obj);
          } else if (filename != "mp4" && !this.Keys.video) {
            obj.url = this.Keys.isEditor
              ? "http://img01.g3wei.com/" +
                ele.filename +
                "?x-oss-process=image/resize,m_lfit,h_1200,w_1200"
              : "http://img01.g3wei.com/" + ele.filename;
            arr.push(obj);
          } else {
            flags = true;
          }
        });
        if (flags) {
          this.$message.warning("操作有误，检查是否含有了图片或者视频");
        } else {
          this.$emit("successCBK", arr);
          this.imageInit();
          this.imageVisible = false;
        }
      }
    },
    imageInit() {
      //图片初始化
      this.imgsUpload = { number: 0, list: [] };
      this.imgList.pagination.page = 1;
      this.imgList.pagination.size = 8;
    },
    getImage(filename) {
      const name = filename.split(".")[1];
      if (name == "mp4") {
        return (
          "http://img01.g3wei.com/" + filename + "?x-oss-process=video/snapshot,t_3000,f_jpg,w_165,h_165"
        );
      } else if(name == "ico"){
        return "http://img01.g3wei.com/" + filename ;
      }else{
        return (
          "http://img01.g3wei.com/" +
          filename +
          "?x-oss-process=image/resize,m_pad,h_165,w_165,color_FFFFFF"
        );
      }
    },
    getVideo(filename) {
      return "http://img01.g3wei.com/" + filename;
    },
    getPreview(filename) {
      return ("http://img01.g3wei.com/" + filename + "?x-oss-process=image/resize,m_lfit,h_500,w_500" )
    },
    getPreIco(filename){
      return ("http://img01.g3wei.com/" + filename)
    },
    handleRemove(file, fileList) {
      // console.log("remove:", file, fileList);
    },
    async uploadImage() {
      //开启图片管理
      this.loading = true;
      this.imageVisible = true;
      if (this.space.total == 0) {
        this.response = await this.getSpace();
        this.space.used = (this.response.used / 1024 / 1024).toFixed(2);
        this.space.total = this.response.total / 1024 / 1024;
      }
      if (this.treeData.length == 1) {
        this.response = await this.getFolder();
        this.selectTree = this.response;
        this.response.map(ele => {
          this.treeData.push(ele);
        });
      }
      this.response = await this.getossList({
        page: this.imgList.pagination.page,
        rows: this.imgList.pagination.size
      });
      this.imgList.rows = this.response.rows;
      this.imgList.total = this.response.total;
      this.loading = false;
    },
    async handleNodeClick(data) {
      //选择左侧导航分支
      this.loading = true;
      this.currentFolder.totalName = data.name;
      this.currentFolder.fid = data.id;
      this.imgList.pagination.page = 1;
      this.response = await this.getossList({
        fid: data.id,
        page: this.imgList.pagination.page,
        rows: this.imgList.pagination.size
      });
      this.imgList.rows = this.response.rows;
      this.imgList.total = this.response.total;
      this.loading = false;
      if (this.imgsUpload.number > 0) {
        let i, j;
        for (i = 0; i < this.imgsUpload.list.length; i++) {
          for (j = 0; j < this.imgList.rows.length; j++) {
            if (this.imgsUpload.list[i].id == this.imgList.rows[j].id) {
              if (!this.imgList.rows[j].color) {
                this.$set(this.imgList.rows[j], "color");
              }
              this.imgList.rows[j].color = !this.imgList.rows[j].color;
            }
          }
        }
      }
    },
    async getFolder() {
      return await API.getFolder({}).catch(error => console.log(error));
    },
    async getSpace() {
      return await API.getSpace({}).catch(err => console.log(err));
    },
    async getossList(param) {
      return await API.ossList(param).catch(error => console.log(error));
    },
    async handleSizeChange(val) {
      //分页
      const param = { rows: val, page: 1, fid: this.currentFolder.fid };
      this.imgList.pagination.size = val;
      this.imgList.pagination.page = 1;

      this.response = await this.getossList(param);
      this.imgList.rows = this.response.rows;
      this.imgList.total = this.response.total;
    },
    async handleCurrentChange(val) {
      const param = {
        page: val,
        rows: this.imgList.pagination.size,
        fid: this.currentFolder.fid
      };
      this.imgList.pagination.page = val;
      this.response = await this.getossList(param);
      this.imgList.rows = this.response.rows;
      this.imgList.total = this.response.total;
    },
    async handleSuccess(response, file, fileList) {
      this.uploadParam.count--;
      if (this.uploadParam.count < 0) {
        let that = this;
        this.uploadParam.count = -1;
        this.$message.success("上传完毕");
        setTimeout(function() {
          that.$refs.upload.clearFiles();
        }, 3000);
        const imageUrl = this.uploadParam.host + "/" + this.imgData.key;
        this.response = await this.getSpace();
        this.space.used = (this.response.used / 1024 / 1024).toFixed(2);
        this.space.total = this.response.total / 1024 / 1024;

        this.response = await this.getossList({
          fid: this.currentFolder.fid,
          page: this.imgList.pagination.page,
          rows: this.imgList.pagination.size
        });
        this.imgList.rows = this.response.rows;
        this.imgList.total = this.response.total;

        this.imgsUpload = { number: 0, list: [] };
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择10张图片，本次选择了 ${files.length} 张图片`
      );
    },
    progress(event, file, fileList) {
      // console.log('progress:',file);
    },
    beforeUpload(file) {
      return new Promise(async (resolve, reject) => {
        const isImage = file.type === "image/jpeg" || file.type === "image/png" || file.type === "video/mp4" || file.type === "image/x-icon";
        const isLt2M = file.size / 1024 / 1024;
        if (!isImage) {
          this.$message.error("上传图片只能是 JPG 或 PNG 或 ICO 格式 , 上传视频只能为 MP4 格式" );
          reject(true);
        } else if (
          !(isLt2M < 0.3) &&
          (file.type === "image/jpeg" || file.type === "image/png")
        ) {
          this.$message.error("上传图片大小不能超过 300K");
          reject(true);
        } else if (!(isLt2M < 50) && file.type === "video/mp4") {
          this.$message.error("上传视频大小不能超过 50M");
          reject(true);
        } else {
           while(true){
             if(!this.uploadParam.lock) break;
              await usleep(100)
           }
          this.uploadParam.lock = true;
          let rs = await this.ossGet();
          delete this.uploadParam.lock;
          Object.assign(this.uploadParam, rs);
          this.uploadParam.count++;
          this.imgData = {
            key:this.uploadParam.dir + file.keyName,
            policy: this.uploadParam.policy,
            OSSAccessKeyId: this.uploadParam.accessid,
            success_action_status: 200,
            signature: this.uploadParam.signature,
            callback: this.uploadParam.callback
          };
          resolve(true);
        }
      });
    },
    async handlefileChange(file, fileList) {
      if (file.status == "ready") {
        file.name = util.random_string(10) + util.get_suffix(file.name);
        file.raw.keyName = file.name;
      }
    },
    async ossGet() {
      console.log("ossGet");
      let signNext =
        this.ossExpire < new Date().getTime() / 1000 ||
        this.defaultFid != this.currentFolder.fid;
      this.defaultFid = this.currentFolder.fid;
      let rs = {};
      if (signNext) {
        rs = await API.ossGet({ fid: this.currentFolder.fid });
        this.ossExpire = rs.expire - 3;
      }
      return rs;
    },
    async usleep(num) {
      console.log("usleep");
      return new Promise(resolve => {
        setTimeout(function() {
          resolve(true);
        }, num);
      });
    }
  }
};

const usleep = async num => {
  return new Promise(resolve => {
    setTimeout(function() {
      resolve(true);
    }, num);
  });
};
var ossExpire = 0;
const ossGet = async function() {
  let signNext =
    ossExpire < new Date().getTime() / 1000 ||
    this.defaultFid != this.currentFolder.fid;
  this.defaultFid = this.currentFolder.fid;
  let rs = {};
  if (signNext) {
    rs = await API.ossGet({ fid: this.currentFolder.fid });
    ossExpire = rs.expire - 3;
  }
  return rs;
};
</script>

<style scoped>
.editor-slide-upload {
  margin-bottom: 20px;
}

.editor-slide-upload .el-upload--picture-card {
  width: 100%;
}
.box {
  width: 100%;
  height: 540px;
  border: 1px solid #eee;
  display: flex;
  justify-content: center;
}
.box .left {
  width: 200px;
  border-right: 1px solid #ddd;
  box-sizing: border-box;
  padding: 5px;
}
.box .right {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 5px 5px 40px 5px;
  position: relative;
}
.box .el-tabs .el-tabs__header {
  padding-top: 10px;
}
.bottom {
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  height: 35px;
  line-height: 35px;
  bottom: 0;
  left: 0;
  font-size: 12px;
  border-top: 1px solid #eee;
  box-sizing: border-box;
  padding: 0 10px;
}
.bottom .total span {
  padding: 0 5px;
}
.imgContent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.imgContent .header {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
}
.imgContent .body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 5px;
}
.body ul {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}
.body ul li {
  margin: 14px;
  width: 167px;
  height: auto;
  cursor: pointer;
  position: relative;
}
.body ul li .preview {
  width: 100%;
  height: 0px;
  position: absolute;
  left: 0;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.8);
  transition: all 0.4s ease;
  text-align: center;
}
.body ul li:hover .preview {
  height: 47px;
  transition: all 0.4s ease;
}
.body ul li .img {
  width: 165px;
  height: 165px;
  overflow: hidden;
  border: 1px solid #ddd;
  transition: all 0.4s ease;
  border-radius: 0px;
  position: relative;
  box-sizing: border-box;
}
.body ul li .img .icon {
  width: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.body ul li .img .image {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.body ul li .title {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  color: #666;
  font-weight: bold;
}
.el-pagination {
  margin: 0;
}
.upload-imgs {
  display: inline;
}
.body ul li.active .title {
  color: #409eff;
}
.body ul li.active .img {
  box-shadow: 0 5px 10px #cacaca;
  border: 2px solid #409eff;
}

.previewImg .el-dialog__body {
  padding: 15px;
}
.previewImg .el-dialog__header {
  padding: 10px 20px;
}
.previewImg img {
  display: block;
  width: 100%;
  height: auto;
}
video {
  width: 100%;
  height: 100%;
}
.preview .el-button {
  font-size: 20px;
  color: #fff;
}
.preview .el-button:hover {
  color: #409eff;
}
.move img {
  border: 1px solid #ddd;
}
.rename .newfile {
  width: 320px;
}
</style>
