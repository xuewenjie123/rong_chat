<template>
	<div class="homeBox">
		<a-row>
			<a-col :span="6" class="leftChatList" style="cursor:pointer">
				<div
					class="itemChat "
					style="text-align:left"
					@click="goSendGroup"
				>
					群发消息
				</div>
				<div class="itemChat aahui font12" style="text-align:left">
					群聊
				</div>
				<div
					class="itemChat"
					v-for="item in groupList"
					:key="item.groupId"
					@click="selectChatObj(item)"
					:style="{
						background:
							selectChat.groupId == item.groupId
								? '#ccc'
								: 'transparent',
					}"
				>
					<p>{{ item.groupName }}</p>
				</div>
				<div class="itemChat aahui font12" style="text-align:left">
					好友
				</div>
				<p
					class="itemChat"
					v-for="item in firendList"
					:key="item.userId"
					@click="selectChatObj(item)"
					:style="{
						background:
							selectChat.userId == item.userId
								? '#ccc'
								: 'transparent',
					}"
				>
					{{ item.userName }}
				</p>
			</a-col>
			<a-col :span="18">
				<h3
					class="textCenter mt20 font18 bold"
					style="margin-bottom:30px;"
				>
					{{
						selectChat.userName
							? selectChat.userName
							: selectChat.groupName
					}}
				</h3>
				<div class="flex flex-wrap flex-row" style="padding-left:20px;">
					<div
						class="flex"
						style="width:100px;"
						v-for="item in userList"
						:key="item.userId"
					>
						<div
							class="flex"
							style="width:40px;height:40px;border-radius:50%;background:blue;text-align:center;line-height:40px;color:#fff;"
						>
							{{ item.userName.charAt(0) }}
						</div>
						<p>
							{{ item.userName }}
						</p>
					</div>
				</div>

				<button @click="sendMsg" class="sendMsg">发消息</button>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
	data() {
		return {
			firendList: [],
			groupList: [],
			selectChat: {},
			userList: [], //群用户列表
		}
	},
	computed: {
		...mapGetters(["userInfo"]),
	},
	mounted() {
		this.getChatFriendList()
		this.getGroupList()
	},
	methods: {
		selectChatObj(obj) {
			this.selectChat = obj
			console.log(obj)
			if (obj.groupId) {
				this.$get(`/rest/group/${obj.groupId}`).then((result) => {
					this.userList = result.data.userList
				})
			} else {
				this.userList = []
			}
		},
		getChatFriendList() {
			this.$get("/rest/friends/getChatFriendList").then((result) => {
				this.firendList = result.data
				if (!this.groupList.length) {
					this.selectChatObj(this.firendList[0])
				}
			})
		},
		getGroupList() {
			this.$get("/rest/group/getGroupList").then((result) => {
				this.groupList = result.data.map((item) => {
					item.groupId = item.groupId.toString()
					return item
				})
				this.selectChatObj(this.groupList[0])
			})
		},
		sendMsg() {
			console.log(this.selectChat)
			this.selectChat = {
				chatName: this.selectChat.userName || this.selectChat.groupName,
				targetId: this.selectChat.userId || this.selectChat.groupId,
				type: this.selectChat.userId ? "friend" : "group",
				...this.selectChat,
			}
			this.$router.push(
				"chat?userInfo=" + JSON.stringify(this.selectChat)
			)
		},
		goSendGroup() {
			this.$router.push("/sendGroup")
		},
	},
}
</script>
<style>
.homeBox,
.homeBox {
	min-height: 100vh;
}
.homeBox .ant-row,
.homeBox .ant-col-6,
.homeBox .ant-col-18 {
	height: 100vh;
	overflow-y: scroll;
	position: relative;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sendMsg {
	width: 100px;
	height: 40px;
	background: #4cd964;
	color: #fff;
	position: absolute;
	bottom: 40px;
	left: 50%;
	margin-left: -50px;
}
.leftChatList {
	background: #f7f7f7;
}
.itemChat {
	height: 60px;
	line-height: 60px;
	box-sizing: border-box;
	padding-left: 20px;
}
</style>
