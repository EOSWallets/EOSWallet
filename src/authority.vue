<template>
	<div ref="authorityMain" style="opacity: 1;">
		<div class="navigator">
			<image :src="`${imgSrc}back_blue`" style="height: 60px;width: 60px;" @click="goBack"></image>
			<text style="font-size: 36px; color: #1E90FF;">{{zhLan.authority_manage}}</text>
			<image src="${imgSrc}about" style="height: 60px;width: 60px" @click="goWarn"></image>
		</div>
		<div>
			<scroller :style="scrollerStyle">
				<refresh class="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="refreshing ? 'show' : 'hide'">
					<text class="indicator-text">{{zhLan.refreshing}}</text>
					<loading-indicator class="indicator"></loading-indicator>
				</refresh>
				<div v-for="(permission,indexto) in permissionList" :key="indexto">
					<div class="authority-title-box">
						<text class="authority-title-title">{{permission.perm_name}}</text>
						<div class="authority-title-right">
							<image :src="`${imgSrc}add`" mode="" style="height: 28px;width: 28px; margin-right: 10px;"></image>
							<text class="copy-box-text" @click="jumpAuthorityAdd(permission.perm_name)">{{zhLan.add}}</text>
						</div>
					</div>
					<div>
						<div class="main-top">
							<text style="font-size: 28px;">{{zhLan.weight_threshold}}</text>
							<div style="flex-direction: row;">
								<text style="font-size: 28px;" >{{permission.required_auth.threshold}}</text>
								<!-- <image :src="`${imgSrc}right_gray`" mode="" style="height: 28px;width: 28px;"></image> -->
							</div>
							
						</div>
						<div class="main" v-for="(item,index) in permission.required_auth.keys" :key="index">

							<div class="main-middle">
								<image :src="`${imgSrc}key1`" mode="" style="height: 36px;width: 36px; margin-right: 20px;"></image>
								<text class="note">{{item.key}}</text>
							</div>
							<div class="main-footer">
								<text class="main-footer-left">{{zhLan.weight}}{{item.weight}}</text>
								<text class="main-footer-right" @click="jumpAuthorityEdit(permission.perm_name,'pubKey',index)">{{zhLan.alter}}</text>
							</div>
						</div>

					
						<div class="main" v-for="(item,index) in permission.required_auth.accounts" :key="index">
							<div class="main-middle">
								<image :src="`${imgSrc}key1`" mode="" style="height: 36px;width: 36px; margin-right: 20px;"></image>
								<text class="note">{{item.permission.actor}}@{{item.permission.permission}}</text>
							</div>
							<div class="main-footer">
								<text class="main-footer-left">{{zhLan.weight}}{{item.weight}}</text>
								<text class="main-footer-right" @click="jumpAuthorityEdit(permission.perm_name,'account',index)">{{zhLan.alter}}</text>
							</div>
						</div>
					</div>
				</div>
				
				
				<!-- <div class="authority-title-box">
					<text class="authority-title-title">active</text>
					<div class="authority-title-right">
						<image :src="`${imgSrc}add`" mode="" style="height: 28px;width: 28px; margin-right: 10px;"></image>
						<text class="copy-box-text" @click="jumpAuthorityAdd('active')">新增</text>
					</div>
				</div>
				<div>
					<div class="main-top">
						<text>权重阈值</text>
						<text>1</text>
					</div>
					<div class="main" v-for="(item,index) in activePermission.keys" :key="index">
						<div class="main-middle">
							<image :src="`${imgSrc}key1`" mode="" style="height: 32px;width: 32px; margin-right: 20px;"></image>
							<text class="note">{{item.key}}</text>
						</div>
						<div class="main-footer">
							<text class="main-footer-left">权重：1</text>
							<text class="main-footer-right" @click="jumpAuthorityEdit('active','pubKey',index)">修改</text>
						</div>
					</div>

			
					<div class="main" v-for="(item,index) in activePermission.accounts" :key="index">
						<div class="main-middle">
							<image :src="`${imgSrc}key1`" mode="" style="height: 32px;width: 32px; margin-right: 20px;"></image>
							<text class="note">{{item.permission.actor}}@{{item.permission.permission}}</text>
						</div>
						<div class="main-footer">
							<text class="main-footer-left">权重：1</text>
							<text class="main-footer-right" @click="jumpAuthorityEdit('active','account',index)">修改</text>
						</div>
					</div>
				</div> -->

			</scroller>
		</div>
		<div>
			<wxc-loading :show="isShow" type="default"></wxc-loading>
			<wxc-part-loading :show="isShow"></wxc-part-loading>
		</div>
	</div>
