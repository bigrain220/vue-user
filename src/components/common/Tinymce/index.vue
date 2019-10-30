<template>
  <div class="tinymce-container editor-container" :class="{fullscreen:fullscreen}">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
    <editorMap class="editor_map" v-if="hasMap" :hasMap=hasMap @mapEvent="mapEvent" @mapContainer="mapContainer"></editorMap>
    <div class="editor-custom-btn-container">
      <el-button icon='el-icon-upload' size="mini"  @click="uploadImage" type="primary" >上传图片</el-button>
      <editorImage  class="editor-upload-btn" v-bind:Keys="Keys" @successCBK="imageSuccessCBK" ref="images"></editorImage>
    </div>
  </div>
</template>
<script>
// import editorImage from './components/editorImage.vue'
import editorImage from '../editorImage.vue'
import plugins from './plugins'
import toolbar from './toolbar'

export default {
  name: 'tinymce',
  components: { 
    editorImage,
    editorMap:()=>import('../editorMap.vue')
  },
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      default: '',
      required:true,
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      // default: 'file edit insert view format table'
      default:''
    },
    height: {
      type: Number,
      required: false,
      default: 400
    }
  },
  data() {
    return {
      Keys:{isEditor:true , video:false},
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || 'vue-tinymce-' + +new Date(),
      fullscreen: false,
      hasMap:false,
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.initTinymce()
  },
  activated() {
    this.initTinymce()
  },
  deactivated() {
    this.destroyTinymce()
  },
   methods: {
    async uploadImage(){
      await this.$refs.images.uploadImage();
    },
    addMap(){
        this.hasMap = true;
    },
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        paste_as_text: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        fontsize_formats:"12px 14px 16px 20px 24px 30px 36px 40px 48px",
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.addButton('mapButton', {
            icon: 'image',
            tooltip:"插入地图",
            //onclick事件
            onclick: function () {
                  _this.hasMap = true;
            }
          }),
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        }
      })

    },
    destroyTinymce() {
      // console.log('destroyTinymce')
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    clearTinymce(){
      // console.log('clearTinymce')
      window.tinymce.get(this.tinymceId).setContent('')
    },
    setContent(value) {
      // console.log('setContent')
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent(value) {
      // console.log('getContent')
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    },
    mapEvent(data){
      this.hasMap = data;
    },
    mapContainer(formData,isDynamic){
      var lng = formData.num.split(',')[0];var lat = formData.num.split(',')[1];var local = formData.local;
      var map_host = location.href;
      if(map_host.indexOf('localhost')>0){
        var url = encodeURI(`//web.51g4.com/map.html?lng=${lng}&lat=${lat}&local=${local}`)
      }else{
        var url = encodeURI(`/map.html?lng=${lng}&lat=${lat}&local=${local}`)
      };
  
      if(isDynamic == true){
          window.tinymce.get(this.tinymceId).insertContent(`<iframe src=${url}
          style="width:100%;overflow:hidden;border:0;"
          frameborder="0" scrolling=no" width="100%" height="400" marginwidth="100" marginheight="100"></iframe>`);
      }else{
         window.tinymce.get(this.tinymceId).insertContent(`<img 
         src="http://api.map.baidu.com/staticimage?center=${lng},${lat}&zoom=12&width=700&height=400&markers=${lng},${lat}" alt="" />`);
      }

    }
  
    
  },

  destroyed() {
    this.destroyTinymce()
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  width:99.5%;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: -2px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}


</style>
