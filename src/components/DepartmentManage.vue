<template>
  <div class="page">
    <!-- 搜索过滤栏 -->
    <div class="toolBar">
      <district-selector-vue @districtSelected="onSelectChange"/>

      <a-button type="primary" @click="showDrawer">
        <a-icon type="plus"/>新部门
      </a-button>
      <a-drawer
        title="新建公安部门"
        :width="720"
        @close="closeDrawer"
        :visible="drawerVisible"
        :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
      >
        <a-form :form="form" layout="vertical" @submit="submitCreateDepartment">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="部门名称">
                <a-input
                  v-decorator="['departmentName', {
                  rules: [{ required: true, message: '名称是必填项' }]
                }]"
                  placeholder="请输入部门名称"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12"></a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="管辖区域">
                <district-selector-vue
                  v-decorator=" ['districtID', {
                  rules: [{ required: true, message: '管辖区域是必填项' }]
                }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12"></a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="上级部门">
                <department-selector-vue
                  v-decorator=" ['supervisorID', {
                  rules: [{ required: true, message: '上级部门必选' }]
                }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12"></a-col>
          </a-row>

          <div
            :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
          >
            <a-button :style="{marginRight: '8px'}" @click="closeDrawer">Cancel</a-button>
            <a-button type="primary" html-type="submit">Submit</a-button>
          </div>
        </a-form>
      </a-drawer>
    </div>

    <!-- 部门列表 -->
    <a-list
      class="demo-loadmore-list"
      :loading="loading"
      itemLayout="horizontal"
      :dataSource="data"
      :pagination="pagination"
      size="small"
    >
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a slot="actions" @click="deleteDepartment(item.id)">删除</a>
        <a-list-item-meta :title="item.departmentName">
          <div slot="description">管辖区域： {{item.districtName}}</div>
        </a-list-item-meta>
        <div>成员数量：{{item.membersCount}}</div>
      </a-list-item>
    </a-list>
  </div>
</template>
<script>
import appConfigs from "../configs";
import DistrictSelectorVue from "./DistrictSelector.vue";
import DepartmentSelectorVue from "./DepartmentSelector.vue";
export default {
  components: {
    DistrictSelectorVue,
    DepartmentSelectorVue
  },
  data() {
    return {
      form: this.$form.createForm(this),
      drawerVisible: false,
      data: [
        {
          id: 1,
          departmentName: "公安部",
          supervisorID: 0,
          level: 0,
          districtID: 100000,
          districtName: "中国",
          membersCount: null
        }
      ],
      loading: true,
      pagination: {
        onChange: page => {
          console.log(page);
        },
        pageSize: 7
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    showDrawer() {
      this.drawerVisible = true;
    },
    closeDrawer() {
      this.drawerVisible = false;
    },
    // 删除部门
    deleteDepartment(e) {
      let that = this;

      this.$http
        .get(appConfigs.ApiBaseUrl + "/departments/department/" + String(e), {
          method: "DELETE"
        })
        .then(
          resp => {
            if (resp.status == 200 && resp.body.status == 200) {
              that.$message.success(resp.body.data);
            } else {
              that.$message.warning(resp.body.data);
            }
            that.getData();
          },
          resp => {
            that.$message.error("删除失败");
          }
        );
    },
    // 新建部门
    submitCreateDepartment(e) {
      e.preventDefault();
      let that = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          // 校验无错发起请求
          console.log("CreateDepartment: ", values);
          that.$http
            .post(appConfigs.ApiBaseUrl + "/departments/department", values)
            .then(
              resp => {
                if (resp.status == 200 && resp.body.status == 200) {
                  that.$message.success(
                    "创建成功",
                    resp.body.data.departmentName
                  );
                  that.getData();
                } else {
                  that.$message.warning(resp.body.msg);
                }
              },
              resp => {
                // failed
                that.$message.error("创建失败");
              }
            );
        }
      });
    },

    // 显示部门列表
    getData() {
      let that = this;
      this.$http.get(appConfigs.ApiBaseUrl + "/departments/all").then(
        resp => {
          if (resp.status == 200 && resp.body.status == 200) {
            that.data = resp.body.data;
            that.loadMembersCounts();
          }
          that.loading = false;
        },
        resp => {
          //fail
          that.$message.warning("无法获取部门列表");
          that.loading = false;
        }
      );
    },
    loadMembersCounts() {
      let that = this;
      that.data.map((department, idx, rawArr) => {
        that.$http
          .get(
            appConfigs.ApiBaseUrl + "/departments/membersCount/" + department.id
          )
          .then(
            resp => {
              if (resp.status == 200 && resp.body.status == 200) {
                department.membersCount = resp.body.data;
              } else {
                that.$message.info(resp.body.msg);
              }
            },
            resp => {
              that.$message.warning("无法获取部门成员数量");
            }
          );
      });
    },
    onSelectChange(id) {
      // 修改搜索范围，重新加载页面部门列表
      let that = this;
      that.$http
        .get(appConfigs.ApiBaseUrl + "/departments/ofDistrict/" + id)
        .then(
          resp => {
            if (resp.status == 200 && resp.body.status == 200) {
              that.data = resp.body.data;
              that.loadMembersCounts();
            } else {
              that.$message.info(resp.body.msg);
            }
          },
          resp => {
            that.$message.warning("加载失败");
          }
        );
    }
  }
};
</script>
<style scoped>
.page {
  width: 100%;
}
.demo-loadmore-list {
  width: 100%;
  min-height: 350px;
}
.toolBar {
  margin-bottom: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}
.toolBar > * {
  margin-left: 10px;
}
</style>
