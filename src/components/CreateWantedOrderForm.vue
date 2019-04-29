<template>
  <a-form id="components-form" :form="form" @submit="handleSubmit">
    <a-form-item v-bind="formItemLayout" label="通缉对象">
      <span class="ant-form-text">{{newCriminalInfo.name}} - {{sexSwitch( newCriminalInfo.sex)}}</span>
    </a-form-item>

    <a-form-item v-bind="formItemLayout" label="通缉区域">
      <district-selector
        :rootID="userDepartment.districtID"
        v-decorator=" ['districtID', {
                  rules: [{ required: true, message: '管辖区域是必填项' }]
                }]"
      />
    </a-form-item>

    <a-form-item label="通缉级别" v-bind="formItemLayout">
    <a-select
      v-decorator="[
            'arrestLevel',
            { initialValue: '1' }
          ]"
    >
      <a-select-option value="1">一级</a-select-option>
      <a-select-option value="2">二级</a-select-option>
      <a-select-option value="3">三级</a-select-option>
    </a-select>
    </a-form-item>

    <a-form-item label="通缉原因描述" v-bind="formItemLayout">
      <a-textarea
        v-decorator="[
          'arrestReason',
          {rules: [{ required: true, message: '描述通缉原因' }]}
        ]"
        placeholder="描述通缉原因（罪行等）"
        :rows="4"
      />
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
      <a-button type="primary" html-type="submit" :disabled="loading">发起通缉</a-button>
    </a-form-item>
    <div>
      <a-spin v-if="loading"/>
    </div>
  </a-form>
</template>

<script>
import appConfigs from "../configs";
import axios from "axios";
import DistrictSelector from './DistrictSelector.vue'
export default {
  components: {
    DistrictSelector,
  },
  computed: {
    userDepartment() {
      return this.$store.getters.userDepartment;
    },
    newCriminalInfo() {
      return this.$store.getters.newCriminalInfo || {};
    }
  },
  data: () => ({
    loading: false,
    formItemLayout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 }
    }
  }),
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    sexSwitch(sex) {
      return appConfigs.sexMap[sex]
    },
    handleSubmit(e) {
      e.preventDefault();
      let that = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          console.log(String(values.birthday));
          values.criminalID = that.newCriminalInfo.id
          // axio request
          that.loading = true;
          axios
            .post(appConfigs.ApiBaseUrl + "/wanted/order", values, {
              headers: { Token: localStorage.getItem("token") }
            })
            .then(response => {
              that.loading = false;
              if(response.status == 200 && response.data.status == 200) {
                that.$store.commit('newWantedOrder', response.data.data)
                that.$message.success('成功通缉-'+that.newCriminalInfo.name)
                that.$emit('success')
                // 加载刚刚提交的逃犯信息
                axios.get(appConfigs.ApiBaseUrl + "/criminal/detailByID/" + that.newCriminalInfo.id, {
                  headers: { Token: localStorage.getItem("token") }
                })
                  .then(resp => {
                    if(resp.status == 200 && resp.data.status == 200) {
                      that.$store.commit('currentCriminalDetail', resp.data.data)
                    } else {
                      that.$message.error("系统错误:" + String(resp.data))
                    }
                  })
                  .catch(error => {
                    that.$message.error("无法连接服务器")
                  })
              } else {
                that.$message.warning(response.data.msg)
              }
            })
            .catch(error => {
              that.loading = false;
              console.log("Create wanted order failed.");
              console.log(error);
              that.$message.error("无法发起通缉");
            });
        }
      });
    },
   
  }
};
</script>
<style>
</style>