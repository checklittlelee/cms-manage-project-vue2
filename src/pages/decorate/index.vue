<template>
  <div class="home">
    <!-- 顶部 head -->
    <PageHead />
    <!-- 左侧 组件列表 -->
    <PageLeft />
    <!-- 中间 内容区域 -->
    <PageView />
    <!-- 右侧 组件编辑区域 -->
    <PageRight />
  </div>
</template>

<script>
import PageHead from "./components/PageHead.vue"
import PageLeft from "./components/PageLeft.vue"
import PageView from "./components/PageView.vue"
import PageRight from "./components/PageRight.vue"
import { getCmsPageById } from "@/api/activity"
import { createRandomId } from "@/utils/index.js"

export default {
  name: "App",
  components: {
    PageHead,
    PageLeft,
    PageView,
    PageRight,
  },
  data() {
    return {}
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getData()
    },
    // 获取详情的数据
    getData() {
      const { id } = this.$route.query.id
      if (id) {
        getCmsPageById(id).then((data) => {
          this.postDataToH5(data)
        })
      }
    },
  },
  // 处理后端返回的页面数据
  postDataToH5(data) {
    // 做容错的判断，避免语法报错导致白屏或者其他问题
    if (data && data.componentList) {
      data.componentList.forEach((item) => {
        if (item.data.validTime && typeof item.data.validTime === "string") {
          // 将字符串转成JS对象
          item.data.validTime = JSON.parse(item.data.validTime)
        }
        if (!item.id) {
          // 生成一个随机数
          const id = createRandomId()
          item.id = item.data.component + "-" + id
        }
      })
    }
    this.$store.commit("UPDATE_COMPONENT", { data })
  },
}
</script>
