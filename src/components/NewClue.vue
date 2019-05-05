<template>
  <a-form id="components-form" :form="form" @submit="handleSubmit">
    <a-form-item v-bind="formItemLayout" label="通缉对象">
      <span class="ant-form-text">{{currentCriminal.name}} - {{sexSwitch( currentCriminal.sex)}}</span>
    </a-form-item>

    <a-form-item v-bind="formItemLayout" label="逃犯照片">
      <div class="clearfix">
        <a-upload
          v-decorator="['portraitFileID', {
            valuePropName: 'fileIDs',
            getValueFromEvent: normFile,
          }]"
          :action="uploadFileURL"
          listType="picture-card"
          @preview="handlePreview"
        >
          <div v-if="fileList.length <= 5">
            <a-icon type="plus"/>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage">
        </a-modal>
      </div>
    </a-form-item>

    <a-form-item label="线索描述" v-bind="formItemLayout">
      <a-textarea
        v-decorator="[
          'description',
          {rules: [{ required: true, message: '自然语言描述线索' }]}
        ]"
        placeholder="自然语言描述线索详情(出现时间地点等等)"
        :rows="4"
      />
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
      <a-button type="primary" html-type="submit" :disabled="loading">添加</a-button>
    </a-form-item>
    <div>
      <a-spin v-if="loading"/>
    </div>
  </a-form>
</template>

<script>
import appConfigs from "../configs";
import Axios from "axios";
export default {
  computed: {
    currentCriminal() {
      return this.$store.getters.currentCriminalDetail.criminalBasicInfo || {};
    }
  },
  data: () => ({
    loading: false,
    uploadFileURL: appConfigs.ApiBaseUrl + "/oss/file",
    formItemLayout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    },
    previewVisible: false,
    previewImage: "",
    fileList: [],
    fileIDs: ""
  }),
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    sexSwitch(sex) {
      return appConfigs.sexMap[sex];
    },
    // 照片上传组件
    normFile(e) {
      console.log("Upload event:", e);
      if (e.file.status === "done") {
        let uploadResp = e.file.response;
        if (uploadResp.status == 200) {
          this.fileList.push(uploadResp.data.fileID);
          this.$message.success("上传成功");
        } else {
          this.$message.warning(uploadResp.data);
        }
      }

      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      this.previewImage = file.response.data.url || file.thumbUrl;
      this.previewVisible = true;
    },

    handleSubmit(e) {
      e.preventDefault();
      let that = this;
      this.fileIDs = this.fileList.join(","); // fileID 逗号分割
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          console.log("数据校验结束");
          console.log(that.currentCriminal);
          values.criminalID = that.currentCriminal.id;
          values.fileIDs = that.fileIDs;
          // axio request
          Axios.post(appConfigs.ApiBaseUrl + "/criminal/clue", values, {
            headers: { Token: localStorage.getItem("token") }
          })
            .then(response => {
              that.loading = false;
              if (response.status == 200 && response.data.status == 200) {
                that.$message.success("线索已添加");
                that.$emit("success");
                // 加载刚刚提交的逃犯信息
                Axios.get(
                  appConfigs.ApiBaseUrl +
                    "/criminal/detailByID/" +
                    that.currentCriminal.id,
                  {
                    headers: { Token: localStorage.getItem("token") }
                  }
                )
                  .then(resp => {
                    if (resp.status == 200 && resp.data.status == 200) {
                      that.$store.commit(
                        "currentCriminalDetail",
                        resp.data.data
                      );
                    } else {
                      that.$message.error("系统错误:" + String(resp.data));
                    }
                  })
                  .catch(error => {
                    that.$message.error("无法连接服务器");
                  });
              } else {
                that.$message.warning(response.data.msg);
              }
            })
            .catch(error => {
              that.loading = false;
              console.log("Create wanted order failed.");
              console.log(error);
              that.$message.error("无法添加线索");
            });
        }
      });
    }
  }
};
</script>
<style>
</style>