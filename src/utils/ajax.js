import axios from "axios"
import { notification, message } from "ant-design-vue"
import store from "../store"
import qs from "qs"
let bulicurl = "/rongyunChat"
const instance = axios.create({
	//创建axios实例，在这里可以设置请求的默认配置
	timeout: 10000, // 设置超时时间10s
})

let httpCode = {
	//这里我简单列出一些常见的http状态码信息，可以自己去调整配置
	400: "请求参数错误",
	401: "权限不足, 请重新登录",
	403: "服务器拒绝本次访问",
	404: "请求资源未找到",
	500: "内部服务器错误",
	501: "服务器不支持该请求中使用的方法",
	502: "网关错误",
	504: "网关超时",
}

/** 添加请求拦截器 **/
instance.interceptors.request.use(
	(config) => {
		if (config.method == "get") {
			config.url += "?" + config.data
		}
		message.loading("加载中...", 0)
		if (config.method == "post") {
			config.params = {}
		}
		return config
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

/** 添加响应拦截器  **/
instance.interceptors.response.use(
	(response) => {
		console.log(response.config.url + "服务器返回数据", response.data)
		message.destroy()
		if (response.data.code == 0) {
			//成功
			return Promise.resolve(response.data)
		} else {
			notification.error({
				message: "错误提示",
				description: response.data.msg,
				duration: 3,
			})
			return Promise.reject(response.data.msg)
		}
	},
	(error) => {
		message.destroy()
		if (error.response) {
			// 根据请求失败的http状态码去给用户相应的提示
			let tips =
				error.response.status in httpCode
					? httpCode[error.response.status]
					: error.response.data.message
			notification.error({
				message: "消息提示",
				description: tips,
				duration: 3,
			})

			return Promise.reject(error)
		} else {
			notification.error({
				message: "消息提示",
				description: "请求超时, 请刷新重试",
				duration: 3,
			})
			return Promise.reject(new Error("请求超时, 请刷新重试"))
		}
	}
)
const ajax = (methodType, url, params = {}, config) => {
	params.token = store.state.userInfo.token
	return new Promise((resolve, reject) => {
		instance({
			method: methodType,
			url: `${bulicurl}${url}`,
			data: qs.stringify(params),
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			...config,
		})
			.then((response) => {
				resolve(response)
			})
			.catch((error) => {
				reject(error)
			})
	})
}
export const get = (url, params, config = {}) =>
	ajax("get", url, params, config)
export const post = (url, params, config = {}) =>
	ajax("post", url, params, config)
