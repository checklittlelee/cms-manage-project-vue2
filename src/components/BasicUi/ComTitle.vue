<!-- 函数式组件，内部没有逻辑，仅依赖于父组件传入的数据进行渲染 -->
<template functional>
  <div class="component-title">
    {{ props.title }}
  </div>
</template>

<style lang="less" scoped>
// 组件编辑标题
.component-title {
  margin-bottom: 14px;
  padding: 20px 16px;
  border-bottom: 1px solid #f2f4f6;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  color: #323233;
}
</style>
