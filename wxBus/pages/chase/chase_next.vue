<template>
	<view>
		<view class="wx_content">
			<view class="wx_logo">
				<image src="../../static/logo_01.png" mode=""></image>
				<text>服务热线：83161116</text>
			</view>
			<view class="wx_title">微信服务受理个人中心</view>
			<view class="wx_list" v-for="(item,index) in newFriends" :key="index">
				<view class="wx_list_ul">
					<view class="wx_list_nav">
						<view class="wx_list_nav_text">流水号:</view>
						<text @click="showDetails(item)">{{item.number}}(点击查看更多内容)</text>
						<view class="button" @click="showRevoke(item)" v-if="item.vxStatus != '已取消'">撤销</view>
						<view class="isButton" v-if="isBut">已撤销</view>
					</view>
					<view class="wx_status">处理状态：{{item.vxStatus}}</view>
				</view>
				<!-- 弹框1 -->
				<view class="wx_model" v-show="item.isRevoke">
					<view class="wx_model_text">确认要撤销吗？</view>
					<view class="wx_model_text">流水号{{item.number}}</view>
					<view class="wx_model_btn">
						<view class="wx_model_btn_left" @tap="revoke(item.id)">确认</view>
						<view class="wx_model_btn_right" @tap="close(item)">取消</view>
					</view>
				</view>
				<view class="wx_ul" v-show="item.isShow">
					<view class="wx_li">
						<view class="">信访日期:</view>	
						<text>{{item.visitTime}}</text>
					</view>
					<view class="wx_li">
						<view class="">您的姓名:</view>	
						<text>{{item.visiter}}</text>
					</view>
					<view class="wx_li">
						<view class="">您的手机号:</view>	
						<text>{{item.telephone}}</text>
					</view>
					<view class="wx_li">
						<view class="">公交线路:</view>	
						<text>{{item.busLine}}</text>
					</view>
					<view class="wx_li">
						<view class="">车辆编号:&nbsp;粤B</view>	
						<text>{{item.busNumber}}</text>
					</view>
					<view class="wx_li">
						<view class="">事件发生时间:</view>	
						<text>{{item.eventTime}}</text>
					</view><view class="wx_li">
						<view class="">上车站点:</view>	
						<text>{{item.intoSite}}</text>
					</view>
					<view class="wx_li">
						<view class="">下车站点:</view>	
						<text>{{item.outSite}}</text>
					</view>
					<view class="wx_li">
						<view class="">驾驶员:</view>	
						<text>{{item.driver}}</text>
					</view>
					<view class="wx_li">
						<view class="">乘务员:</view>	
						<text>{{item.crewMember}}</text>
					</view>
					<view class="wx_li">
						<view class="">深圳通卡号:</view>	
						<text>{{item.cardNumber}}</text>
					</view>
					<view class="wx_li">
						<view class="">是否答复:</view>	
						<text>{{item.whetherReply}}</text>
					</view>
					<view class="wx_li_textarea">
						<view class="">信访内容:</view>	
						<text class="textarea">{{item.content}}</text>
					</view>
					<view class="wx_file">
						<view class="wx_files">文件:</view>	
						<view class="img_list">
							<view class="img_deails"> 
								<image :src="src" v-for="(src, index) in item.imgLists" :key="index"></image>
								<video :src="item.vedio" controls v-if="item.vedio"></video>
							</view>   
						</view>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>
