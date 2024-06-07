<template>
  <div class="page-right">
    <!-- 组件编辑切换 页面设置1 || 组件管理2 -->
    <ChangeSetType v-model="setType" />
    <!-- 页面设置1 -->
    <div v-show="setType === 1">
      <SetPageInfo />
    </div>
    <!-- 组件管理2 -->
    <div v-show="setType === 2">
      <!-- 公共部分：标题、生效时间 -->
      <ComTitle
        :title="(currentComponent && currentComponent.name) || '组件管理'"
      />
      <ComValidTime
        v-if="currentComponent"
        v-model="currentComponent.data.validTime"
      />
      <!-- 动态组件：组件编辑内容，根据当前页面数据及当前选中组件索引判断显示的编辑组件。地址：components/ComponentsConfig -->
      <component
        :is="currentComponent.data.component"
        v-if="currentComponent"
        :key="currentComponent.id"
        :parmes="currentComponent.data"
        @editComponent="editComponent"
      />
      <NoSelect v-else />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import ChangeSetType from "./components/ChangeSetType" // 左侧悬浮组件
import SetPageInfo from "./components/SetPageInfo" // 页面设置1
import { dynamicComponents } from "@/utils" // 组件管理2，根据目录动态注册配置组件
import ComTitle from "@/components/BasicUi/ComTitle" // 公共组件-标题
import ComValidTime from "@/components/BasicUi/ComValidTime" // 公共组件-生效时间
import NoSelect from "./components/NoSelect" // 未选中组件

export default {
  name: "PageRight",
  // 动态注册所有可配置组件
  components: {
    ChangeSetType,
    ComTitle,
    NoSelect,
    SetPageInfo,
    ComValidTime,
    ...dynamicComponents(),
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(["pageData", "activeComponentId"]),
    // 当前设置内容 1-页面；2-组件
    setType: {
      get: function () {
        return this.$store.state.setType
      },
      set: function (val) {
        this.$store.commit("SET_SETTYPE", val)
      },
    },
    // 当前选中编辑的组件，做容错判断
    currentComponent() {
      let list = this.pageData.componentList
      return list && list.length > 0
        ? list.find((item) => item.id === this.activeComponentId)
        : null
    },
  },
  methods: {
    ...mapActions(["pageChange"]),
    // 更新组件数据
    editComponent(data) {
      this.pageChange({
        type: "edit",
        id: this.activeComponentId,
        data,
      })
    },
  },
}
</script>

<style lang="less">
@import url("~@/styles/icon.less");

.page-right {
  position: absolute;
  top: 56px;
  right: 0;
  bottom: 0;
  width: 376px;
  padding-bottom: 50px;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
}

// 组件配置模块
.com-group {
  // slide 滑块
  .el-slider {
    width: 95%;
    .el-slider__input {
      width: 60px;
    }
    .el-slider__runway {
      margin-right: 80px;
    }
  }
  // 单选框
  .el-radio {
    line-height: 30px;
    color: #323233;
  }
}

// 右上角删除样式
.up-pic-item-delete {
  position: absolute;
  cursor: pointer;
  font-size: 20px;
  right: -10px;
  top: -10px;
  color: #bbb;
  background: #fff;
  border-radius: 50%;
  visibility: hidden;
  z-index: 2;
  &:hover {
    color: #aaa;
  }
}
</style>
