<template>
	<div id="chat" class="flex">
		<!--header-->
		<header class="header">
			<span class="title">群发</span>
		</header>
		<!--header-->

		<!--chat-content-->
		<div class="chat-content flex flex-item">
			<div
				class="chatItem flex flex-row "
				v-for="(item, index) in messageList"
				:key="index"
				:style="{
					justifyContent:
						item.senderUserId == userInfo.userId
							? 'flex-end'
							: 'flex-start',
				}"
			>
				<div
					class="flex flex-row"
					v-if="item.senderUserId != userInfo.userId"
				>
					<div
						class="flex"
						style="width:40px;height:40px;border-radius:50%;background:blue;text-align:center;line-height:40px;color:#fff;"
					>
						{{
							item.senderUserId == userInfo.userId
								? userInfo.userName.charAt(0)
								: otherUserInfo.userName
								? otherUserInfo.userName.charAt(0)
								: ""
						}}
					</div>
					<div class="flex" style="margin-left:20px;">
						<span class="flex">{{
							item.senderUserId == userInfo.userId
								? userInfo.userName
								: otherUserInfo.userName
						}}</span>
						<img
							class="flex"
							v-if="item.content.imageUri"
							style="width:40%;"
							:src="item.content.imageUri"
							alt=""
						/>
						<div
							class="flex"
							style="background:#fff;border-radius:6px;padding:6px"
							v-else-if="item.content.fileUrl"
						>
							<span>{{ item.content.name }}</span>
							<span>{{ item.content.size | showSize }}</span>
						</div>
						<span class="flex" v-else>{{
							item.content.content
						}}</span>
					</div>
				</div>
				<div v-else class="flex flex-row justify-end">
					<div class="flex  align-end" style="margin-right:20px;">
						<span class="flex">{{
							item.senderUserId == userInfo.userId
								? userInfo.userName
								: otherUserInfo.userName
						}}</span>
						<img
							class="flex"
							v-if="item.content.imageUri"
							style="width:40%;"
							:src="item.content.imageUri"
							alt=""
						/>
						<div
							class="flex"
							style="background:#fff;border-radius:6px;padding:6px"
							v-else-if="item.content.fileUrl"
						>
							<span>{{ item.content.name }}</span>
							<span>{{ item.content.size | showSize }}</span>
						</div>
						<span class="flex" v-else>{{
							item.content.content
						}}</span>
					</div>
					<div
						class="flex"
						style="width:40px;height:40px;border-radius:50%;background:blue;text-align:center;line-height:40px;color:#fff;"
					>
						{{
							item.senderUserId == userInfo.userId
								? userInfo.userName.charAt(0)
								: otherUserInfo.userName
								? otherUserInfo.userName.charAt(0)
								: ""
						}}
					</div>
				</div>
			</div>
		</div>
		<!--chat-content-->

		<!--footer-->
		<footer class="footer flex  flex-row">
			<div class="message-wrap">
				<textarea
					v-model="sendMsgVal"
					class="message-content"
				></textarea>
			</div>
			<div class="flex justify-around">
				<input
					type="file"
					@change="uploadImg($event)"
					class="flex send-btn"
					style="display:none;"
					id="uploadImg"
				/>
				<input
					type="file"
					@change="uploadFile($event)"
					class="flex send-btn"
					style="display:none;"
					id="uploadFile"
				/>
				<span class="flex send-btn" @click="sendImg">发送图片</span>
				<span class="flex send-btn" @click="sendFile">发送文件</span>
				<span class="flex send-btn" @click="sendMsg">发送</span>
			</div>
		</footer>
		<!--footer-->
	</div>
</template>

