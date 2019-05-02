<template>
  <div class="page">
    <!-- 筛选器 -->
    <a-row>
      <a-col :span="24">
        <a-card
          style="width:100%"
          :tabList="tabList"
          :activeTabKey="activeTabKey"
          @tabChange="key => onTabChange(key)"
        >
          <p v-if="activeTabKey === 'fuzzy'">
            <fuzzy-search-vue />
          </p>

          <!-- 精确搜索方式 -->
          <p v-else-if="activeTabKey === 'idcard'">
            <precise-search-vue />
          </p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Axios from "axios";
import appConfigs from "../configs";
import FuzzySearchVue from './FuzzySearch.vue'
import PreciseSearchVue from './PreciseSearch.vue'
const columns = [
  {
    title: "照片",
    dataIndex: "portraitFileURL",
    scopedSlots: { customRender: "portrait" },
    width: "10%"
  },
  {
    title: "姓名",
    dataIndex: "name",
    width: "10%"
  },
  {
    title: "性别",
    dataIndex: "sex",
    width: "10%"
  },
  {
    title: "年龄",
    dataIndex: "age",
    width: "10%"
  },
  {
    title: "工作",
    dataIndex: "job",
    width: "10%"
  },
  {
    title: "单位",
    dataIndex: "workFor",
    width: "10%"
  },
  {
    title: "录入时间",
    dataIndex: "createdAt",
    scopedSlots: { customRender: "createdAt" }
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  components: {
    FuzzySearchVue,
    PreciseSearchVue
  },
  data() {
    return {
      columns,
      loading: true,
      tabList: [
        { key: "fuzzy", tab: "组合搜索" },
        { key: "idcard", tab: "身份证精确搜索" }
      ],
      activeTabKey: "fuzzy",
      pagination: {
        pageSize: 10
      }
    };
  },
  computed: {
    criminalSearchResult() {
      return this.$store.getters.criminalSearchResult;
    }
  },
  methods: {
    onTabChange(key) {
      console.log(key);
      this.activeTabKey = key;
    },
    rangeChange(v) {
      console.log(v);
    },
    showCriminalDetail(criminalID) {
      // 获取单个逃犯详情信息并跳转至详情页面
      let that = this;
      console.log("show criminal detail: " + criminalID);
      Axios.get(appConfigs.ApiBaseUrl + '/criminal/detailByID/'+criminalID, {
          headers: {Token: localStorage.getItem('token')}
      }).then(resp => {
          if(resp.status == 200 && resp.data.status == 200) {
              that.$store.commit('currentCriminalDetail', resp.data.data)
              that.$router.push({name:'criminalDetail'})
          }
      })
    },
    onTableChange(pagination, filters, sorter) {
      console.log(pagination);
      // 读取最近一次搜索条件并按照指定分页搜索
      let conditions = this.$store.getters.searchParams
      conditions.pageSize = pagination.pageSize;
      conditions.page = pagination.current;
      this.$store.commit('searchParams', conditions)
      console.log(conditions);
      this.fetchCriminals(this, conditions);
    }
  }
};
</script>

<style scoped>
.page {
  width: 100%;
}
</style>

