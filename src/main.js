// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import * as filters from './filter'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

// filter
for (const key in filters) {
  Vue.filter(key, filters[key])
}

// http client
Vue.use(VueResource);

//antd
Vue.use(Antd)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created() {
    this.$http.interceptors.push(function(request) {
      return function(response) {
        if (response.status == 403) {
          console.log('status 403')
          this.$message.warn("登录态过期,请重新登录");
          this.$router.push({name:"login", params:{}})
        }
      }
    })
  },
})