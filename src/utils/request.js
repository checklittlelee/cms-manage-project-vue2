import axios from "axios"
import { baseURL } from "@/config"
import { Message } from "element-ui"

// 创建axios实例
const service = axios.create({
  baseURL, // url = base url + request url
  timeout: 20000, // 请求超时时间
})

// 添加请求拦截器。在请求发送之前对请求进行修改。例如添加认证信息token、修改请求头等
service.interceptors.request.use(
  // 从本地存储中获取token，将token添加到请求头中，返回配置的请求
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["X-token"] = token
    }
    return config
  },
  // 处理错误的请求，返回错误信息
  (error) => {
    return Promise.reject(error)
  },
)

// 添加响应拦截器。在响应到达客户端之前对响应进行处理。例如统一错误处理、根据响应状态码进行不同处理等
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 判断条件一：1000是后端设定好的成功状态码，不成功，显示错误信息
    if (res.code !== 10000) {
      Message.error(res.message)
    }
    // 判断条件二：认证失败或登录过期，清除登录状态，重定向到登录页面，强制用户重新登录
    if (res.code === -2) {
      localStorage.removeItem("token")
      window.location.href = location.origin + "/cms-manage/#/login"
    }
    // 前两个判断条件都避开了，就返回响应结果
    return res
  },
  (error) => {
    // 处理响应错误，打印、返回错误信息
    console.log("err" + error)
    return Promise.reject(error)
  },
)

export default service
