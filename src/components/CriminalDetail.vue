<template>
  <div style="width:100%" v-if="criminalDetail">
    <!-- 逃犯基本信息 -->
    <a-row type="flex" justify="start">
      <a-col :span="6">
        <!-- 逃犯主照片 -->
        <a-card hoverable style="width: 90%">
          <img
            alt="example"
            :src="criminalDetail.criminalBasicInfo.portraitFileURL || 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' "
            slot="cover"
          >
          <a-card-meta :title="criminalDetail.criminalBasicInfo.name || '逃犯姓名'"/>
        </a-card>
      </a-col>

      <a-col :span="8">
        <!-- 逃犯基本信息 1-->
        <a-row class="attributeRow">
          <a-col class="attributeName" :span="attributeNameSpan">姓名:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{criminalDetail.criminalBasicInfo.name}}</a-col>
        </a-row>
        <a-row class="attributeRow">
          <a-col class="attributeName" :span="attributeNameSpan">性别:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{sexSwitch(criminalDetail.criminalBasicInfo.sex)}}</a-col>
        </a-row>
        <a-row class="attributeRow">
          <a-col class="attributeName" :span="attributeNameSpan">年龄:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{criminalDetail.criminalBasicInfo.age || '未知'}}</a-col>
        </a-row>
        <a-row class="attributeRow">
          <a-col class="attributeName" :span="attributeNameSpan">生日:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{criminalDetail.criminalBasicInfo.birthday || "未知"}}</a-col>
        </a-row>
        <a-row class="attributeRow">
          <a-col class="attributeName" :span="attributeNameSpan">身高:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{criminalDetail.criminalBasicInfo.height || "未知"}}</a-col>
        </a-row>
        <a-row class="attributeRow">
          <a-col class="attributeName" :span="attributeNameSpan">其他特征:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{criminalDetail.criminalBasicInfo.otherFeatures || "未添加"}}</a-col>
        </a-row>
      </a-col>

      <a-col :span="8">
        <!-- 逃犯基本信息 2-->
        <a-row class="attributeRow" type="flex" align="middle">
          <a-col class="attributeName" :span="attributeNameSpan">身份证号:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{criminalDetail.criminalBasicInfo.idCardID || "未知"}}</a-col>
        </a-row>
        <a-row class="attributeRow">
          <a-col class="attributeName" :span="attributeNameSpan">电话:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{criminalDetail.criminalBasicInfo.phone || "未知"}}</a-col>
        </a-row>
        <a-row class="attributeRow">
          <a-col class="attributeName" :span="attributeNameSpan">工作:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{criminalDetail.criminalBasicInfo.job || "未知"}}</a-col>
        </a-row>
        <a-row class="attributeRow">
          <a-col class="attributeName" :span="attributeNameSpan">单位:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{criminalDetail.criminalBasicInfo.workFor || '未知'}}</a-col>
        </a-row>

        <a-row class="attributeRow">
          <a-col class="attributeName" :span="attributeNameSpan">教育背景:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{criminalDetail.criminalBasicInfo.eduBackground || "未知"}}</a-col>
        </a-row>
        <a-row class="attributeRow">
          <a-col class="attributeName" :span="attributeNameSpan">创建时间:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{localDate(criminalDetail.criminalBasicInfo.createdAt)}}</a-col>
        </a-row>
        <a-row class="attributeRow">
          <a-col class="attributeName" :span="attributeNameSpan">更新时间:</a-col>
          <a-col
            class="attributeValue"
            :span="attributeValueSpan"
          >{{localDate(criminalDetail.criminalBasicInfo.updatedAt) }}</a-col>
        </a-row>
        <a-row type="flex" justify="start">
          <a-col :span="8">
            <a-button type="primary" @click="showbasicInfoEditor">编辑</a-button>
            <a-drawer
              :width="380"
              title="编辑逃犯基本信息"
              placement="right"
              :closable="false"
              @close="basicInfoEditorClose"
              :visible="basicInfoEditorVisible"
            >
              <basic-info-editor/>
            </a-drawer>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <a-divider>逃犯相关联系人信息</a-divider>
    <!-- 逃犯相关联系人 -->
    <a-row
      class="info-section"
      v-if="!(criminalDetail.criminalContacts && criminalDetail.criminalContacts.length > 0)"
    >
      <div>暂无数据</div>
    </a-row>
    <a-row v-else></a-row>

    <a-divider>逃犯通缉令信息</a-divider>
    <!-- 逃犯通缉令 -->
    <a-row
      class="info-section"
      v-if="!(criminalDetail.wantedOrders && criminalDetail.wantedOrders.length > 0)"
    >
      <div>暂无数据</div>
    </a-row>
    <a-row v-else class="info-section">
      <a-table :columns="wantedOrderColumns" :dataSource="criminalDetail.wantedOrders" rowKey="id">
        <span slot="arrestStatus" slot-scope="arrestStatus, order">
          <a-switch
            :checked="order.arrestStatus == 1"
            checkedChildren="开"
            unCheckedChildren="关"
            @change="switchArrestStatus(order)"
          />
        </span>
        <span slot="arrestLevel" slot-scope="arrestLevel">{{levelSwitch(arrestLevel)}}</span>
        <span slot="action" slot-scope="text, record">
          <!-- <a-divider type="vertical"/>
          <a href="javascript:;">编辑</a>
          <a-divider type="vertical"/>-->
          <a-popconfirm slot="actions" title="确认删除？" @confirm="deleteWantedOrder(record)">
            <a-icon slot="icon" type="question-circle-o" style="color: red"/>
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <template v-for="order of criminalDetail.wantedOrders">
        <a-row :key="order.id"></a-row>
      </template>
    </a-row>
    <a-row type="flex" justify="end">
      <a-col :span="4">
        <!--  追加通缉按钮 -->
        <a-button type="primary" @click="showOrderAppender" class="attributeRow">追加通缉</a-button>
        <a-drawer
          :width="550"
          title="追加通缉令"
          placement="right"
          :closable="false"
          @close="orderAppenderClose"
          :visible="orderAppenderVisible"
        >
          <create-wanted-order-form @success="updateDetail"/>
        </a-drawer>
      </a-col>
    </a-row>

    <a-divider>逃犯线索</a-divider>
    <!-- 逃犯线索 -->
    <a-row v-if="!(criminalDetail.clues && criminalDetail.clues.length > 0)">
      <div>暂无数据</div>
    </a-row>
    <a-row v-else></a-row>
    <a-row type="flex" justify="end">
      <a-col :span="4">
        <a-button type="primary" @click="showNewCluePage">添加线索</a-button>
        <a-drawer
          :width="550"
          title="添加逃犯线索信息"
          placement="right"
          :closable="false"
          @close="newCluePageClose"
          :visible="newCluePageVisible"
        >
          <new-clue @success="updateDetail"/>
        </a-drawer>
      </a-col>
    </a-row>
  </div>
