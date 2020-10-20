let devConfig = {
	devServer: {
		// 基本路径
		proxy: {
			"/rongyunChat": {
				target: "https://zhanyou.ruijie.com.cn",
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					"^/rongyunChat": "", //需要rewrite的,
				},
			},
		},
	},
	lintOnSave: false,
}

module.exports = devConfig
