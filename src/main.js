import Vue from "vue"
import App from "./App.vue"
import router from "./router/index" //路由
import store from "./store/index.js" //store
import validateForm from "./utils/validateForm.js" //表单验证
import antd from "ant-design-vue"
import "ant-design-vue/dist/antd.css"
import { get, post } from "./utils/ajax.js"

import { message } from "ant-design-vue"
message.config({
	maxCount: 1,
})
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.use(antd)
Vue.use(validateForm)
Vue.config.productionTip = false
new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app")
