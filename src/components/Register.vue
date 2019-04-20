<template>
  <div class="center">
    <a-form :form="form" class="center-container" @submit="handleSubmit">
      <a-form-item v-bind="formItemLayout">
        <span slot="label">
          用户名&nbsp;
          <a-tooltip title="用于登录的用户名">
            <a-icon type="question-circle-o"/>
          </a-tooltip>
        </span>
        <a-input
          v-decorator="[
          'userID',
          {
            rules: [{ required: true, message: '请输入用于登录的用户名', whitespace: false }]
          }
        ]"
        />
      </a-form-item>

      <a-form-item v-bind="formItemLayout" label="密码">
        <a-input
          v-decorator="[
          'password',
          {
            rules: [{
              required: true, message: '请输入密码',
            }, {
              validator: validateToNextPassword,
            }],
          }
        ]"
          type="password"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="确认密码">
        <a-input
          v-decorator="[
          'confirm',
          {
            rules: [{
              required: true, message: '再输入一次密码以确认',
            }, {
              validator: compareToFirstPassword,
            }],
          }
        ]"
          type="password"
          @blur="handleConfirmBlur"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="E-mail">
        <a-input
          v-decorator="[
          'email',
          {
            rules: [{
              type: 'email', message: '请输入您的邮箱地址',
            }, {
              required: true, message: '邮箱地址是必填项！',
            }]
          }
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="姓名">
        <a-input
          v-decorator="[
          'realName',
          {
            rules: [{
              required: true, message: '真实姓名是必填项',
            }]
          }
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout">
        <span slot="label">
          所属部门&nbsp;
          <a-tooltip title="需要对应部门管理员审核后才能开通账号">
            <a-icon type="question-circle-o"/>
          </a-tooltip>
        </span>
        <!-- 部门选择器 -->
        <a-tree-select
          style="width: 100%"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          treeDataSimpleMode
          :treeData="treeData"
          placeholder="请选择所属部门"
          v-decorator="[
          'departmentID',
          {
            rules: [{
              required: true, message: '请选择申请加入的部门',
            }]
          }
        ]"
        ></a-tree-select>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="手机号码">
        <a-input
          v-decorator="[
          'phone',
          {
            rules: [{ required: true, message: '请输入手机号' }],
          }
        ]"
          style="width: 100%"
        >
          <a-select
            slot="addonBefore"
            v-decorator="[
            'prefix',
            { initialValue: '86' }
          ]"
            style="width: 70px"
          >
            <a-select-option value="86">+86</a-select-option>
          </a-select>
        </a-input>
      </a-form-item>

      <a-form-item v-bind="formItemLayout" label="验证码">
        <a-row :gutter="8">
          <a-col :span="12">
            <a-input
              v-decorator="[
              'captcha',
              {rules: [{ required: true, message: '请输入邮箱验证码!' }]}
            ]"
            />
          </a-col>
          <a-col :span="12">
            <a-button>获取验证码</a-button>
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item v-bind="tailFormItemLayout">
        <a-button type="primary" html-type="submit">注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import appConfigs from '../configs';
import Vue from 'vue'
import { Tooltip, TreeSelect } from 'ant-design-vue';
import { constants } from 'crypto';
import { notEqual } from 'assert';
Vue.use(Tooltip)
Vue.use(TreeSelect)

const treeData = []

export default {
  data() {
    return {
      departmentID: "1",
      confirmDirty: true,
      treeData,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 8
          }
        }
      }
    };
  },
  
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.loadDepartments()
  },
  methods: {
    loadDepartments() {
      let that = this;
      // 加载省级部门数据
      that.$http.get(appConfigs.ApiBaseUrl + '/departments/tree/nodes')
        .then(
        resp => {
          // 成功
          console.log("provinces loaded. ", resp.status);
          var data = resp.body;
          if (data.status == "200") {
            that.treeData = data.data
          }
        },
        resp => {
          // 失败
          that.$message.error("无法加载省级部门数据");
        })
    },
    handleSubmit(e) {
      // 提交注册
      let that = this;
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          that.$http.post( appConfigs.ApiBaseUrl + "/user/register", values).then(
            resp => {
              // 成功
              let respbody = resp.body;
              if (resp.status == 200 && respbody.status == "200") {
                that.$message.success(respbody.data);
              } else {
                // 失败
                that.$message.error("注册失败");
              }
            },
            resp => {
              // 失败
              that.$message.error("未知错误，注册失败");
            }
          );
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
  },
};
</script>

<style scoped>
.center {
  width: 90%;
}
.center-container {
  width: 80%;
  padding-right: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}
</style>
