import VueRouter from "vue-router"
import store from "../store"
import Vue from "vue"
// 路由匹
Vue.use(VueRouter)
const router = new VueRouter({
	mode: "history",
	routes: [
		{
			path: "/",
			name: "index",
			redirect: "/login",
		},
		{
			path: "/login",
			name: "login",
			component: () =>
				import(
					/* webpackChunkName: "login" */ "@/pages/login/index.vue"
				),
		},
		{
			path: "/home",
			name: "home",
			component: () =>
				import(/* webpackChunkName: "home" */ "@/pages/home/index.vue"),
		},
		{
			path: "/chat",
			name: "chat",
			component: () =>
				import(/* webpackChunkName: "chat" */ "@/pages/chat/index.vue"),
		},
		{
			path: "/sendGroup",
			name: "sendGroup",
			component: () =>
				import(
					/* webpackChunkName: "sendGroup" */ "@/pages/sendGroup/index.vue"
				),
		},
		{
			path: "/chatRoom",
			name: "chatRoom",
			component: () =>
				import(
					/* webpackChunkName: "chatRoom" */ "@/pages/chatRoom/index.vue"
				),
		},
	],
})
const whiteList = [] //白名单

router.beforeEach((to, from, next) => {
	let isLogin = store.state.token
	if (!isLogin && whiteList.indexOf(to.path) !== -1) {
		next({ path: "/login" })
	} else {
		next()
	}
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err)
}
export default router
