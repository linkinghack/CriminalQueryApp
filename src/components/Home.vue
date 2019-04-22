<template>
  <div>
    逃犯查询
    <a-icon type="play-circle"/>
    <district-selector-vue @districtSelected='selected'/>
    <department-selector-vue placeHolder='选择上级部门' />
  </div>
</template>

<script>
import DistrictSelectorVue from './DistrictSelector.vue';
import DepartmentSelectorVue from './DepartmentSelector.vue';

export default {
  components: {
    DistrictSelectorVue,
    DepartmentSelectorVue
  },
  methods: {
    selected(id) {
      this.$message.info('selected: ' + id + " " + typeof(id))
    }
  }
}
</script>


<style scoped>
.extender {
  height: 700px;
}
</style>