</template>

<script>
	import {
		WxcButton,
		WxcMinibar,
		WxcLoading,
		Utils
	} from 'weex-ui';
	const modal = weex.requireModule('modal')
	const animation = weex.requireModule('animation')
	const storage = weex.requireModule('storage');
	const navigator = weex.requireModule('navigator')
 	const utils = require('./appUtils')
	// import {
	// 	getCurrentAccountInfo
	// } from "./utils/account"
	import {
		getCurrentAccountInfo
	} from "./utils/account_v2"
	import {
		getStorage,
		imgSrc
	} from './utils/config_v2'
	const globalLan = require('./utils/language/global')
	export default {
		components: {
			WxcButton,
			WxcMinibar,
			WxcLoading,
		},
		
		
		
		data() {
			return {
				imgSrc: imgSrc,
				password: "",
				isShow: false,
				width: "600px",
				borderColor: "",
				borderRadius: "",
				height: "100px",
				backgroundColor: "#1E90FF",
				fontSize: '35px',
				color: "#ffffff",
				account: {},
				ownerPermission: {},
				activePermission: {},
				refreshing: false,
				scrollerH: "",
				permissionList:[],
				chainName:"",
				globalLan: globalLan,
				 zhLan: {},
			};
		},
		async mounted() {
			let lan = await getStorage('lan')
    		let zhLan = {}
    		if(!lan) {
    		  lan = 'zh-CN'
			}
			this.zhLan = await this.globalLan.lang("authority", lan)
			console.log("语言包",JSON.stringify(this.zhLan))
		},
		computed: {
			btnStyle() {
				const {
					width,
					height,
					backgroundColor,
					borderColor,
					borderRadius
				} = this;
				const customStyle = {};
				if (width) {
					customStyle.width = width;
				}
				if (height) {
					customStyle.height = height;
					customStyle.lineHeight = height;
				}
				if (backgroundColor) {
					customStyle.backgroundColor = backgroundColor;
				}
				if (borderColor) {
					customStyle.borderColor = borderColor;
					customStyle.borderWidth = '1px';
					customStyle.borderStyle = 'solid';
				}
				if (borderRadius) {
					customStyle.borderRadius = borderRadius;
				}
				return customStyle;
			},
			textStyle() {
				const {
					fontSize,
					color
				} = this;
				const customStyle = {};
				if (fontSize) {
					customStyle.fontSize = fontSize;
				}
				if (color) {
					customStyle.color = color;
				}
				return {
					fontSize,
					color
				}
			},
			judgeIsDisabled() {
				if (!this.password) {
					return true
				}
				return false
			},
		},
		beforeCreate() {
			const tabPageHeight = Utils.env.getPageHeight();
			console.log("获取到高度" + tabPageHeight)
			this.scrollerH = (tabPageHeight) + 'px'
			this.scrollerStyle = {
				height: this.scrollerH,
			}
		},
		async created() {
			await this.getPermission()
			this.test()
		},
		methods: {
			test(){
				let that = this
				let authority = new BroadcastChannel('update')
				authority.onmessage = function (event) {
				  console.log("接收到监听",event.data) // Assemble!
				  that.getPermission()
				}
			},
			async getPermission(){
				let accountName = ""
				
				let authoritySt = JSON.parse(await getStorage("authority")) 
				this.chainName = authoritySt.chainName;
				accountName = authoritySt.accountName
				console.log("获取到传参:",this.chainName,accountName)
				
				this.account = await getCurrentAccountInfo(accountName, this.chainName);
				console.log("权限",this.account)
				if (this.account.account_name != "" && this.account.account_name != undefined) {
					storage.setItem("Account", JSON.stringify(this.account), res => {
						console.log("添加刷新账户 - OK",JSON.stringify(this.account))
					})
				}
				
				let permissionList = []
				for (let i = 0; i < this.account.permissions.length; i++) {
					let value = this.account.permissions[i]
					if (value.perm_name == "owner") {
						// this.ownerPermission = value.required_auth
						permissionList.unshift(this.account.permissions[i])
					} else {
						// this.activePermission = value.required_auth
						permissionList.push(this.account.permissions[i])
					}
				}
				
				this.permissionList = permissionList
				console.log("权限列表",this.permissionList)
				this.isShow = false
			},
			goBack() {
				// this.$router.go(-1)
				navigator.pop({
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})
			},
			goWarn() {
				// this.$router.push("/authority_tips")
				//   let data = {url: this.url, name:"dapp浏览器"}
        		//   await storage.setItem("dapp",  JSON.stringify(data))
        		  navigator.push({
        		      url: utils.getUrl('authority_tips.js'),
        		      animated: "true"
        		  }, event => {
        		      console.log('callback: ', event)
        		  })
			},
			jumpAuthorityAdd(type) {
				// this.$router.push({
				// 	path: "/authority_add",
				// 	query: {
				// 		type: type,
				// 		chainName:this.chainName
				// 	}
				// })
				let data = {type: type,chainName:this.chainName}
				storage.setItem("authority_add",  JSON.stringify(data))
				
				navigator.push({
        		      url: utils.getUrl('authority_add.js'),
        		      animated: "true"
        		  }, event => {
        		      console.log('callback: ', event)
        		  })
			},
			jumpAuthorityEdit(type, edit, accIndex) {
				// this.$router.push({
				// 	path: "/authority_edit",
				// 	query: {
				// 		type: type,
				// 		edit: edit,
				// 		index: accIndex,
				// 		chainName:this.chainName
				// 	}
				// })
				let data = {type: type,chainName:this.chainName,edit: edit,index: accIndex}
				storage.setItem("authority_edit",  JSON.stringify(data))
				
				navigator.push({
        		      url: utils.getUrl('authority_edit.js'),
        		      animated: "true"
        		  }, event => {
        		      console.log('callback: ', event)
        		  })
			},
			async onrefresh(event) {
				// modal.toast({
				// 	message: 'Refreshing',
				// 	duration: 1
				// })
				this.refreshing = true
				// setTimeout(async () => {
					
				// }, 5000)
				console.log("刷新来时")
				this.account = await getCurrentAccountInfo(this.account.account_name, this.chainName);
				if (this.account) {
					storage.setItem("Account", JSON.stringify(this.account), res => {
						console.log("添加刷新账户 - OK")
					})
				}
				console.log("得到数据")
				for (let i = 0; i < this.account.permissions.length; i++) {
					let value = this.account.permissions[i]
					if (value.perm_name == "owner") {
						this.ownerPermission = value.required_auth
					} else {
						this.activePermission = value.required_auth
					}
				}
				console.log("newacc", this.account)
				this.refreshing = false
			},
			onpullingdown() {},
		}
	}
