<template>
	<div class="login" id="login">
		<div class="login-content">
			<h4>用户登录</h4>
			<form>
				<div class="login-user">
					<div class="login-person">
						<img src="../../assets/person.png" width="9%" />
					</div>
					<div class="login-input">
						<input
							type="text"
							v-model="formData.loginName"
							placeholder="请输入用户名"
							class="username"
						/>
					</div>
				</div>
				<div class="login-user">
					<div class="login-person">
						<img src="../../assets/suozi.png" width="8%" />
					</div>
					<div class="login-input">
						<input
							type="password"
							v-model="formData.passWord"
							placeholder="请输入密码"
							class="password"
						/>
					</div>
				</div>
				<button id="login-but" type="button" @click="login">
					登录
				</button>
			</form>
		</div>
	</div>
</template>

<script>
import { mapMutations } from "vuex"
export default {
	name: "login",
	data() {
		return {
			formData: {
				loginName: "",
				passWord: "",
			},
			rules: {
				loginName: {
					required: true,
					requiredMsg: "用户名不能为空",
				},
				passWord: {
					required: true,
					requiredMsg: "密码不能为空",
				},
			},
		}
	},
	methods: {
		...mapMutations(["setUserInfo"]),
		login() {
			if (!this.validateForm()) {
				return false
			}
			this.$post("/api/user/login", this.formData).then((result) => {
				this.setUserInfo(result.data)
				this.$router.push("/home")
			})
		},
	},
}
</script>

<style scoped>
.login {
	background: url(../../assets/index-bj.jpg) no-repeat;
	width: 100%;
	height: 100vh;
	overflow: hidden;
}
.login-content {
	position: absolute;
	top: 50%;
	left: 50%;
	margin-left: -235px;
	margin-top: -160px;
	width: 470px;
	height: 320px;
	background: #e9f3ff;
}
.company-tit {
	color: #fff;
	text-align: center;
	position: fixed;
	bottom: 5%;
	width: 100%;
}

.login-content h4 {
	color: #1385ff;
	font-size: 24px;
	text-align: center;
	margin: 25px 0;
	font-weight: normal;
}

.login-user {
	display: flex;
	width: 70%;
	height: 45px;
	line-height: 45px;
	border-radius: 5px;
	margin: 0 auto;
	margin-top: 30px;
	border: 1px solid #1289ff;
	position: relative;
}

.login-person img {
	position: absolute;
	top: 10px;
	left: 10px;
}

.login-person {
	width: 15%;
}

.login-input {
	width: 100%;
}

.login-input input {
	width: 90%;
	height: 38px;
	border: none;
	outline: none;
	background: #e9f3ff;
}

#login-but {
	width: 70%;
	margin: 40px auto;
	display: block;
	height: 45px;
	line-height: 45px;
	background: #1385ff;
	font-size: 18px;
	color: white;
	border: none;
	outline: none;
	cursor: pointer;
}
</style>