</template>


<script>
import appConfigs from "../configs";
import BasicInfoEditor from "./BasicInfoEditor.vue";
import CreateWantedOrderForm from "./CreateWantedOrderForm.vue";
import NewClue from "./NewClue.vue";
import Axios from "axios";

const wantedOrderColumns = [
  {
    dataIndex: "arrestReason",
    key: "arrestReason",
    title: "通缉原因"
  },
  {
    title: "通缉级别",
    dataIndex: "arrestLevel",
    key: "arrestLevel",
    scopedSlots: { customRender: "arrestLevel" }
  },
  {
    title: "通缉范围",
    dataIndex: "district.name"
  },
  {
    title: "通缉状态",
    dataIndex: "arrestStatus",
    key: "arrestStatus",
    scopedSlots: { customRender: "arrestStatus" }
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  components: {
    BasicInfoEditor,
    CreateWantedOrderForm,
    NewClue
  },
  data() {
    return {
      wantedOrderColumns,
      basicInfoEditorVisible: false,
      orderAppenderVisible: false,
      newCluePageVisible: false,
      attributeNameSpan: 7,
      attributeValueSpan: 16,
    };
  },
  computed: {
    criminalDetail() {
      return this.$store.getters.currentCriminalDetail;
    }
  },
  methods: {
    sexSwitch(sex) {
      return appConfigs.sexMap[sex];
    },
    levelSwitch(level) {
      return appConfigs.wantedOrderLevelMap[level];
    },
    localDate(date) {
      let d = new Date(date);
      return d.toLocaleString();
    },
    basicInfoEditorClose() {
      this.basicInfoEditorVisible = false;
    },
    showbasicInfoEditor() {
      this.basicInfoEditorVisible = true;
    },
    orderAppenderClose() {
      this.orderAppenderVisible = false;
    },
    showOrderAppender() {
      let that = this;
      this.$store.commit(
        "newCriminalInfo",
        that.criminalDetail.criminalBasicInfo
      ); // 确保添加通缉令组件正常工作
      this.orderAppenderVisible = true;
    },
    newCluePageClose() {
      this.newCluePageVisible = false;
    },
    showNewCluePage() {
        this.$store.commit('currentCriminalDetail', this.criminalDetail)
      this.newCluePageVisible = true;
    },
    updateDetail() {
      // 监听编辑结果，重新加载数据
      let that = this;
      this.updateCriminalDetail(that.criminalDetail.criminalBasicInfo.id);
    },
    switchArrestStatus(order) {
      let that = this;
      let tempOrder = {
        id: order.id,
        arrestStatus: order.arrestStatus == 0 ? 1 : 0
      };
      let statusBackup = order.arrestStatus; // backup
      order.arrestStatus = order.arrestStatus == 0 ? 1 : 0; // 状态反转
      console.log();
      Axios.put(appConfigs.ApiBaseUrl + "/wanted/order", tempOrder, {
        headers: { Token: localStorage.getItem("token") }
      })
        .then(resp => {
          if (resp.status == 200 && resp.data.status == 200) {
            that.$message.success("通缉令状态切换成功");
          } else {
            order.arrestStatus = statusBackup;
          }
        })
        .catch(error => {
          that.$message.error(error);
          order.arrestStatus = statusBackup;
        });
    },
    deleteWantedOrder(order) {
      this.$message.warning("删除order" + order.id);
      let that = this;
      Axios.delete(appConfigs.ApiBaseUrl + "/wanted/order/" + order.id)
        .then(resp => {
          if (resp.status == 200 && resp.data.status == 200) {
            that.$message.success("删除成功");
            // 更新currentCriminalDetail
            updateCriminalDetail(that.criminalDetail.criminalBasicInfo.id);
          }
        })
        .catch(error => {});
    },
    updateCriminalDetail(criminalID) {
      axios
        .get(appConfigs.ApiBaseUrl + "/criminal/detailByID/" + criminalID, {
          headers: { Token: localStorage.getItem("token") }
        })
        .then(resp => {
          if (resp.status == 200 && resp.data.status == 200) {
            that.$store.commit("currentCriminalDetail", resp.data.data);
          } else {
            that.$message.error("系统错误:" + String(resp.data));
          }
        })
        .catch(error => {
          that.$message.error("无法连接服务器");
        });
    }
  }
};
</script>

<style scoped>
.attributeName {
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
}
.attributeValue {
  font-size: 16px;
}
.attributeRow {
  margin-bottom: 3px;
}

.info-section {
  min-height: 30px;
}
</style>


