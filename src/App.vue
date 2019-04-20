<template>
  <a-layout id="components-layout-demo-responsive">
    <a-layout-sider
      breakpoint="lg"
      collapsedWidth="0"
      width="240"
      :theme="theme"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo">逃犯查询系统</div>
      <!-- 菜单栏 -->
      <a-menu
        style="width: 240px"
        :defaultOpenKeys="[opendSub]"
        mode="inline"
        :theme="theme"
        :selectedKeys="[current]"
        @click="handleClick"
      >
        <a-sub-menu key="sub1">
          <span slot="title">
            <a-icon type="database"/>
            <span>查询系统</span>
          </span>
          <a-menu-item key="1">
            <a-icon type="folder-open"/>逃犯查询
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="folder-open"/>通缉令查询
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="pie-chart"/>数据统计
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="sub2">
          <span slot="title">
            <a-icon type="warning"/>
            <span>通缉管理</span>
          </span>
          <a-menu-item key="4">发起通缉</a-menu-item>
          <a-menu-item key="6">我发布的通缉令</a-menu-item>
          <a-menu-item key="7">我发布的嫌犯</a-menu-item>
          <a-menu-item key="8">申请广范围发布本区通缉</a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="sub3">
          <span slot="title">
            <a-icon type="bank"/>
            <span>公安管理</span>
          </span>
          <a-menu-item key="9">
            <router-link :to="{name:'departments'}">
              <a-icon type="cluster"/>部门管理
            </router-link>
          </a-menu-item>
          <a-menu-item key="10">
            <a-icon type="solution"/>成员管理
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="sub4">
          <span slot="title">
            <a-icon type="dashboard"/>
            <span>系统中心</span>
          </span>
          <a-menu-item key="11">
            <a-icon type="security-scan"/>通缉令发布审批
          </a-menu-item>
          <a-menu-item key="12">
            <a-icon type="info-circle"/>新用户审批
          </a-menu-item>
        </a-sub-menu>

        <a-menu-item key="13">
          <a-icon type="user"/>我的信息
        </a-menu-item>

        <a-sub-menu key="sub5">
          <span slot="title">
            <a-icon type="heart" theme="twoTone" twoToneColor="#eb2f96"/>
            <span>帮助</span>
          </span>
          <a-menu-item key="14">系统简介</a-menu-item>
          <a-menu-item key="15">关于</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout :style="{ minHeight: '100vh'}">
      <a-layout-header :style="{ background: '#fff', padding: 0 }">
        <div class="spacebetween-content">
          <div v-if="user">
            你好:
            <span v-if="user.role==1">管理员</span>
            {{user.realName}}
          </div>
          <div v-else>
            <span>请登录</span>
          </div>

          <div v-if="!user">
            <a-button type="primary" @click="login">登录</a-button>
            <a-button @click="register">注册</a-button>
          </div>
          <div v-else>
            <a-button type="primary" @click="logout">登出</a-button>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0'}">
        <div class="center" :style="{ padding: '24px', background: '#fff', minHeight: '100%' }">
          <router-view/>
        </div>
      </a-layout-content>
      <a-layout-footer style="textAlign: center">CriminalQuery 逃犯在线查询系统 ©2019 | 版权所有：刘磊 @太原理工大学</a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import appConfigs from "./configs";
export default {
  data() {
    return {
      currentSel: null,
      theme: "light"
    };
  },
  methods: {
    onCollapse(collapsed, type) {
      console.log(collapsed, type);
    },
    onBreakpoint(broken) {
      console.log(broken);
    },
    handleClick(e) {
      this.currentSel = e.key;
    },
    onCollapse(collapsed, type) {
      console.log(collapsed, type);
    },
    onBreakpoint(broken) {
      console.log(broken);
    },
    login(e) {
      this.$router.push({ name: "login" });
    },
    register(e) {
      this.$router.push({ name: "register" });
    },
    logout(e) {
      console.log("logout");
      this.$store.commit("user", null);
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    current() {
      let curr = appConfigs.menuUrlMap[this.$route.path];
      return curr;
    },
    opendSub() {
      let open = "";
      if (this.current >= 1 && this.current <= 3) {
        open = "sub1";
      } else if (this.current >= 4 && this.current <= 8) {
        open = "sub2";
      } else if (this.current >= 9 && this.current <= 10) {
        open = "sub3";
      } else if (this.current >= 11 && this.current <= 12) {
        open = "sub4";
      } else if (this.current >= 14 && this.current <= 15) {
        open = "sub5";
      } else {
        open = "";
      }
      return open;
    }
  }
};
</script>

<style>
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(211, 211, 211, 0.2);
  margin: 16px;

  text-align: center;
  font-size: 20px;
  color: black;
  line-height: 32px;
}
.spacebetween-content {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  padding-left: 3%;
  padding-right: 3%;
}
.center {
  width: 100%;
  min-height: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>