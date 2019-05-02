<template>
  <div>
    <a-row>
      <a-col :span="24">
        <!-- 精确搜索套件 -->
        <a-form layout="inline" :form="form" @submit="preciseSearch">
          <a-form-item label="身份证号">
            <a-input
              placeholder="身份证号"
              v-decorator="[ 'idCardID', {rules: [{ required: true }]} ]"
            />
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 10, offset: 4 }">
            <a-button type="primary" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>

    <!-- 搜索结果 -->
    <a-row>
      <a-col :span="24">
        <a-table
          :columns="columns"
          :rowKey="record => record.id"
          :dataSource="criminalSearchResult"
          :loading="loading"
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
import Axios from "axios";
import appConfigs from "../configs";

const columns = [
  {
    title: "照片",
    dataIndex: "portraitFileURL",
    scopedSlots: { customRender: "portrait" },
    width: "8%"
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
    title: "身份证号",
    dataIndex: "idCardID"
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
  data() {
    return {
      columns,
      loading: false
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  computed: {
    criminalSearchResult() {
      return this.$store.getters.preciseSearchResult;
    }
  },
  methods: {
    showCriminalDetail(criminalID) {
      // 获取单个逃犯详情信息并跳转至详情页面
      let that = this;
      console.log("show criminal detail: " + criminalID);
      Axios.get(appConfigs.ApiBaseUrl + "/criminal/detailByID/" + criminalID, {
        headers: { Token: localStorage.getItem("token") }
      }).then(resp => {
        if (resp.status == 200 && resp.data.status == 200) {
          that.$store.commit("currentCriminalDetail", resp.data.data);
          that.$router.push({ name: "criminalDetail" });
        }
      });
    },
    preciseSearch(e) {
      e.preventDefault();
      let that = this;
      that.form.validateFields((err, values) => {
        console.log("精确搜索");
        console.log(values);
        if (!err) {
          that.loading = true;
          Axios.get(
            appConfigs.ApiBaseUrl +
              "/criminal/criminalByIDCard/" +
              values.idCardID,
            {
              headers: { Token: localStorage.getItem("token") }
            }
          )
            .then(resp => {
              that.loading = false;
              if (resp.status == 200 && resp.data.status == 200) {
                let result = resp.data.data;
                that.$store.commit("preciseSearchResult", result);
                that.loadPortraitsOfResult();
              } else {
                console.log("精确搜索失败");
                console.log(resp);
                that.$message.warning("搜索失败");
              }
            })
            .catch(err => {
              that.loading = false;
              console.log("精确搜索出错");
              console.log(err);
              that.$message.error("系统错误");
            });
        }
      });
    },
    loadPortraitsOfResult() {
      let that = this;
      if (this.criminalSearchResult && this.criminalSearchResult.length > 0) {
        that.criminalSearchResult.map((record, idx, arr) => {
          Axios.get(
            appConfigs.ApiBaseUrl + "/oss/file/url/" + record.portraitFileID,
            {
              headers: { Token: localStorage.getItem("token") }
            }
          )
            .then(resp => {
              if (resp.status == 200) {
                record.portraitFileURl = resp.data;
              } else {
                that.$message.warning("无法获取逃犯照片url");
                console.error(
                  "无法获取逃犯照片url, crminal: " + JSON.stringify(record)
                );
              }
            })
            .catch(err => {
              that.$message.error("请求逃犯照片临时url出错");
              console.error(
                "请求逃犯照片临时url出错 criminal: " + JSON.stringify(record)
              );
            });
        });
      }
    }
  }
};
</script>

<style scoped>
</style>

