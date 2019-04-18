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
        >Remember me</a-checkbox>
        <a class="login-form-forgot" href>Forgot password</a>
        <a-button type="primary" html-type="submit" class="login-form-button">Log in</a-button>Or
        <router-link :to="{name:'register'}">register now!</router-link>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      let that = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          that.$http.post("http://localhost/user/auth", values).then(
            resp => {
              console.log("status: ", resp.status);
              console.log(resp.body);
              var data = resp.body;
              if (data.status == 200) {
                that.$message.success("登录成功!");
                that.$store.commit("user", data.data);
                that.$router.replace(
                  that.$route.params.wantedPath || { name: "home" }
                );
              } else {
                that.$message.warning(data.data);
              }
            },
            resp => {
              console.log("登录失败");
              console.log(resp);
              that.$message.error("系统错误");
            }
          );
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