<script>
	var user = uni.getStorageSync('user');
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		comments: {uniPopup},
		data() {
			return {
				uuid: '',
				id: '',
				list:[],
				// 隐藏显示
				show: false,
				isShow: false,
				isBut: false,
				reke: true,
				item: {
					vxStatus: '',
					status: '',
					number: '',
					visiter: '',
					telephone: '',
					busLine: '',
					busNumber: '',
					visitTime: '',
					eventTime: '',
					intoSite: '',
					outSite: '',
					driver: '',
					crewMember: '',
					cardNumber: '',
					whetherReply: '',
					content: '',
					pictureOne: '',
					pictureTwo: '',
					vedio: ''
				},
				
			}
		},
		onLoad(option) {
			this.uuid = option.uuid;
			// 撤销
			// this.revoke();
			// 获取数据
			this.getNews();
		},
		onShow() {
			this.item = uni.getStorageSync('item') 
		},
		onPullDownRefresh() {
			this.getNews();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		computed: {
			newFriends() {
				//对后台返回的数据进行加工，添加isShow字段，用来控制列表的显示隐藏
				return this.list.map(item =>{
					this.$set(item, "isShow", false)
					this.$set(item, "isRevoke", false)
					return item
				})
			},
		},
		methods: {
			// 隐藏显示
			showDetails(e) {
				// 存储点击那一项的状态
				const nowStatu = e.isShow
				// 将每一项列表的isShow设置为false,让所有的列表都隐藏
				this.list.forEach(item=> {
					item.isShow = false
				})
				// 用于再次点击该项的取反
				e.isShow =! nowStatu
			},
			showRevoke(e) {
				const nowStatu = e.isRevoke
				// 将每一项列表的isShow设置为false,让所有的列表都隐藏
				this.list.forEach(item=> {
					item.isRevoke = false
				})
				// 用于再次点击该项的取反
				e.isRevoke =! nowStatu
			},
			// 弹框
			modelSubmit() {
				this.show = false
				this.isShow = true
			},
			close(e) {
				const nowStatu = e.isRevoke
				// 将每一项列表的isShow设置为false,让所有的列表都隐藏
				this.list.forEach(item=> {
					item.isRevoke = false
				})
				// 用于再次点击该项的取反
				e.isRevoke =! nowStatu
			},
			// 获取数据
			getNews() {
				console.log(this.uuid)
				uni.showNavigationBarLoading();
				var url = this.$url + 'workList';
				uni.request({
					url: url,
					data: {
						id: this.id,
						uuid: this.uuid,
						whetherReply: this.whetherReply
					},
					method: 'GET',
					success: res => {
						var newsObj = res.data;
						newsObj.forEach(item => {
							if (item.vxStatus == 0) {
								item.vxStatus = '未取消';
							} else if (item.vxStatus == 1) {
								item.vxStatus = '已取消';
							}
							if (item.status == 0) {
								item.status = '未分配';
							} else if (item.status == 1) {
								item.status = '已分配';
							} 
							if (item.whetherReply == 1) {
								item.whetherReply = '否';
							} else if (item.whetherReply == 2) {
								item.whetherReply = '是';
							}
						});
						res.data.map(item=>{
							let arr = []
							if(item.pictureOne){
								arr.push(item.pictureOne)
							}
							if(item.pictureTwo){
								arr.push(item.pictureTwo)
							}
							this.$set(item,'imgLists',arr)
							// if(item.vedio){
							// 	arr.push(item.vedio)
							// }
							// this.$set(item,'vedio',arr)
						})
						this.list = res.data;   
						this.list.reverse();
						// uni.showToast({
						// 	icon: 'none',
						// 	title: res.data.msg
						// });
						uni.stopPullDownRefresh();
						uni.hideNavigationBarLoading();
					},
					fail: (data, code) => {
						uni.showToast({
							icon: 'none',
							title: '網絡異常'
						});
						uni.stopPullDownRefresh();
						return false;
					}
				});
			},
			// 撤销数据接口
			revoke(id) {
				console.log(id)
				var url = this.$url + 'backWork';
				uni.request({
					url: url,
					data: {
						id: id,
						uuid: this.uuid,
					},
					method: 'GET',
					success: res => {
						this.list.forEach(item=> {
							item.isRevoke = false
						})
						// uni.showToast({
						// 	icon: 'none',
						// 	title: res.data.msg
						// });
						this.getNews();
						// 返回
						// setTimeout(() => {
						// 	uni.navigateBack({
						// 		delta: 1
						// 	});
						// }, 3000);
					},
					fail: (data, code) => {
						uni.showToast({
							icon: 'none',
							title: '網絡異常'
						});
						uni.stopPullDownRefresh();
						return false;
					}
				});
			},
		}
	}
