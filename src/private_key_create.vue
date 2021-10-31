<template>
<div class="main" ref="priKeyCr">
	<div class="navigator">
		<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
		<text style="font-size: 36px; color: #1E90FF" >{{zhLan.new_peikey}}</text>
		<image src="" style="height: 40px;width: 40px"></image>
	</div>
    <div  class="content" v-if="step == 1">
        <div class="tips-box">
            <div><text class="tips">{{zhLan.new_tips1}}</text></div>
            <div><text class="tips">{{zhLan.new_tips2}}</text></div>
            <div><text class="tips">{{zhLan.new_tips3}}</text></div>
        </div>
        
        <div>
            <text class="note">{{zhLan.set_password}}</text>
        </div>
        <div>
            <div><input type="password" v-model="password" :placeholder="`${zhLan.prikey_password}`" class="password"></div>
            <div><input type="password" v-model="password2" :placeholder="`${zhLan.repeat_password}`" class="password"/></div>
            <!-- <div><input type="text" v-model="psdTips" :placeholder="`${zhLan.password_tips}`" class="password"/></div> -->
        </div>
        <div class="btn-box">
            <wxc-button size="big" :text="`${zhLan.create_now}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="createPriKey" :disabled="judgeIsDisabled"></wxc-button>
        </div> 
    </div>

	<div class="content"  v-if="step == 2">
		<div class="main-three-it">
			<div style="border-bottom: 1px solid #9c9c9c; height:200px;padding:10px 0">
				<div class="main-three-item">
					<text class="main-three-item-title">{{zhLan.pubkey}}</text>
					<text class="main-three-item-content">{{publicKey}}</text>
				</div>
				<div class="copy-box">
					<div class="copy-box-item" @click="copy(1)">
						<text class="copy-box-text">{{zhLan.copy}}</text>
						<image :src="`${imgSrc}copy`" mode="" style="height: 28px;width: 28px; margin-left: 10px;"></image>
					</div>
				</div>	
			</div>
			<div style="height:200px;padding:10px 0 10px 0">
				<div class="main-three-item">
					<text class="main-three-item-title">{{zhLan.prikey}}</text>
					<text class="main-three-item-content">{{privateKey}}</text>
				</div>
				<div class="copy-box">
					<div class="copy-box-item" @click="copy(2)">
						<text class="copy-box-text">{{zhLan.copy}}</text>
						<image :src="`${imgSrc}copy`" mode="" style="height: 28px;width: 28px; margin-left: 10px;"></image>
					</div>
				</div>	
			</div>
		</div>
		<div class="tips-box2">
			<text class="tips-title2">{{private_key_backup.important_tips}}</text>
			<text class="tips2">{{private_key_backup.important_tips1}}</text>
			<text class="tips2">{{private_key_backup.important_tips2}}</text>
			<text class="tips2">{{private_key_backup.important_tips3}}</text>
			<text class="tips2">{{private_key_backup.important_tips4}}</text>
		</div>

		<div class="btn-box">
            <wxc-button size="big" :text="btnTxt"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="saveKeyToLocal" :disabled="isbackup">
			</wxc-button>
        </div> 
    </div>		
</div>
	
</template>

