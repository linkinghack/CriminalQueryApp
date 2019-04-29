<template>
  <div class="page">
    <div>
      <a-steps :current="current">
        <a-step v-for="item in steps" :key="item.title" :title="item.title"/>
      </a-steps>

      <div class="steps-content" v-if="current == 0"> 
        <!-- 添加逃犯信息 -->
        <create-criminal-info-form @success="stepSuccess"/>
      </div>

      <div class="steps-content" v-if="current == 1">
        <!-- 上传通缉令信息 -->
        <create-wanted-order-form @success="stepSuccess"/>
      </div>

      <div class="steps-content" v-if="current == 2">
        <!-- 通缉结果查看 -->
        <criminal-detail />
      </div>

      <div class="steps-action">
        <!-- <a-button v-if="current < steps.length - 1" :disabled="!ableNext" type="primary" @click="next">下一步</a-button> -->
        <a-button
          v-if="current == steps.length - 1"
          type="primary"
          @click="completeWantedOrder()"
        >完成</a-button>
        <!-- <a-button v-if="current>0" style="margin-left: 8px" @click="prev">上一步</a-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import CreateCriminalInfoForm from './CreateCriminalInfoForm.vue'
import CreateWantedOrderForm from './CreateWantedOrderForm.vue'
import CriminalDetail from './CriminalDetail.vue'
export default {
  components: {
    CreateCriminalInfoForm,
    CreateWantedOrderForm,
    CriminalDetail,
  },
  data() {
    return {
      ableNext: false, // 是否可以进入下一步
      current: 0,
      steps: [
        {
          title: "添加逃犯信息",
          content: "First-content"
        },
        {
          title: "发布通缉令",
          content: "Second-content"
        },
        {
          title: "完成通缉发布",
          content: "Last-content"
        }
      ],
    };
  },
  methods: {
    next() {
      this.current++;
      this.ableNext = false;
    },
    prev() {
      this.current--;
    },
    stepSuccess() {
      this.ableNext = true;
      this.next();
    },
    completeWantedOrder(){
      this.$message.success('已完成通缉');
      this.$router.push({name:'home'})
    }
  }
};
</script>

<style scoped>
/* page */
.page {
  width: 100%;
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}

.steps-action {
  margin-top: 24px;
}
</style>


