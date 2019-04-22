<template>
  <a-cascader :options="options" @change="onSelectChange" :loadData="loadDistricts" changeOnSelect></a-cascader>
</template>

<script>
import appConfigs from "../configs";

export default {
  props: ["value"],
  data() {
    return {
      options: [
        {
          value: "100000",
          label: "全国",
          isLeaf: false
        }
      ]
    };
  },
  methods: {
    onSelectChange(value) {
      // 修改搜索范围，重新加载页面部门列表
      let that = this;
      let ids = String(value).split(",");
      let id = ids[ids.length - 1];
      this.$emit("districtSelected", id);
      this.$emit("change", value[value.length - 1]);
    },
    loadDistricts(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      //   targetOption.loading = true;
      let that = this;
      this.$http
        .get(
          appConfigs.ApiBaseUrl +
            "/districts/subDistricts/" +
            targetOption.value
        )
        .then(
          resp => {
            // success
            if (resp.status == 200 && resp.body.status == 200) {
              targetOption.children = resp.body.data;
              targetOption.children.map((district, idx, arr) => {
                district.value = String(district.id);
                district.label = district.name;
                if (district.level < 3) {
                  district.isLeaf = false;
                } else {
                  district.isLeaf = true;
                }
              });
            } else {
              that.$message.warning("加载子区域失败");
            }
            targetOption.loading = false;
          },
          resp => {
            that.$message.warning("加载子区域错误");
            targetOption.loading = false;
          }
        );
    }
  }
};
</script>