<script>
import { notification, message } from "ant-design-vue"
import { mapGetters } from "vuex"
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"
import { quillEditor } from "vue-quill-editor"
export default {
	components: {
		quillEditor,
	},
	data() {
		let { checkedUser } = this.$route.query
		checkedUser = JSON.parse(checkedUser)
		let userInfo = checkedUser[0]
		return {
			checkedUser,
			targetUserInfo: userInfo,
			otherUserInfo: {},
			im: {},
			messageList: [],
			conversationList: [],
			sendMsgVal: "",
			canchat: true,
			uploadCallbacks: {},
			config: {},
			timer: null,
			fileType: "",
		}
	},
	filters: {
		showSize(size) {
			let showSizeNum = ""
			let gNum = size / 1024 / 1024 / 1024
			let mNum = size / 1024 / 1024
			let kNum = size / 1024
			console.log(gNum)
			console.log(gNum > 1)
			if (
				gNum > 1 &&
				gNum.toString().indexOf("e") < 0 &&
				gNum.toString().indexOf("-") < 0
			) {
				showSizeNum = Math.round(gNum * 100) / 100 + "GB"
			} else if (
				mNum > 1 &&
				mNum.toString().indexOf("e") < 0 &&
				mNum.toString().indexOf("-") < 0
			) {
				showSizeNum = Math.round(mNum * 100) / 100 + "MB"
			} else if (
				kNum > 1 &&
				kNum.toString().indexOf("e") < 0 &&
				kNum.toString().indexOf("-") < 0
			) {
				showSizeNum = Math.round(kNum * 100) / 100 + "KB"
			} else {
				showSizeNum = size + "B"
			}
			return showSizeNum
		},
	},
	beforeDestroy() {
		this.im.disconnect().then(function() {
			console.log("断开链接成功")
		})
		this.timer && clearTimeout(this.timer)
	},
	computed: {
		...mapGetters(["userInfo"]),
	},
	mounted() {
		message.loading("加载中...", 0)

		let that = this
		this.im = RongIMLib.init({
			appkey: "6tnym1br6fsl7",
		})
		RongIMLib.RongIMEmoji.init()

		this.config = {
			domain: "http://upload.qiniu.com",
			fileType: that.fileType,
			getToken: function(callback) {
				that.im
					.getFileToken(that.fileType)
					.then(function(data) {
						console.log("data", data)
						callback(data.token, data)
					})
					.catch(function(error) {
						console.log("获取上传 token 失败", error)
					})
			},
		}
		this.uploadCallbacks = {
			onProgress: function(loaded, total) {
				// var percent = Math.floor((loaded / total) * 100)
				// console.log("已上传: ", percent)
			},
			onCompleted: function(data) {
				// 上传完成, 调用 getFileUrl 获取文件下载 url
				console.log("上传成功: ", data)
				var filename = data.filename // 通过 uploadCallbacks 的 onCompleted 中返回的 data 获取
				var oriname = data.name // 通过 uploadCallbacks 的 onCompleted 中返回的 data 获取;
				let name = oriname.split(".")
				var type = data.name[name.length - 1]
				var size = data.size
				message.destroy()
				that.im
					.getFileUrl(that.fileType, filename, oriname)
					.then(function(res) {
						let msgContent = {}
						if (that.fileType == RongIMLib.FILE_TYPE.IMAGE) {
							msgContent = {
								messageType: RongIMLib.MESSAGE_TYPE.IMAGE, // 'RC:ImgMsg'
								content: {
									content:
										"data:image/png;base64," +
										data.thumbnail, // // 压缩后的 base64 略缩图, 用来快速展示图片
									imageUri: res.downloadUrl, // 上传到服务器的 url. 用来展示高清图片
								},
							}
						} else {
							msgContent = {
								messageType: RongIMLib.MESSAGE_TYPE.FILE, //'RC:FileMsg'
								content: {
									name: filename,
									fileUrl: res.downloadUrl,
									type,
									size,
								},
							}
						}
						that.checkedUser.forEach((item) => {
							let conversation = that.im.Conversation.get({
								targetId: item.userId,
								type: RongIMLib.CONVERSATION_TYPE.PRIVATE,
							})
							conversation
								.send(msgContent)
								.then(function(message) {
									if (
										item.userId ==
										that.targetUserInfo.userId
									) {
										console.log("发送消息成功", message)
										that.messageList.push(message)
									}
								})
						})
					})
					.catch(function(error) {
						console.log("获取文件 url 失败", error)
					})
			},
			onError: function(error) {
				console.error("上传失败", error)
				message.destroy()
			},
		}

		this.im.watch({
			conversation: function(event) {
				var updatedConversationList = event.updatedConversationList // 更新的会话列表
				that.im.Conversation.merge({
					conversationList: that.conversationList,
					updatedConversationList,
				})
			},
			message: function(event) {
				var message = event.message
				console.log("收到新消息:", message)
				message.content.content = RongIMLib.RongIMEmoji.emojiToSymbol(
					message.content.content || ""
				)
				if (
					message.content.fileUrl ||
					(message.content.content != undefined &&
						message.content.content != "")
				) {
					that.$get("/rest/friends/" + message.senderUserId).then(
						(result) => {
							that.otherUserInfo = result.data
						}
					)
					that.messageList.push(message)
				}
				that.timer = setTimeout(that.scrollEnd, 2000)
			},
			status: function(event) {
				var status = event.status
			},
		})
		this.im
			.connect({
				token: this.userInfo.token,
			})
			.then(function(user) {
				message.destroy()
				that.canchat = false
				console.log("链接成功, 链接用户 id 为: ", user, user.id)
				that.im.Conversation.getList().then(function(conversationList) {
					that.conversationList = conversationList
				})
			})
			.catch(function(error) {
				message.destroy()
				that.canchat = true
				console.log("链接失败: ", error.code, error.msg)
			})
	},
	methods: {
		sendImg() {
			var uploadEl = document.getElementById("uploadImg")
			uploadEl.click()
		},
		sendFile() {
			var uploadEl = document.getElementById("uploadFile")
			uploadEl.click()
		},
		uploadImg(event) {
			message.loading("上传中...", 0)
			var _file = event.target.files[0] // 上传的 file 对象
			let that = this
			this.fileType = RongIMLib.FILE_TYPE.IMAGE
			UploadClient.initImage(this.config, function(uploadFile) {
				uploadFile.upload(_file, that.uploadCallbacks)
			})
		},
		uploadFile() {
			message.loading("上传中...", 0)
			var _file = event.target.files[0] // 上传的 file 对象
			let that = this
			this.fileType = RongIMLib.FILE_TYPE.FILE
			UploadClient.initFile(this.config, function(uploadFile) {
				uploadFile.upload(_file, that.uploadCallbacks)
			})
		},
		sendMsg() {
			if (this.canchat) {
				notification.error({
					message: "消息提示",
					description:
						"暂未与" +
						that.targetUserInfo.userName +
						"连接成功，退出重试",
					duration: 3,
				})
				return
			}
			let that = this
			this.checkedUser.forEach((item) => {
				let conversation = that.im.Conversation.get({
					targetId: item.userId,
					type: RongIMLib.CONVERSATION_TYPE.PRIVATE,
				})

				conversation
					.send({
						messageType: RongIMLib.MESSAGE_TYPE.TEXT, // 'RC:TxtMsg'
						content: {
							content: that.sendMsgVal, // 文本内容
						},
					})
					.then(function(message) {
						if (item.userId == that.targetUserInfo.userId) {
							that.sendMsgVal = ""
							message.content.content = RongIMLib.RongIMEmoji.emojiToSymbol(
								message.content.content
							)
							console.log("发送图片消息成功", message)
							that.messageList.push(message)
						}
						console.log(that.messageList)
						that.scrollEnd()
					})
			})
		},
		scrollEnd() {
			//添加完消息 跳转到最后一条
			document.querySelector(".chat-content").scrollTop =
				document.querySelector(".chat-content").scrollHeight -
				document.querySelector(".chat-content").clientHeight
		},
	},
}
</script>
<style>
.ql-toolbar.ql-snow + .ql-container.ql-snow {
	min-height: 200px;
}
.ql-snow .ql-tooltip input[type="text"] {
	width: 100%;
	height: 200px;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#chat {
	height: 100vh;
	box-sizing: border-box;
	padding: 0 30px;
	width: 100%;
}
/* header */
.header {
	width: 100%;
	height: 36px;
	line-height: 36px;
	text-align: center;
}
.chatItem {
	margin-top: 20px;
}
/* chat */
.chat-content {
	width: 100%;
	overflow-y: scroll;
	box-sizing: border-box;
	border: 1px solid #cdd7db;
	padding: 0 30px;
}

/* footer */
.footer {
	display: flex;
	height: 300px;
	width: 100%;
	text-align: center;
	justify-content: center;
	background-color: #fff;
	border: 1px solid #cdd7db;
	border-top: 0;
}

.footer .message-wrap {
	flex: 1;
	display: flex;
	overflow: hidden;
	padding: 20px;
}

.footer .message-content {
	flex: 1;
	width: 100%;
	resize: none;
	border: none;
	outline: none;
	font-family: "Microsoft yahei";
}

.footer .send-btn {
	width: 100px;
	height: 50px;
	line-height: 50px;
	border-radius: 25px;
	font-size: 12px;
	margin-right: 100px;
	color: #fff;
	text-align: center;
	border: none;
	background: #0099ff;
	cursor: pointer;
}
</style>
