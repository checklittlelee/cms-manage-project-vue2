<template>
  <div class="page-left">
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="(item, index) in componentlist"
        :key="index"
        :title="item.title"
        :name="index + 1"
        class="component-item"
      >
        <ul class="component-list">
          <li
            v-for="(component, size) in item.components"
            :key="size"
            :class="
              draggableEnable(component) ? 'drag-enabled' : 'drag-disabled'
            "
            :draggable="draggableEnable(component)"
            @dragstart="onDragStart(component, $event)"
            @dragend="onDragEnd($event)"
          >
            <i :class="component.iconClass" />
            <p class="name">{{ component.name }}</p>
            <!-- [component.data.component] 取到具体组件名，例如Carousel，然后在对象componentMap中获取value -->
            <p class="num">
              {{
                `${componentMap[component.data.component] || 0}/${
                  component.maxNumForAdd
                }`
              }}
            </p>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex"
import componentlist from "@/config/component-list"

export default {
  name: "PageLeft",
  data() {
    return {
      activeNames: [1, 2], // 折叠面板打开的项的名称
      componentlist, // 从外部导入的列表
    }
  },
  computed: {
    // 页面组件被使用的数量
    componentMap() {
      return this.$store.getters.pageComponentTotalMap
    },
    ...mapState(["dragComponent", "addComponentIndex"]),
  },
  methods: {
    ...mapMutations([
      "SET_DRAG_STATE",
      "SET_DRAG_COMPONENT",
      "SET_DRAG_INDEX",
      "VIEW_SET_ACTIVE",
    ]),
    ...mapActions(["pageChange"]),

    // 拖拽开始，修改vuex中组件状态，传入组件数据
    onDragStart(component, event) {
      this.SET_DRAG_STATE(true)
      // 对引用数据类型深拷贝，避免对源数据进行修改，进行深拷贝
      this.SET_DRAG_COMPONENT(JSON.parse(JSON.stringify(component)))
    },
    // 拖拽结束
    onDragEnd() {
      this.SET_DRAG_STATE(false)
      let addIndex = this.addComponentIndex
      if (addIndex != null) {
        console.log("生成组件")
        this.pageChange({
          type: "add",
          index: addIndex,
          data: this.dragComponent,
        })
        this.SET_DRAG_INDEX(null)
        console.log(addIndex, "addIndex")
        this.VIEW_SET_ACTIVE(addIndex)
      }
    },
    // 控制当前元素是否可拖拽。已使用此处和次数上限比较，小于就返回true
    draggableEnable(component) {
      let curNum = this.componentMap[component.data.component] || 0
      return curNum < component.maxNumForAdd
    },
  },
}
</script>

<style lang="less" scoped>
// 左侧框架
.page-left {
  position: absolute;
  top: 56px;
  left: 0;
  bottom: 0;
  width: 186px;
  overflow-x: hidden;
  overflow-y: auto;
  user-select: none;
  background: #fff;
}

// 组件列表
.component-item {
  padding: 0 20px;
  margin-top: 22px;
  .component-list {
    overflow: hidden;
    li {
      float: left;
      width: 50%;
      font-size: 12px;
      padding-bottom: 8px;
      text-align: center;
      &.drag-enabled {
        cursor: move;
      }
      &.drag-disabled {
        cursor: not-allowed;
      }
    }
  }
}
</style>
