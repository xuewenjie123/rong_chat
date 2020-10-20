<template>
	<div>
		<h3 class="font20 textCenter">选择好友</h3>
		<div class="flex flex-row flex-wrap" style="height:50px">
			<span>预测：</span>
			<a-radio-group
				v-model="forecastCategoryTags"
				@change="getChatFriendList"
			>
				<a-radio
					v-for="(item, index) in forecastCategoryList"
					:key="index"
					:value="item"
				>
					{{ item }}
				</a-radio>
			</a-radio-group>
		</div>
		<div class="flex flex-row flex-wrap" style="height:50px">
			<span>职位：</span>
			<a-radio-group
				v-model="positionNameTags"
				@change="getChatFriendList"
			>
				<a-radio
					v-for="(item, index) in positionNameList"
					:key="index"
					:value="item"
				>
					{{ item }}
				</a-radio>
			</a-radio-group>
		</div>
		<div class="flex flex-row flex-wrap" style="height:50px">
			<span>行业：</span>
			<a-radio-group v-model="industryTags" @change="getChatFriendList">
				<a-radio
					v-if="item"
					v-for="(item, index) in industryList"
					:key="index"
					:value="item"
				>
					{{ item }}
				</a-radio>
			</a-radio-group>
		</div>
		<div class="flex flex-row flex-wrap" style="height:50px">
			<span>自定义：</span>
			<a-radio-group v-model="customizeTags" @change="getChatFriendList">
				<a-radio
					v-for="(item, index) in customizeTagList"
					:key="index"
					:value="item"
				>
					{{ item }}
				</a-radio>
			</a-radio-group>
		</div>
		<a-checkbox-group @change="checkboxChange" style="width:100%">
			<p
				class="itemChat"
				v-for="(item, index) in firendList"
				:key="index"
				style="background: #ccc;"
			>
				<a-checkbox :value="item.userId">
					{{ item.userName }}
				</a-checkbox>
			</p>
		</a-checkbox-group>
	</div>
</template>

<script>
export default {
	data() {
		return {
			firendList: [],
			checkedUser: [],
			customizeTagList: [],
			forecastCategoryList: [],
			industryList: [],
			positionNameList: [],
			customizeTags: "",
			forecastCategoryTags: "",
			industryTags: "",
			positionNameTags: "",
		}
	},
	mounted() {
		this.getChatFriendList()
		this.getFriendTagList()
	},
	methods: {
		getChatFriendList() {
			let {
				customizeTags,
				forecastCategoryTags,
				industryTags,
				positionNameTags,
			} = this
			console.log(
				customizeTags,
				forecastCategoryTags,
				industryTags,
				positionNameTags
			)
			this.$get("/rest/friends/getChatFriendList", {
				customizeTags,
				forecastCategoryTags,
				industryTags,
				positionNameTags,
			}).then((result) => {
				this.firendList = result.data
			})
		},
		getFriendTagList() {
			this.$get("/rest/friends/getFriendTagList").then((result) => {
				let {
					customizeTagList,
					forecastCategoryList,
					industryList,
					positionNameList,
				} = result.data
				this.customizeTagList = customizeTagList
				this.forecastCategoryList = forecastCategoryList
				this.industryList = industryList
				this.positionNameList = positionNameList
			})
		},
		checkboxChange(checkedValues) {
			this.checkedUser = checkedValues
		},
	},
}
</script>

<style lang="less" scoped>
.itemChat {
	height: 60px;
	line-height: 60px;
	box-sizing: border-box;
	padding-left: 20px;
	margin-bottom: 0;
}
</style>
