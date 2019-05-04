<template>
  <div class="page">
    <div v-if="currentUser.role == 1">
      <!-- 搜索框 -->
      <a-row>
        <a-col :span="12">
          <a-input-search
            placeholder="搜索姓名或登录id"
            @search="onSearch"
            :value="searchKey"
            enterButton
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-table style="margin-top:5px"
            :columns="columns"
            :rowKey="record => record.id"
            :dataSource="activatedUserList"
            :pagination="pagination"
            :loading="loading"
            @change="onTableChange"
          >
          <span slot="role" slot-scope="text">{{roleName(text)}}</span>
            <span slot="action" slot-scope="text, record">
              <a-popconfirm slot="actions" title="确认删除？" @confirm="deleteUser(record.id)">
                <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                <a href="#">删除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </a-col>
      </a-row>
    </div>
    <div v-else>
      <a-row>您不是管理员，无权访问此页面</a-row>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import appConfigs from "../configs";
const columns = [
  {
    title: "用户登录ID",
    dataIndex: "userID"
  },
  {
    title: "用户姓名",
    dataIndex: "realName"
  },
  {
    title: "电话",
    dataIndex: "phone"
  },
  {
    title: "邮箱",
    dataIndex: "email"
  },
  {
    title: "角色",
    dataIndex: "role",
    scopedSlots: { customRender: "role"}
  },
  {
    title: "所属部门",
    dataIndex: "department.departmentName"
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
      loading: false,
      searchKey: null,
      pagination: {
        pageSize: 10
      }
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters.user;
    },
    activatedUserList() {
      return this.$store.getters.activatedUserList;
    }
  },
  mounted() {
    this.getUserList("");
  },
  methods: {
    roleName(role) {
      if (role == 1) {
        return "管理员";
      } else {
        return "普通用户";
      }
    },
    onSearch() {
      let tempKey = "";
      if (this.searchKey) {
        tempKey = this.searchKey;
      }
      this.getUserList(tempKey, 10, 1);
    },
    deleteUser(uid) {
      let that = this;
      Axios.delete(appConfigs.ApiBaseUrl + "/user/" + uid, {
        headers: { Token: localStorage.getItem("token") }
      })
        .then(resp => {
          if (resp.status == 200 && resp.data.status == 200) {
            that.$message.success("已删除");
            that.getUserList(null, 10, 1); // 刷新列表
          } else {
            that.$message.warning(resp.data.data);
          }
        })
        .catch(err => {
          console.log("删除用户异常");
          console.log(err);
          that.$eerror(err);
        });
    },
    onTableChange(pagination, filters, sorter) {
      console.log(pagination);
      // 读取最近一次搜索条件并按照指定分页搜索
      this.getUserList(this.searchKey, pagination.pageSize, pagination.page);
    },
    getUserList(condition, pageSize, page) {
      let that = this;
      that.loading = true;
      Axios.get(appConfigs.ApiBaseUrl + "/user/activated", {
        params: { nameOrID: condition, pageSize: pageSize, page: page },
        headers: { Token: localStorage.getItem("token") }
      })
        .then(resp => {
          that.loading = false;
          if (resp.status == 200 && resp.data.status == 200) {
            that.$store.commit("activatedUserList", resp.data.data.users);
            that.pagination.pageSize = resp.data.data.pageSize;
            that.pagination.page = resp.data.data.page;
          } else {
            that.$message.warning(resp.data.data);
          }
        })
        .catch(err => {
          that.loading = false;
          console.log("获取激活用户列表失败");
          console.log(err);
          that.$message.error("获取用户列表错误");
          that.$message.error(err);
        });
    }
  }
};
</script>

<style scoped>
.page {
  width: 100%;
}
</style>


