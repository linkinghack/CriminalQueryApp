<template>
  <a-tree-select
    style="width: 100%"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    treeDataSimpleMode
    :treeData="treeData"
    :placeholder="placeHolder"
    @change="departmentSelected"
  ></a-tree-select>
</template>

<script>
import appConfigs from '../configs';
export default {
  props: ["value", "placeHolder"],
  data() {
    return {
      treeData: []
    };
  },
  methods: {
    departmentSelected(value, label, extra) {
      this.$emit("change", value);
      this.loadData()
    },
    loadData() {
      console.log("DeaprtmentSelector: loading data...")
      let that = this;
      // 加载省级部门数据
      that.$http.get(appConfigs.ApiBaseUrl + "/departments/tree/nodes").then(
        resp => {
          // 成功
          console.log("provinces loaded. ", resp.status);
          var data = resp.body;
          if (data.status == "200") {
            that.treeData = data.data;
          }
        },
        resp => {
          // 失败
          that.$message.error("无法加载省级部门数据");
        }
      );
    }
  },
  mounted(){
      this.loadData()
  }
};
</script>

<style scoped>
</style>