<script>
	import { WxcButton, WxcMinibar, WxcCountdown } from 'weex-ui';
	import { CheckPrivateKeyValid, genPublicKey,createKey } from './utils/base'
	import { encryptKey, genPwdMd5 } from './utils/auth'
	import { AESKey, getStorage } from './utils/config_v2'
	import { getAccountByPublicKey, addLocalAccount, getCurrentAccountInfo } from './utils/account'
	import { imgSrc } from "./utils/config";
	const animation = weex.requireModule('animation')
	const modal = weex.requireModule('modal')
	const clipboard = weex.requireModule('clipboard')
	const navigator = weex.requireModule('navigator')
 	const utils = require('./appUtils')
	const globalLan = require('./utils/language/global')
	export default {
		components: { WxcButton, WxcMinibar, WxcCountdown },
		data() {
			return {
				imgSrc: imgSrc,
				password:"",
				password2:"",
				psdTips:"",
				width: "100%",
				borderColor: "",
				borderRadius: "",
				height: "100px",
				backgroundColor:"#1E90FF",
				fontSize: '35px',
				color: "#ffffff", 
				privateKey: "",
				publicKey: "",
				times:10,
				btnTxt:"",
				isbackup: true,
        		globalLan:globalLan,
				zhLan:{},
				private_key_backup:{},
				step: 1
				// btnTx: "60",
			};
		},
		    mounted() {
        var testEl = this.$refs.priKeyCr;
        animation.transition(testEl, {
            styles: {
                color: '#FF0000',
                opacity: 1
            },
            duration: 800, //ms
            timingFunction: 'ease',
            delay: 0 //ms
            }, function () {
        })
    },
		computed:{
			btnStyle () {
				const { width, height, backgroundColor, borderColor, borderRadius } = this;
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
			textStyle () {
				const { fontSize, color } = this;
				const customStyle = {};
				if (fontSize) {
					customStyle.fontSize = fontSize;
				}	
				if (color) {
					customStyle.color = color;
				}
				return {
					fontSize, color
				}
			},
			judgeIsDisabled() {
				if(!this.password) {
					return true
				}
				if (!this.password2) {
					return true
				}
				if (this.password != this.password2) {
					return true
				}
				return false
			},
		},
		watch: {
			times(val) {
				console.log("获取到时间了"+val)
				if(val == 0) {
						this.btnTxt = "我已做好备份"
						this.isbackup = false
				}
			}
		},
		async created() {
    		//语言包
    		let lan = await getStorage('lan')
    		let zhLan = {}
    		if(!lan) {
    		  lan = 'zh-CN'
    		}

			this.zhLan = await this.globalLan.lang("private_key_create", lan)
			this.private_key_backup = await this.globalLan.lang("private_key_backup", lan)
			this.modelLan = await this.globalLan.lang("modal", lan)
				
		},
		methods:{
            goBack() {
        		const lanSet = new BroadcastChannel('account_refresh')
				lanSet.postMessage('refresh')
        		navigator.pop({
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})
            },
			async createPriKey(e) {
				const { type, disabled } = e;
				console.log(disabled)
				if(disabled) {
					return
				}
				if (this.password.length < 8){
					modal.toast({
						message: this.modelLan.password_atleast,
						duration: 2
					})
					return
				}
				var a = /[0-9]/
				var b = /[a-zA-Z]/
				var hasNum = a.test(this.password)
				var hasChar = b.test(this.password)

				if (!(hasNum && hasChar)){
					modal.toast({
						message: this.modelLan.password_toosimple,
						duration: 2
					})
					return
				}

				let key = await createKey()
				console.log("获取到的钥匙串：", JSON.stringify(key))
				this.privateKey = key.privateKey
				this.publicKey = key.publicKey

				// 加密私钥
				let enPrekey = await encryptKey(this.password, this.publicKey, this.privateKey)
				if(!enPrekey) {
					modal.toast({
						message: this.modelLan.prikey_createfail,
						duration: 2
					})
					return
				}

				// 加密密码
				let enPwd = await genPwdMd5(this.password)
				if(!enPwd) {
					modal.toast({
						message: this.modelLan.prikey_createfail,
						duration: 2
					})
					return					
				}

				// 构建账号信息数据
				let account = {
					PublicKey: this.publicKey,
					PrivateKeyEncrypt: enPrekey.ciphertext,
					PasswordEncrypt: enPwd,
					Accounts: []
				}

				// 账号信息保存到本地
				await addLocalAccount(account)
				modal.toast({
					message: this.modelLan.prikey_createsuccess,
					duration: 2
				})

				this.step = 2	
				this.timer = setInterval(()=>{
					this.times--
					if(this.times===0){
						clearInterval(this.timer)
						return
					}
					this.btnTxt = "请做备份 ( " + (this.times).toString() + " )"
				},1000)			
			},
			copy(e) {
				if(e == 1) {
                    clipboard.setString(this.publicKey)
                } else if (e == 2) {
                    clipboard.setString(this.privateKey)
                }

                modal.toast({
                    message: this.modelLan.copy_success,
                    duration: 2
                })
            },

			async saveKeyToLocal() {
				// this.$router.go(-1)
        		navigator.pop({
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})
			}
		}
	}
</script>

<style scoped >
	.navigator {
    	border-bottom-width: 1px;
		border-bottom-color: #C0C0C0;
		border-bottom-style: solid;
		width: 750px;
        height: 120px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
		background-color: #ffffff;
	}
	.main {
		background-color:#f2f3f5;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		opacity: 1;
	}
	.content{
		padding: 20px;	
	}
	.tips-box {
		background-color: #e3e3e3;
		padding: 20px;
		border-radius: 10px;
	}
	.tips {
		font-size: 20px;
		letter-spacing: 1px;
		line-height: 35px;
		color: #555555;
	}
	.prikey {
		border-width:1px;  
		border-color:#C0C0C0;  
		border-style:solid;  
		margin-top: 50px;
		border-radius: 10px;
		height: 120px;
		font-size: 32px;
		padding: 10px;
		padding-top: 20px;
		margin-bottom: 50px;
	}
	
	.note {
		font-size: 36px;
		margin: 50px 0;
        
	}
	
	.password {
		font-size: 32px;
		margin-bottom: 60px;
		border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
		padding-left: 20px;
		padding-bottom: 10px;
        outline: none;
		background-color: #f2f3f5;
		height: 80px;
	}
	.btn-box {
		margin-top: 50px;
	}

	.main-three-it {
        background-color: #fff;
        padding: 0 20px;
        height: 400px;
        /* box-shadow: 2px 2px 4px -1px gray; */
        border-radius: 10px;
    }

    .main-three-item {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 110px;
    }

    .main-three-item-title {
        width: 75px;
		font-size: 36px;
    }

    .main-three-item-content {
        width: 580px;
		font-size: 32px;
    }

    .copy-box {
        height: 60px;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-right: 50px;
        margin-bottom: 10px;
    }

    .copy-box-item {
        flex-direction:row;
        align-items:center
    }
    .copy-box-text {
        font-size: 32px;
        color: #1E90FF;
        line-height: 60px;
    }

	.tips-box2 {
		padding: 40px;
	}
	.tips-title2 {
		font-size: 36px;
	}
	.tips2 {
		font-size: 32px;
	}
</style>
