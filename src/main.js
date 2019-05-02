// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import VueResource from 'vue-resource'
import * as filters from './filter'
import {Layout, Form, Table, Button, Menu, Icon, Input, Drawer, Steps, Upload, InputNumber, DatePicker, Spin, Divider, Card, Switch, Collapse, Avatar}from 'ant-design-vue'
import {Col, Row, List, Select, Cascader} from 'ant-design-vue'
import {message, notification, Modal, Popconfirm, Tooltip, TreeSelect} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import appConfigs from './configs';

Vue.config.productionTip = false

// filter
for (const key in filters) {
  Vue.filter(key, filters[key])
}

// http client
// Vue.use(VueResource);

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
Vue.use(Upload)
Vue.use(Modal)
Vue.use(InputNumber)
Vue.use(DatePicker)
Vue.use(Spin)
Vue.use(Divider)
Vue.use(Popconfirm)
Vue.use(Card)
Vue.use(Switch)
Vue.use(Collapse)
Vue.use(Avatar)
Vue.use(Tooltip);
Vue.use(TreeSelect);
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
