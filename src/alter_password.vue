<template>
<div class="body" ref="alter">
	<div class="navigator">
		<image :src="`${imgSrc}back_blue`"  style="height: 60px;width: 60px;" @click="goBack"></image>
		<text style="font-size: 36px; color: #1E90FF;" >{{zhLan.alter_prikey}}</text>
		<image src="" style="height: 60px;width: 60px"></image>
	</div>
	<div class="main">
		<div>
			<div class="password-item">
				<input type="password" v-model="oldPassword" :placeholder="`${zhLan.oldprikey}`" key="01" class="password" v-if="!shows[0]">
				<input type="text" v-model="oldPassword" :placeholder="`${zhLan.oldprikey}`" key="02" class="password" v-if="shows[0]">
				<div class="password-img" @click="showpass(0)">
					<image :src="passImgs[0]" mode="" style="height: 28px;width: 28px; margin-left: 10px;"  ></image>
				</div>
			</div>
			<div class="password-item">
				<input type="password" v-model="password" :placeholder="`${zhLan.newprokey}`" key="11" class="password" v-if="!shows[1]" @focus="showTips">
				<input type="text" v-model="password" :placeholder="`${zhLan.newprokey}`" key="12" class="password" v-if="shows[1]" @focus="showTips">
				<div class="password-img" @click="showpass(1)">
					<image :src="passImgs[1]" mode="" style="height: 28px;width: 28px; margin-left: 10px;"  ></image>
				</div>
			</div>
			<div class="password-item">
				<input type="password" v-model="password2" :placeholder="`${zhLan.repeat_prikey}`" key="21" class="password" v-if="!shows[2]">
				<input type="text" v-model="password2" :placeholder="`${zhLan.repeat_prikey}`" key="22" class="password" v-if="shows[2]">
				<div class="password-img" @click="showpass(2)">
					<image :src="passImgs[2]" mode="" style="height: 28px;width: 28px; margin-left: 10px;"  ></image>
				</div>
			</div>
			<!-- <div class="password-item1">
				<div><input type="text" v-model="psdTips" :placeholder="`${zhLan.passowrd_tips}`" class="password"/></div>
				
			</div> -->
			<div style="margin-bottom:30px;padding-left:10px">
				<text style="color:red;font-size:24px" v-if="isShowTips">{{zhLan.show_tips}}</text>
			</div>
		</div>
		<div class="tips">
			<text class="tips-left">{{zhLan.forget_password}}</text>
			<text class="tips-right" @click="goImport">{{zhLan.importnow}}</text>
		</div>
		<div class="btn-box">
			<wxc-button size="big" :text="`${zhLan.comfirm}`"  :textStyle="textStyle" :btnStyle="btnStyle" style="margin:0 auto" @wxcButtonClicked="UpdateSubmit" :disabled="judgeIsDisabled"></wxc-button>
		</div>
	</div>	
</div>
	
</template>

<script>
	import { WxcButton, WxcMinibar} from 'weex-ui';
	import {updatePassword} from './utils/account_v2'
	import { imgSrc, getStorage } from "./utils/config_v2";
	const modal = weex.requireModule('modal')
	const animation = weex.requireModule('animation')
    const navigator = weex.requireModule('navigator')
    const utils = require('./appUtils')
	const globalLan = require('./utils/language/global')
	export default {
		components: { WxcButton,WxcMinibar },
		data() {
			return {
				shows:[ false, false, false],
                passImgs:[imgSrc+"eye", imgSrc+"eye", imgSrc+"eye"],
                oldPassword: "",
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
                passImg: imgSrc+"eye",
				passType: "password",
				publicKey: "",
				imgSrc: imgSrc,
        		globalLan:globalLan,
				modalLan:{},
				zhLan:{},
				chain:"",
				isShowTips: false
			};
		},
		mounted() {
			var testEl = this.$refs.alter;
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
				if(!this.oldPassword) {
					return true
				}
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
		async created() {
			let param = JSON.parse(await getStorage("alter_password"))
			this.publicKey = param.publicKey;
			this.chain = param.chain;
    		//语言包
    		let lan = await getStorage('lan')
    		let zhLan = {}
    		if(!lan) {
    		  lan = 'zh-CN'
    		} 

			this.zhLan = await this.globalLan.lang("alter_password", lan)
			this.modelLan = await this.globalLan.lang("modal", lan)
		},
		methods:{
			goBack() {
        		navigator.pop({
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})				
			},
			showTips() {
				this.isShowTips = true
			},
			async UpdateSubmit(e) {
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
				var b = /[a-z]/
				var hasNum = a.test(this.password)
				var hasChar = b.test(this.password)

				if (!(hasNum && hasChar)){
					modal.toast({
						message: this.modelLan.password_toosimple,
						duration: 2
					})
					return
				}

				let isSuccess = await updatePassword(this.publicKey, this.chain, this.oldPassword, this.password)
				if(!isSuccess) {
					modal.toast({
						message: this.modelLan.password_update_fail,
						duration: 2
					})
					return
				}
				modal.toast({
					message: this.modelLan.password_update_success,
					duration: 2
				})
        		navigator.pop({
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})
            },
            showpass(e) {
                console.log("显示"+e)
				let passImg = ""

				this.$set(this.shows, e, !this.shows[e])
				if(this.shows[e]) {
					passImg = imgSrc+"close_eye"
						this.$set(this.passImgs, e, passImg)
				} else {
					passImg = imgSrc + "eye"
					this.$set(this.passImgs, e, passImg)
				}
                console.log(this.shows[e])
			},
			goImport() {
        		navigator.push({
        		    url: utils.getUrl('private_key_import.js'),
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})
			}
		}
	}
</script>

<style scoped >
.alter {
	opacity: 1;
}
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
		padding: 60px 40px 40px 40px;	
	}
	.password-item {
        flex-direction: row;
        border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
        justify-content: space-between;
        margin-bottom: 60px;
        padding: 0 10px;	
    }

	.password-item1 {
        flex-direction: row;
        border-bottom-width:1px;
		border-bottom-color:#C0C0C0;  
		border-bottom-style:solid; 
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 0 10px;	
    }
	.password {
		font-size: 32px;
        padding: 0 0 20px 20px;
        outline: none;
		width: 600px;


	}
	.tips {
		flex-direction: row;
		justify-content: center;
		height: 60px;
		align-items: center;
	}
	.tips-left {
		color: gray;
		font-size: 28px;
	}
	.tips-right {
		color: #1E90FF;
		font-size: 32px;
	}
	.btn-box {
		margin-top: 50px;
	}
</style>
