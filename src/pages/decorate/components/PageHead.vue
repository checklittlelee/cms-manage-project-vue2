<!-- 左侧返回到列表按钮，右侧两个按钮：保存+预览 -->
<template>
  <div class="page-head">
    <!-- 左侧 -->
    <a class="go-back" @click="backToList">
      <img class="logo" src="~@/assets/img/layout/logo.png" />
      返回频道列表页面
    </a>
    <!-- 右侧 -->
    <div class="page-operate">
      <el-button
        type="primary"
        size="medium"
        :loading="saveLoading"
        @click="saveAndContinue"
      >
        保存
      </el-button>
      <el-button size="medium" :loading="previewLoading" @click="saveAndView">
        预览
      </el-button>
    </div>
  </div>
</template>

<script>
import { saveCmsPage } from "@/api/activity"
export default {
  name: "PageHead",
  data() {
    return {
      onlineLoading: false,
      saveLoading: false,
      previewLoading: false,
    }
  },
  computed: {
    pageData() {
      return this.$store.state.pageData
    },
  },
  methods: {
    // 返回频道列表页面。window.opener 可以获取新开窗口来自的那个窗口。用try catch做容错
    backToList() {
      try {
        let isParentActivityPage =
          window.opener && window.opener.location.hash === "#/activity"
        if (isParentActivityPage) {
          // 父窗口是活动列表，直接关闭父窗口，并刷新当前窗口到列表页，更新列表数据
          window.opener.close()
        }
        this.$router.push("/activity")
      } catch (e) {
        this.$router.push("/activity")
      }
    },
    // 保存并继续。页面不跳转
    saveAndContinue() {
      // loading可以让button避免反复被点击，起到防抖效果
      this.saveLoading = true
      this.savePage()
        .then(({ data }) => {
          this.$message.success("保存成功")
        })
        .catch((err) => {
          this.$message.warning(`保存失败: ${err.message}`)
        })
        .finally(() => {
          this.saveLoading = false
        })
    },
    // 上架并预览
    saveAndView() {
      this.previewLoading = true
      // 与后端协商 online: 1 是草稿的意思，预览与保存是有区别的
      this.savePage({ online: 1 })
        .then((res) => {
          this.$message.success("上架成功")
          let id = res && res.data ? res.data.id : ""
          if (id) {
            this.$router.push(`/decorate?id=${id}`)
          } else {
            // 更新页面，接口参数不返回id，取地址栏id参数
            id = this.$route.query.id
          }
          this.goToView(id)
        })
        .catch((err) => {
          this.$message.warning(`上架并预览失败: ${err.message}`)
        })
        .finally(() => {
          this.previewLoading = false
        })
    },
    // 保存页面数据
    savePage(params) {
      // 使用扩展运算符合并
      let pageData = { ...this.pageData, params }
      pageData.componentList.forEach((item, index) => {
        // 组件的显示顺序
        item.sort = index
      })
      return saveCmsPage(pageData).then((resp) => {
        if (resp && resp.data && resp.data.id) {
          this.setIdForAddSave(resp.data.id)
        }
        return resp
      })
    },
    goToView(id) {
      let urlObj = this.$router.resolve({
        path: "preview",
        query: { id },
      })
      window.open(urlObj.href, "_blank")
    },
    // 上架
    saveAndPut() {
      this.onlineLoading = true
      let data = { online: 1 }
      this.savePage(data)
        .then(() => {
          this.$message.success("上架成功")
        })
        .catch((err) => {
          this.$message.warning(`上架失败: ${err.message}`)
        })
        .finally(() => {
          this.onlineLoading = false
        })
    },
    setIdForAddSave(id) {
      this.$router.push(`/decorate?id=${id}`)
      let pageData = { ...this.pageData }
      pageData.id = id
      this.$store.commit("UPDATE_COMPONENT", { data: pageData })
    },
  },
}
</script>

<style lang="less" scoped>
.page-head {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: @page-header-height;
  background: #fff;
  border-bottom: 1px solid #ebedf0;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .go-back {
    float: left;
    line-height: 55px;
    font-size: 14px;
    color: #4f4f4f;
    cursor: pointer;
    .logo {
      display: inline-block;
      vertical-align: middle;
      margin: -2px 4px 0 0;
      max-width: 30px;
      max-height: 30px;
    }
  }
}
</style>
