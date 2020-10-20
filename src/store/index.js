import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)
const store = {
	state: {
		userInfo: {
			token: "",
		}, //用户信息
	},
	mutations: {
		setUserInfo(state, data) {
			state.userInfo = data
		},
		clearState(state) {
			state = {
				userInfo: {}, //用户信息
			}
		},
	},
	actions: {},
	getters: {
		userInfo: (state) => state.userInfo,
	},
	modules: {},
}
export default new Vuex.Store({
	...store,
	plugins: [
		createPersistedState({
			storage: window.sessionStorage,
		}),
	],
})
