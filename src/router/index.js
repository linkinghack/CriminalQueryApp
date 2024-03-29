import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Home from '@/components/Home.vue'
import NotFound from '@/components/NotFound.vue'
import FAQ from '@/components/FAQ.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register'
import Departments from '@/components/DepartmentManage'
import CriminalQuery from '@/components/CriminalQuery'
import SubmitCriminalAndWantedOrder from '@/components/SubmitCriminalAndWantedOrder'
import CriminalDetail from '@/components/CriminalDetail'
import UserManage from '@/components/UserManage'
import UserRegisterApplications from '@/components/UserRegisterApplications'
Vue.use(VueRouter);

const routers = [
  { path: '/', name: 'home', component: CriminalQuery, meta: {private: true} },
  // something else
  { path: '/faq', name: 'faq', component: FAQ, meta: {private: true}},
  { path: '/login', name: 'login', component: Login},
  { path: '/register', name: 'register', component: Register},
  { path: '/departments', name: 'departments', component: Departments , meta: {private: true}},
  { path: '/criminalquery', name: 'criminalquery', component: CriminalQuery, meta: {private: true}},
  { path: '/submitcriminal', name: 'submitcriminal', component: SubmitCriminalAndWantedOrder, meta: {private: true}},
  { path: '/criminalDetail', name: 'criminalDetail', component: CriminalDetail, meta: {private: true}},
  { path: '/userManage', name: 'userManage', component: UserManage, meta: {private: true}},
  { path: '/registerApplications', name: 'registerApplications', component: UserRegisterApplications, meta: {private: true}},

  // not found page
  { path: '*', component: NotFound }
];

const router = new VueRouter({
  routes: routers,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return {x: 0, y: 0}
  }
});

router.beforeEach((to, from, next)=> {
  console.log('@route-beforeEach: to ', to.name)
  // 路由路径中包含任意一个私有页面都将跳转至登录页面
  if(to.matched.some(r => r.meta.private)  && !store.getters.user) {
    next({name:'login', params:{wantedRoute:to.fullPath}})
    return
  }
  next()
});

export default router;