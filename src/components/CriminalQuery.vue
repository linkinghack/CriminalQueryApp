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
            <!-- 组合搜索 -->
            <a-form layout="inline" :form="formFuzzy" @submit="fuzzySearch">
              <a-collapse defaultActiveKey="1" :bordered="false">
                <a-collapse-panel header="逃犯信息筛选条件" key="1">
                  <!-- 按逃犯基本信息筛选 -->
                  <a-form-item label="姓名">
                    <a-input
                      placeholder="姓名关键字"
                      v-decorator="[ 'name', {rules: [{ required: false }]} ]"
                    />
                  </a-form-item>

                  <a-form-item label="性别">
                    <a-select
                      style="width:80px; text-align:center"
                      v-decorator="[ 'sex', {rules: [{ required: false }]} ]"
                      placeholder="不限"
                      allowClear
                    >
                      <a-select-option value="1">男</a-select-option>
                      <a-select-option value="2">女</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item label="年龄范围">
                    <a-input-group compact>
                      <a-input-number
                        style="width:100px; text-align: center"
                        placeholder="起"
                        v-decorator="[ 'ageStart', {rules: [{ required: false }]} ]"
                      />
                      <a-input
                        style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                        placeholder="~"
                        disabled
                      />
                      <a-input-number
                        style="width:100px ;text-align: center; border-left: 0"
                        placeholder="止"
                        v-decorator="[ 'ageEnd', {rules: [{ required: false }]} ]"
                      />
                    </a-input-group>
                  </a-form-item>

                  <a-form-item label="身高范围">
                    <a-input-group compact>
                      <a-input-number
                        style="width:100px; text-align: center"
                        placeholder="起"
                        v-decorator="[ 'heightStart', {rules: [{ required: false }]} ]"
                      />
                      <a-input
                        style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                        placeholder="~"
                        disabled
                      />
                      <a-input-number
                        style="width:100px ;text-align: center; border-left: 0"
                        placeholder="止"
                        v-decorator="[ 'heightEnd', {rules: [{ required: false }]} ]"
                      />
                    </a-input-group>
                  </a-form-item>

                  <a-form-item label="电话">
                    <a-input
                      type="number"
                      placeholder="部分或全部号码"
                      v-decorator="[ 'phone', {rules: [{ required: false }]} ]"
                    />
                  </a-form-item>

                  <a-form-item label="教育背景">
                    <a-input
                      placeholder="关键字"
                      v-decorator="[ 'eduBackground', {rules: [{ required: false }]} ]"
                    />
                  </a-form-item>

                  <a-form-item label="工作类型">
                    <a-input
                      placeholder="关键字"
                      v-decorator="[ 'job', {rules: [{ required: false }]} ]"
                    />
                  </a-form-item>

                  <a-form-item label="相关单位">
                    <a-input
                      placeholder="(工作\学习)单位关键字"
                      v-decorator="[ 'workFor', {rules: [{ required: false }]} ]"
                    />
                  </a-form-item>

                  <a-form-item label="住址">
                    <a-input
                      placeholder="地址关键字"
                      v-decorator="[ 'address', {rules: [{ required: false }]} ]"
                    />
                  </a-form-item>

                  <a-form-item label="其他特征">
                    <a-input
                      placeholder="自然语言描述的其他特征"
                      v-decorator="[ 'otherFeatures', {rules: [{ required: false }]} ]"
                    />
                  </a-form-item>
                </a-collapse-panel>

                <!-- 按通缉令相关条件筛选 -->
                <a-collapse-panel header="通缉令筛选条件" key="2" :disabled="false">
                  <a-form-item label="通缉级别">
                    <a-select style="width:80px" placeholder="不限" v-decorator="[ 'arrestLevel' ]">
                      <a-select-option value="1">一级</a-select-option>
                      <a-select-option value="2">二级</a-select-option>
                      <a-select-option value="3">三级</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item label="通缉令状态">
                    <a-select style="width:80px" placeholder="不限" v-decorator="[ 'arrestStatus' ]">
                      <a-select-option value="1">开</a-select-option>
                      <a-select-option value="0">关</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item label="通缉区域">
                    <district-selector-vue
                      v-decorator="[ 'districtIDs', {rules: [{ required: false }]} ]"
                    />
                  </a-form-item>

                  <a-form-item label="通缉发起日期">
                    <a-range-picker v-decorator="[ 'dateRange', {rules: [{ required: false }]} ]"/>
                  </a-form-item>

                  <a-form-item label="通缉原因">
                    <a-input
                      placeholder="通缉原因"
                      v-decorator="[ 'otherFeatures', {rules: [{ required: false }]} ]"
                    />
                  </a-form-item>
                </a-collapse-panel>
              </a-collapse>

              <!-- 组合筛选器提交按钮 -->
              <a-form-item :wrapper-col="{ span: 10, offset: 4 }">
                <a-button @click="handleReset">Clear</a-button>
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 10, offset: 4 }">
                <a-button type="primary" html-type="submit">搜索</a-button>
              </a-form-item>
            </a-form>
          </p>

          <!-- 精确搜索方式 -->
          <p v-else-if="activeTabKey === 'idcard'">
            <!-- 精确搜索套件 -->
            <a-form layout="inline" :form="formPrecise" @submit="preciseSearch">
              <a-form-item label="身份证号">
                <a-input
                  placeholder="身份证号"
                  v-decorator="[ 'idCardID', {rules: [{ required: false }]} ]"
                />
              </a-form-item>

              <a-form-item :wrapper-col="{ span: 10, offset: 4 }">
                <a-button type="primary" html-type="submit">搜索</a-button>
              </a-form-item>
            </a-form>
          </p>
        </a-card>
      </a-col>
    </a-row>

    <!-- 搜索结果 -->
    <a-row>
      <a-col :span="24">
        <a-table
          :columns="columns"
          :rowKey="record => record.id"
          :dataSource="criminalSearchResult"
          :pagination="pagination"
          :loading="loading"
          @change="onTableChange"
        >
          <span slot="portrait" slot-scope="text, record">
            <a-avatar :size="64" icon="user" :src="text"/>
          </span>
          <span slot="action" slot-scope="text, record">
            <a @click="showCriminalDetail(record.id)">查看详情</a>
          </span>
          <span slot="createdAt" slot-scope="text, record">{{text | date}}</span>
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import DistrictSelectorVue from "./DistrictSelector.vue";
import Axios from "axios";
import appConfigs from "../configs";

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
  beforeCreate() {
    this.formFuzzy = this.$form.createForm(this);
    this.formPrecise = this.$form.createForm(this);
  },
  components: {
    DistrictSelectorVue
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
  mounted() {
    this.fetchCriminals(this, {});
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
    handleReset() {
      this.formFuzzy.resetFields();
      this.formPrecise.resetFields();
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
    fuzzySearch(e) {
      e.preventDefault();
      let that = this;
      this.formFuzzy.validateFields((err, values) => {
        console.log(values);
        if (!err) {
          that.$store.commit('searchParams', values) // 保存本次搜索条件
          that.fetchCriminals(that, values);
        }
      });
    },
    preciseSearch(e) {
      e.preventDefault();
      let that = this;
      this.formPrecise.validateFidles((err, values) => {
        console.log("精确搜索");
        console.log(values);
        if (!err) {
          Axios.get(
            appConfigs.ApiBaseUrl +
              "/criminal/criminalByIDCard/" +
              values.idCardID,
            {
              headers: { Token: localStorage.getItem("token") }
            }
          )
            .then(resp => {
              if (resp.status == 200 && resp.data.status == 200) {
                let result = resp.data.data;
                that.$store.commit("criminalSearchResult", result);
              } else {
                console.log("精确搜索失败");
                console.log(resp);
                that.$message.warning("搜索失败");
              }
            })
            .catch(err => {
              console.log("精确搜索出错");
              console.log(err);
              that.$message.error("系统错误");
            });
        }
      });
    },
    fetchCriminals(that, conditions) {
      that.loading = true;
      const pagination = {
        pageSize: 10
      };
      if (conditions.dateRange) {
        if (conditions.dateRange.length > 0) {
          conditions.arrestCreateTimeStart = conditions.dateRange[0];
        }
        if (conditons.dateRange.length > 1) {
          conditions.arrestCreateTimeEnd = conditions.dateRange[1];
        }
      }
      Axios.get(appConfigs.ApiBaseUrl + "/criminal/criminals", {
        headers: { Token: localStorage.getItem("token") },
        params: conditions
      })
        .then(resp => {
          if (resp.status == 200 && resp.data.status == 200) {
            let result = resp.data.data;
            console.log(result);
            that.$store.commit("criminalSearchResult", result.criminals);
            pagination.current = result.currentPage + 1;
            pagination.total = result.totalCount;
            that.pagination = pagination;
          } else {
            that.$message.warning(resp.data.data);
          }
          that.loading = false;
        })
        .catch(error => {
          that.loading = false;
          that.$message.error(error);
        });
    },
    onTableChange(pagination, filters, sorter) {
      console.log(pagination);
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

