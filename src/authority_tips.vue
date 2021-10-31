<template>
	<div class="main" ref="authorityMain">
		<!-- <div class="navigator">
        <wxc-minibar title="权限说明"
        background-color="#FFFFFF"
        text-color="#4ba363"
        @wxcMinibarLeftButtonClicked="goBack"
        ></wxc-minibar>
    </div> -->
		<div class="navigator">
			<image :src="`${imgSrc}back_blue`" style="height: 60px;width: 60px;" @click="goBack"></image>
			<text style="font-size: 36px; color: #1E90FF">权限说明</text>
			<image src="" style="height: 60px;width: 60px"></image>
		</div>

		<scroller :style="scrollerStyle">
			<div class="tips-box">
				<div class="tips-box-header">
					<text style="line-height:65px;font-size:28px">什么是账号的角色？</text>
				</div>
				<div class="tips-box-content">
					<text class="content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这里的[角色]是指拥有某个账号一个或多个操作权限的集合名称，每个账号创建时默认有两个角色，分别为owner和active，这两个角色的名称是不可更改的，也是不可删除的。在这两个角色的基础上，可以新建其他名字的角色，与此同时也可以授予这个新角色一个、多个或者所有操作权限。
					</text>
				</div>
			</div>


			<div class="tips-box">
				<div class="tips-box-header">
					<text style="line-height:65px;font-size:28px">不同角色之间有什么关系？</text>
				</div>
				<div class="tips-box-content">
					<text class="content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;所有的角色之间都是层级或者平级关系，owner 是最顶级，拥有最高的操作权，active 属于其下一级。
					</text>
				</div>
			</div>
			<div class="tips-box">
				<div class="tips-box-header">
					<text style="line-height:65px;font-size:28px">什么是 owner 角色？</text>
				</div>
				<div class="tips-box-content">
					<text class="content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;owner拥有账户所有权，也就是最高级的管理权限，拥有所有权限，以及管理其他角色的权限。
					</text>
				</div>
			</div>

			<div class="tips-box">
				<div class="tips-box-header">
					<text style="line-height:65px;font-size:28px">为什么默认要有一个 active 角色？</text>
				</div>
				<div class="tips-box-content">
					<text class="content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;active角色除了不能管理其他( owner 新建的)同级的角色和 owner 外，其权限等同于 owner ，用于日常使用，比如转账、投票等。active这一角色的设计初衷是为了和 owner 作为区分，假设一个账号的 active 和 owner 设置了不同的公钥，则可将owner的私钥保存到安全的地方，平时只需要用 active 操作，如果 active的私钥泄漏了，则还可以用owner来重设active的公钥，不至于丢失账号。反之，如果只有一个 owner 角色，则其私钥丢失后，则账号也可能会随之丢失。
					</text>
				</div>
			</div>

			<div class="tips-box">
				<div class="tips-box-header">
					<text style="line-height:65px;font-size:28px">什么是权重阈值？</text>
				</div>
				<div class="tips-box-content">
					<text class="content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;权重阈值，是使用该角色的最低权重要求。
					</text>
				</div>
			</div>

			<div class="tips-box">
				<div class="tips-box-header">
					<text style="line-height:65px;font-size:28px">什么是权重？</text>
				</div>
				<div class="tips-box-content">
					<text class="content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[权重]是配合[权重阈值]使用的，例如一个角色，其权重阈值被设置为2，其下分别有两个权重都为1的公钥，则要使用这个角色操作时，需要同时使用到这两个公钥对应的私钥，因为两个的权重加起来才等于权重阈值。也就是操作的总权重必须大于或等于权重阈值，才能使用某角色。。
					</text>
				</div>
			</div>
		</scroller>
	</div>
</template>

<style scoped>
	.main {
		align-items: center;
		opacity: 1;
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

	.tips-box {
		margin: 10px 0;
		padding: 10px;
		/* height: 400px; */
		width: 712.5px;
		background-color: #ffffff;
		border-radius: 10px;
		/* box-shadow:2px 6px 4px -2px gray; */
	}

	.choice-box-item-left {
		flex-direction: row;
		line-height: 100px;
	}

	.tips-box-header {
		padding: 0px 20px 10px 20px;
		height: 80px;
		flex-direction: row;
		align-items: center;

	}

	.tips-box-content {
		padding: 0px 20px;
		width: 712.5px;
		/* background-color:blueviolet; */
		/* flex-direction: row; */
		/* justify-content: center; */
		/* border-bottom-width: 1px;
    border-bottom-color: #C0C0C0;
    border-bottom-style: solid;
    align-items: center; */
	}

	.content {
		font-size: 26px;
		line-height: 45px;
		letter-spacing: 2px;
	}
</style>
<script>
	import {
		WxcMinibar,
		Utils
	} from 'weex-ui';
	import {
		imgSrc
	} from "./utils/config";
	const animation = weex.requireModule('animation')
    const navigator = weex.requireModule('navigator')
    const utils = require('./appUtils')
	
	export default {
		components: {
			WxcMinibar
		},
		data() {
			return {
				imgSrc: imgSrc,
				scrollerH: "",
			}
		},
		mounted() {
		    var testEl = this.$refs.authorityMain;
			console.log(testEl)
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
		beforeCreate() {
			const tabPageHeight = Utils.env.getPageHeight();
			console.log("获取到高度" + tabPageHeight)
			this.scrollerH = (tabPageHeight) + 'px'
			this.scrollerStyle = {
				height: this.scrollerH,
			}
		},
		created() {

		},
		methods: {
			goBack() {
				// this.$router.go(-1)
        		navigator.pop({
        		    animated: "true"
        		}, event => {
        		    console.log('callback: ', event)
        		})
			},
		}
	};
</script>
