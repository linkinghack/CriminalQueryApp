<template>
  <a-form id="components-form" :form="form" @submit="handleSubmit">
    <a-form-item v-bind="formItemLayout" label="提示">
      <span :style="{color:'#f00'}">仅修改需要更新部分即可</span>
    </a-form-item>
    <a-form-item label="逃犯姓名" v-bind="formItemLayout">
      <a-input
        v-decorator="[
          'name',
          {rules: [{ required: false, message: '请输入逃犯姓名' }]}
        ]"
        placeholder="逃犯姓名"
      />
    </a-form-item>

    <a-form-item v-bind="formItemLayout" label="性别">
      <a-select
        v-decorator="[
          'sex',
          {rules: [{ required: false, message: '请选择逃犯性别' }]}
        ]"
        placeholder="逃犯性别"
      >
        <a-select-option value="1">男</a-select-option>
        <a-select-option value="2">女</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item v-bind="formItemLayout" label="逃犯照片">
      <div class="clearfix">
        <a-upload
          v-decorator="['portraitFileID', {
            valuePropName: 'fileList',
            getValueFromEvent: normFile,
          }]"
          :action="uploadFileURL"
          listType="picture-card"
          @preview="handlePreview"
        >
          <div v-if="canAddImg">
            <a-icon type="plus"/>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage">
        </a-modal>
      </div>
    </a-form-item>

    <a-form-item label="逃犯身份证号" v-bind="formItemLayout">
      <a-input
        v-decorator="[
          'idCardID',
          {rules: [{ required: false, message: '逃犯身份证' }]}
        ]"
        placeholder="逃犯身份证号(非必填)"
      />
    </a-form-item>

    <a-form-item label="逃犯身高(厘米)" v-bind="formItemLayout">
      <a-input-number
        style="width:100%"
        v-decorator="['height']"
        :min="50"
        :max="500"
      />
    </a-form-item>

    <!-- 生日,用于年龄筛选 -->
    <a-form-item label="逃犯生日" v-bind="formItemLayout">
      <a-date-picker
        style="width:100%"
        v-decorator="[
          'birthday',
          {rules: [{ required: false, message: '逃犯生日' }]}
        ]"
      />
    </a-form-item>

    <a-form-item label="逃犯电话" v-bind="formItemLayout">
      <a-input
        v-decorator="[
          'phone',
          {rules: [{ required: false, message: '逃犯电话号码' }]}
        ]"
        placeholder="逃犯(曾用)电话号码"
      />
    </a-form-item>

    <a-form-item label="逃犯籍贯" v-bind="formItemLayout">
      <a-input
        v-decorator="[
          'bornPlace',
          {rules: [{ required: false, message: '逃犯籍贯' }]}
        ]"
        placeholder="逃犯籍贯"
      />
    </a-form-item>

    <a-form-item label="逃犯住址" v-bind="formItemLayout">
      <a-input
        v-decorator="[
          'address',
          {rules: [{ required: false, message: '逃犯住址' }]}
        ]"
        placeholder="逃犯(曾居住)住址"
      />
    </a-form-item>

    <a-form-item label="逃犯工作种类" v-bind="formItemLayout">
      <a-input
        v-decorator="[
          'job',
          {rules: [{ required: false, message: '逃犯工作种类' }]}
        ]"
        placeholder="逃犯工作种类"
      />
    </a-form-item>

    <a-form-item label="逃犯工作单位" v-bind="formItemLayout">
      <a-input
        v-decorator="[
          'workFor',
          {rules: [{ required: false, message: '逃犯工作单位' }]}
        ]"
        placeholder="逃犯工作单位"
      />
    </a-form-item>

    <a-form-item label="逃犯教育背景" v-bind="formItemLayout">
      <a-input
        v-decorator="[
          'eduBackground',
          {rules: [{ required: false, message: '逃犯教育背景' }]}
        ]"
        placeholder="逃犯教育背景"
      />
    </a-form-item>

    <a-form-item label="其他特征描述" v-bind="formItemLayout">
      <a-textarea
        v-decorator="[
          'otherFeatures',
          {rules: [{ required: false, message: '描述其他特征' }]}
        ]"
        placeholder="描述逃犯其他特征"
        :rows="4"
      />
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
      <a-button type="primary" html-type="submit" :disabled="loading">更新</a-button>
    </a-form-item>
    <div>
      <a-spin v-if="loading"/>
    </div>
  </a-form>
</template>

<script>
import appConfigs from '../configs';

export default {
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  data() {
    return {
      loading: false,
      canAddImg: true,
      uploadFileURL: appConfigs.ApiBaseUrl + "/oss/file",
      formItemLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      },
      previewVisible: false,
      previewImage: "",
      fileList: []
    };
  },
  computed: {
    criminalInfo() {
      return this.$store.getters.currentCriminalDetail.criminalBasicInfo || {};
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      let that = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          console.log(String(values.birthday));
          if (that.fileList.length > 0)
            values.portraitFileID = that.fileList[0].fileID;
          // axio request
          that.loading = true;
          axios
            .post(appConfigs.ApiBaseUrl + "/criminal/basicInfo", values, {
              headers: { Token: localStorage.getItem("token") }
            })
            .then(response => {
              that.loading = false;
              console.log("create criminal basic info done > ");
              console.log(response.data);
              let respData = response.data;
              if (respData.status == 200) {
                // 将刚刚添加的逃犯信息保存至Vuex
                that.$store.commit("newCriminalInfo", respData.data);
                that.$message.success("添加新逃犯成功");
                that.$emit("success"); // 通知上层组件已完成
              } else {
                that.$message.warning(respData.data);
              }
            })
            .catch(error => {
              that.loading = false;
              console.log("CreateCrminal basicinfo failed.");
              console.log(error);
              that.$message.error("无法创建逃犯信息");
            });
        }
      });
    },
    // 照片上传组件
    normFile(e) {
      this.canAddImg = false;
      console.log("Upload event:", e);
      if (e.file.status === "done") {
        let uploadResp = e.file.response;
        if (uploadResp.status == 200) {
          this.fileList.push(uploadResp.data);
          this.$message.success("上传成功");
        } else {
          this.$message.warning(uploadResp.data);
        }
      }

      if (e.file.status === "error" || e.file.status === "removed") {
        this.canAddImg = true;
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
    }
  }
};
</script>

<style scoped>
</style>