</script>
<style lang="scss" scoped>
	.wx_content {
		width: 100%;
		height: auto;
		font-size: 14px;
	}
	.wx_logo {
		height: 40px;
		line-height: 40px;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		padding: 10px 10px;
	}
	.wx_logo image {
		width: 50%;
		height: 40px;
	}
	.wx_logo text {
		font-size: 15px;
		font-weight: 600;
		color: #bf363d;
		margin-left: 10px;
	}
	.wx_title {
		font-size: 16px;
		font-weight: bold;
		text-align: center;
		color: #538DBB;
	}
	.wx_list {
		width: 90%;
		height: auto;
		margin: 10px auto;
		border: 1px solid #F5F5F5;
		border-radius: 5px;
		background-color: #fff;
	}
	.wx_list_ul {
		width: 100%;
		border: 1px solid #F5F5F5;
		background-color: #F5F5F5;
		border-radius: 5px 5px 0 0;
	}
	.wx_list_nav {
		height: 40px;
		line-height: 40px;
		display: flex;
		padding-left: 5px;
	}
	.wx_list_nav text {
		padding-left: 5px;
	}
	.wx_list_nav .button {
		width: 50px;
		height: 30px;
		line-height: 30px;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #DA5550;
		text-align: center;
		color: #fff;
		right: 20px;
		position: absolute;
		margin: 5px auto;
	}
	.isButton {
		width: 50px;
		height: 30px;
		line-height: 30px;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #76BDDB;
		text-align: center;
		color: #fff;
		right: 20px;
		position: absolute;
		margin: 5px auto;
	}
	.wx_status {
		margin-left: 10px;
		right: 6px;
		position: relative;
		bottom: 3px;
		color: #DA5550;
	}
	.wx_ul {
		width: 90%;
		height: auto;
		margin: 10px auto;
	}
	.wx_li {
		width: 100%;
		height: 30px;
		line-height: 30px;
		display: flex;
	}
	.wx_li text {
		padding-left: 10px;
	}
	.wx_li_textarea {
		width: 100%;
	}
	.textarea {
		width: 100%;
		height: auto;
		font-size: 12px;
		word-wrap: break-word;
		word-break: break-all;
	}
	.wx_model {
		position: fixed;
		z-index: 999;
		width: 80%;
		max-width: 300px;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%,-50%);
		transform: translate(-50%,-50%);
		background-color: #fff;
		text-align: center;
		border-radius: 3px;
		overflow: hidden;
		border: 1px solid #eee;
	}
	.wx_model_text {
		padding: 1.3em 1.6em 1.3em;
		font-size: 15px;
		color: #000;
		overflow-y: auto;
		border-bottom: 1px solid #eee;
	}
	.wx_model_btn {
		position: relative;
		line-height: 48px;
		font-size: 18px;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}
	.wx_model_btn_left {
		width: 50%;
	}
	.wx_model_btn_right {
		display: block;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		color: #3cc51f;
		text-decoration: none;
		-webkit-tap-highlight-color: rgba(0,0,0,0);
		position: relative;
	}
	.wx_model_btn_right:after {
	    content: " ";
	    position: absolute;
	    left: 0;
	    top: 0;
	    width: 1px;
	    bottom: 0;
	    border-left: 1px solid #d5d5d6;
	    color: #d5d5d6;
	    -webkit-transform-origin: 0 0;
	    transform-origin: 0 0;
	    -webkit-transform: scaleX(.5);
	    transform: scaleX(.5);
	}
	.img_list {
		margin-top: 20upx;
	}
	.wx_file {
		// width: 90%;
		height: auto;
		line-height: 30px;
		// display: flex;
		margin: 10px auto;
	}
	.wx_files {
		width: 50px;
	}
	// .img_deails {
	// 	display: flex;
	// }
	.img_deails image {
		width: 100px;
		height: 100px;
		margin-left: 5px;
	}
	.img_deails video {
		width: 100px;
		height: 100px;
		margin-left: 5px;
	}
</style>