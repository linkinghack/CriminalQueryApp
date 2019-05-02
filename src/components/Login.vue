<template>
  <div class="center">
    <a-form
      id="components-form-demo-normal-login"
      :form="form"
      class="login-form center-container"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          v-decorator="[
          'userID',
          { rules: [{ required: true, message: '请输入用户名!' }] }
        ]"
          placeholder="用户名"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入密码!' }] }
        ]"
          type="password"
          placeholder="密码"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-checkbox
          v-decorator="[
          'remember',
          {
            valuePropName: 'checked',
            initialValue: true,
          }
        ]"
        >1小时免登录</a-checkbox>
        <a class="login-form-forgot" href>Forgot password</a>
        <a-button type="primary" html-type="submit" class="login-form-button">Log in</a-button>Or
        <router-link :to="{name:'register'}">没有账户,注册一个</router-link>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import appConfigs from "../configs";
import Axios from "axios";
import Vue from "vue";
import { Checkbox } from "ant-design-vue";
Vue.use(Checkbox);

export default {
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  created() {
    console.log("configs loaded: ", appConfigs);
  },
  methods: {
    loadUserDepartment() {
      let user = this.$store.getters.user;
      let that = this;
      if (user) {
        console.log("用户信息存在，加载所属部门信息");
        Axios
          .get(appConfigs.ApiBaseUrl + "/user/ofDepartment/" + user.id, {
            headers: { Token: localStorage.getItem("token") }
          }).then(resp => {
            console.log('加载所属部门:返回结果')
            console.log(resp)
            if (resp.status == 200 && resp.data.status == 200) {
              let department = resp.data.data;
              localStorage.setItem(
                "userDepartment",
                JSON.stringify(department)
              );
              that.$store.commit("userDepartment", department);
            } else {
              that.$message.warning("无法加载所属部门信息");
            }
          })
          .catch(error => {
            console.log(error);
            that.$message.error("加载所属部门错误");
          });
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      let that = this;
      this.form.validateFields((err, values) => {
        console.log('登录请求前校验：')
        console.log(err)
        if (!err) {
          Axios
            .post(appConfigs.ApiBaseUrl + "/sso/login", values)
            .then(function(resp) {
              console.log(resp)
              console.log("status: ", resp.status);
              console.log(resp.data);
              var respBody = resp.data;
              if (respBody.status == 200) {
                that.$message.success("登录成功!");
                that.$store.commit("user", respBody.data.user);
                localStorage.setItem("token", respBody.data.token);
                localStorage.setItem(
                  "user",
                  JSON.stringify(respBody.data.user)
                );

                // 异步加载用户所属部门
                that.loadUserDepartment();

                that.$router.push(
                  that.$route.params.wantedPath || { name: "criminalquery" }
                );
              } else {
                that.$message.warning(respBody.data);
              }
            })
            .catch(function(error) {
              console.log("登录失败");
              console.log(error);
              that.$message.error("系统错误,登录失败");
            });
        }
      });
    }
  }
};
</script>

<style scoped>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}

.center {
  width: 70%;
}
.center-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}
</style>