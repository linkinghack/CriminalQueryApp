<template>
  <div class="page">
    <criminal-detail />
  </div>
</template>

<script>
import CriminalDetail from './CriminalDetail.vue'
export default {
  components: {
    CriminalDetail,
  },
  methods: {
    selected(id) {
      this.$message.info('selected: ' + id + " " + typeof(id))
    }
  }
}
</script>


<style scoped>
.page {
  width: 100%;
}
.extender {
  height: 700px;
}
</style>
