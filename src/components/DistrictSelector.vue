<template>
  <a-cascader :options="options" @change="onSelectChange" :loadData="loadDistricts" changeOnSelect></a-cascader>
</template>

<script>
import appConfigs from "../configs";
import Axios from "axios";
import { constants } from 'crypto';

export default {
  props: ["value", "rootID"],
  created() {
    let that = this;
    if (this.rootID != null) {
      Axios.get(appConfigs.ApiBaseUrl + "/districts/" + that.rootID, {
        headers: { Token: localStorage.getItem("token") }
      })
        .then(response => {
          if (response.status == 200 && response.data.status == 200) {
            let district = response.data.data;
            district.value = String(district.id);
            district.label = district.name;
            if (district.level >= 3) {
              district.isLeaf = true;
            } else {
              district.isLeaf = false;
            }
            // 初始化进options
            that.options = [district];
            console.log("districts options initiated.");
            console.log(that.options);
          }
        })
        .catch(error => {});
    }
  },
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
      Axios.get(
        appConfigs.ApiBaseUrl + "/districts/subDistricts/" + targetOption.value,
        {
          headers: {
            Token: localStorage.getItem("token")
          }
        }
      ).then(
        resp => {
          // success
          if (resp.status == 200 && resp.data.status == 200) {
            targetOption.children = resp.data.data;
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
        }
      ).catch(err => {
        console.log('加载子区域错误')
        console.log(err)
          that.$message.warning("加载子区域错误");
          targetOption.loading = false;
        });
    }
  }
};
</script>

