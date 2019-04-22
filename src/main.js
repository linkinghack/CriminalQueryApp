// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import * as filters from './filter'
import {Layout, Form, Table, Button, Menu, Icon, Input, Drawer, Steps}from 'ant-design-vue'
import {Col, Row, List, Select, Cascader} from 'ant-design-vue'
import {message, notification, Modal} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import appConfigs from './configs';

Vue.config.productionTip = false

// filter
for (const key in filters) {
  Vue.filter(key, filters[key])
}

// http client
Vue.use(VueResource);

//antd
Vue.use(Layout)
Vue.use(Form)
Vue.use(Table)
Vue.use(Button)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(Input)
Vue.use(Col)
Vue.use(Row)
Vue.use(List)
Vue.use(Select)
Vue.use(notification)
Vue.use(message)
Vue.use(Cascader)
Vue.use(Drawer)
Vue.use(Steps)
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created() {
    // 添加登录态前端校验
    this.$http.interceptors.push(function(request) {
      return function(response) {
        if (response.status == 403) {
          console.log('status 403')
          this.$message.warn("登录态过期,请重新登录");
          this.$router.push({name:"login", params:{}})
        }
      }
    });
  },
})

Vue.http.interceptors.push((req, next)=>{
  req.credentials = true;
  next();
})