</script>

<style scoped>
	.body {
		max-height: 3000px;
	}

	.navigator {
		border-bottom-width: 1px;
		    border-bottom-color: #C0C0C0;
		    border-bottom-style: solid;
		    background-color: #ffffff;
		    width: 750px;
		    height: 120px;
		    flex-direction: row;
		    justify-content: space-between;
		    align-items: center;
		        padding: 0 20px;
		    /* position: absolute; */
		    top: 0;
	}

	.main {
		/* padding: 0 40px; */
		background-color: #fff;
		/* height: 250px; */
		/* flex-direction: row;
        align-items: center; */
		/* justify-content: center; */
	}

	.authority-title-box {
		height: 100px;
		font-size: 32px;
		padding: 10px 20px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #f2f3f5;

	}

	.authority-title-title {

		font-size: 32px;
		font-weight: bold;
	}

	.authority-title-right {
		flex-direction: row;
		align-items: center;
	}

	.main-top {
		background-color: #FFFFFF;
		padding: 20px;
		border-bottom-width: 1px;
		border-bottom-color: #C0C0C0;
		border-bottom-style: solid;
		flex-direction: row;
		justify-content: space-between;
	}

	.main-middle {
		padding: 20px;
		flex-direction: row;
		align-items: center;
		height: 140px;
		justify-content: flex-start;
		border-bottom-width: 1px;
		border-bottom-color: #C0C0C0;
		border-bottom-style: solid;
	}

	.main-footer {
		padding: 20px;
		border-bottom-width: 1px;
		border-bottom-color: #C0C0C0;
		border-bottom-style: solid;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.main-footer-left {
		font-size: 32px;
		color: gray;
	}

	.main-footer-right {
		font-size: 32px;
		color: #1E90FF;
		background-color: #e6fef1;
		padding: 10px;
		border-radius: 5px;
		text-align: center;

	}

	.note {
		font-size: 32px;
		width: 675px;

	}

	.copy-box-text {
		font-size: 32px;
		color: #1E90FF;
		line-height: 60px;
	}

	.indicator-text {
		color: #888888;
		font-size: 28px;
		text-align: center;
	}

	.indicator {
		margin-top: 16px;
		height: 60px;
		width: 60px;
		color: #00c16b;
		margin-left: 340px;
	}
</style>
