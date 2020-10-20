<template>
	<div>
		<!-- <div id="chatPage">{{ stat.messageList }}</div> -->
		<div id="chat">
			<div class="chat">
				<!--header-->
				<header class="header">
					<span class="title">{{ targetUserInfo.userName }}</span>
				</header>
				<!--header-->

				<!--chat-content-->
				<div class="chat-content"></div>
				<!--chat-content-->

				<!--footer-->
				<footer class="footer">
					<div class="message-wrap">
						<textarea
							v-model="stat.sendMsgVal"
							id="message-content"
							placeholder="请输入文字..."
							class="message-content"
						></textarea>
					</div>
					<span class="send-btn" @click="sendMsg">发送</span>
				</footer>
				<!--footer-->
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
	data() {
		let { userInfo } = this.$route.query
		userInfo = JSON.parse(userInfo)
		return {
			userId: userInfo.userId,
			targetUserInfo: userInfo,
			im: {},
			stat: {
				currentView: "chat",
				currentUserInfo: {
					id: "user1",
					nickname: "产品",
					region: "86",
					phone: "13269772701",
					portraitUri:
						"http://himg.bdimg.com/sys/portrait/item/98fbe9b8a3e89d895745491c12.jpg?cdnversion=0741",
				},
				targetUserInfo: {
					id: "user2",
					nickname: "开发",
					region: "86",
					phone: "13269772702",
					portraitUri:
						"https://www.rongcloud.cn/docs/assets/img/index/logo.png",
				},
				messageList: [],
				sendMsgVal: "",
				conversation: {},
			},
			conversationList: [],
		}
	},
	computed: {
		...mapGetters(["userInfo"]),
	},
	mounted() {
		let that = this
		this.im = RongIMLib.init({
			appkey: "6tnym1br6fsl7",
		})
		console.log("that.conversationList", that.conversationList)
		this.im.watch({
			conversation: function(event) {
				var updatedConversationList = event.updatedConversationList // 更新的会话列表
				that.conversationList = that.conversationList.concat(
					updatedConversationList
				)
				console.log("更新会话汇总:", updatedConversationList)
				console.log("原来的", that.conversationList)
				console.log(
					"最新会话列表:",
					that.im.Conversation.merge({
						conversationList: that.conversationList,
						updatedConversationList,
					})
				)
			},
			message: function(event) {
				var message = event.message
				console.log("收到新消息:", message)
			},
			status: function(event) {
				var status = event.status
				console.log("连接状态码:", status)
			},
		})
		this.im
			.connect({
				token: this.userInfo.token,
			})
			.then(function(user) {
				console.log("链接成功, 链接用户 id 为: ", user, user.id)
				that.im.Conversation.getList().then(function(conversationList) {
					console.log("获取会话列表成功", conversationList)
					that.conversationList = conversationList
				})
				that.conversation = that.im.Conversation.get({
					targetId: that.targetUserInfo.userId,
					type: RongIMLib.CONVERSATION_TYPE.PRIVATE,
				})
				var option = {
					timestrap: +new Date(),
					count: 20,
				}
				that.conversation
					.getMessages(option)
					.then(function(result) {
						var list = result.list // 历史消息列表
						var hasMore = result.hasMore // 是否还有历史消息可以获取
						console.log("获取历史消息成功", list, hasMore)
					})
					.catch((err) => {
						console.log("获取历史消息", err)
					})
			})
			.catch(function(error) {
				console.log("链接失败: ", error.code, error.msg)
			})
	},
	methods: {
		sendMsg() {
			let that = this
			console.log(this.conversation)
			this.conversation
				.send({
					messageType: RongIMLib.MESSAGE_TYPE.TEXT, // 'RC:TxtMsg'
					content: {
						content: that.stat.sendMsgVal, // 文本内容
					},
				})
				.then(function(message) {
					console.log("发送文字消息成功", message)
				})
		},
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#chat {
	height: 100vh;
}
/* header */
.header {
	width: 100%;
	height: 36px;
	line-height: 36px;
	text-align: center;
}

/* chat */
.chat-content {
	width: 100%;
	overflow-y: scroll;
	height: 500px;
	border: 1px solid #cdd7db;
}

/* footer */
.footer {
	display: flex;
	height: 114px;
	width: 100%;
	text-align: center;
	background-color: #fff;
	border: 1px solid #cdd7db;
	border-top: 0;
}

.footer .message-wrap {
	flex: 1;
	overflow: hidden;
	padding: 20px;
}

.footer .message-content {
	height: 80px;
	width: 100%;
	resize: none;
	border: none;
	outline: none;
	font-family: "Microsoft yahei";
}

.footer .send-btn {
	width: 60px;
	height: 24px;
	line-height: 24px;
	border-radius: 40px;
	font-size: 9pt;
	color: #fff;
	background: #0099ff;
	cursor: pointer;
	margin-right: 20px;
	margin-top: 50px;
}
</style>
