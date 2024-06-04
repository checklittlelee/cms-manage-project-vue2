// 计算页面中各个组件的使用数量，并将这些信息以键值对的形式存储在一个对象中返回
const getters = {
  pageComponentTotalMap: (state) => {
    const map = {} // 这个对象用于存储每种组件的使用数量，是key value的形式
    const clist = state.pageData.componentList || [] // 从Vuex中获取，且最好做一个容错
    let cName
    clist.forEach((item) => {
      cName = item.data.component // 获取组件的名称
      // 判断是否存在这个组件，如果原本就存在，就累加
      if (map[cName]) {
        map[cName] += 1
      } else {
        map[cName] = 1
      }
    })
    return map
  },
}
// 位置预留，后续如果有别的getters
export default Object.assign({}, getters)
