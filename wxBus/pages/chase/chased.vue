<template>
	<view>
		<view class="wx_content">
			<view class="wx_nav"><image src="../../static/bannerbus.png" mode=""></image></view>
			<view class="wx_logo">
				<image src="../../static/logo_01.png" mode=""></image>
				<text>服务热线：83161116</text>
			</view>
			<view class="wx_list">
				<view class="wx_title">微信服务受理</view>
				<view class="wx_ul">
					<view class="wx_li">
						<text>流水号:</text>
						<view class="wx_data">C{{ number }}</view>
					</view>
				</view>
				<view class="wx_ul">
					<view class="wx_li">
						<text>信访日期:</text>
						<view class="model" v-model="visitTime">
							<ruiDatePicker
								class="model_on"
								fields="second"
								start="2010-00-00 00:00:00"
								end="2030-12-30 23:59:59"
								:value="value"
								@change="bindChangevisitTime"
								disabled
							></ruiDatePicker>
						</view>
					</view>
				</view>
				<view class="wx_ul">
					<view class="wx_li">
						<i>*</i>
						<text>信访人姓名:</text>
						<input type="text" v-model="visiter" placeholder="请输入信访人姓名"/>
					</view> 
					<view class="wx_li">
						<i>*</i>
						<text>联系电话:</text>
						<input type="text" v-model="telephone" name="telephone" placeholder="请输入您的联系电话" maxlength=11/>
					</view>
					<view class="wx_li" @tap="selectZLpicker">
						<!-- <i>*</i> -->
						<text class="line_wx">公交线路:</text>
						<input v-if="shaowBtn" type="text" placeholder="请选择公交线路" v-on:input ="getLineSites"/>
						<view class="wx_line">
							{{ busLine }}
						</view>
						<!-- <image src="../../static/delete.png" mode=""></image> -->
						<uni-icons @click="resetLine()" v-if="busLine != ''" class="icon-close" type="close" size="20"></uni-icons>
					</view>
					<view class="wx_li">
						<i>*</i>
						<text>车辆编号:&nbsp;粤B</text>
						<input type="text" v-model="busNumber" placeholder="请输入车辆编号"/>
					</view>
					<view class="wx_li">
						<i>*</i>
						<text>事件发生时间:</text>
						<view class="model">
							<KXDateTime class="model_on" :data='date' :start='startdate' @rundata='kxdatetime'></KXDateTime>
						</view>
					</view>
					<view class="wx_li">
						<i>*</i>
						<text>上车站点:</text>
						<input type="text" v-model="intoSite" placeholder="请输入上车站点" />
					</view>
					<view class="wx_li">
						<i>*</i>
						<text>下车站点:</text>
						<input type="text" v-model="outSite" placeholder="请输入下车站点" />
					</view>
					<view class="wx_li">
						<text>驾驶员:</text>
						<input type="text" v-model="driver" placeholder="请输入驾驶员名字" />
					</view>
					<view class="wx_li">
						<text>乘务员:</text>
						<input type="text" v-model="crewMember" placeholder="请输入乘务员名字" />
					</view>
					<view class="wx_li">
						<text>深圳通卡号:</text>
						<input type="text" v-model="cardNumber" placeholder="请输入深圳通卡号" />
					</view>
					<view class="wx_li">
						<i>*</i>
						<text>是否答复:</text>
						<view class="model" v-model="whetherReply">
							<picker class="model_on" @change="bindPickerChange" :value="index" :range="array">
								<view class="uni-input">{{ array[index] }}</view>
							</picker>
						</view>
					</view>
					<view class="wx_contents">
						<text>信访内容:</text>
						<textarea v-model="content" maxlength="1000" minlength="30" placeholder="信访内容或者提出的建议不少于30个字" />
					</view> 
					<!-- clearable @keyup.native="inputChange($event)" @keydown.native="inputChange($event)" -->
				</view>
				<!-- 图片上传 --><!-- 信息提交 -->
				<view class="burst-wrap">
					<view class="burst-wrap-bg">
						<view>
							<view class="burst-info">
								<view class="uni-uploader-body">
									<view class="uni-uploader__files">
										<block v-for="(image,index) in imageList" :key="index">
											<view class="uni-uploader__file">
												<view @tap="delect(index)" class="delectVideo">
													<image src="../../static/del.png" mode=""></image>
												</view>
												<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage" mode=""></image>
											</view>
										</block>
										<view class="uni-uploader__file" v-if="src">
											<view class="uploader_video">
												<view @tap="delectVideo" class="delectVideo">
													<image src="../../static/del.png" mode=""></image>
												</view>
												<video :src="src" class="video"></video>
											</view>
										</view> 
										<view class="uni-uploader__input-box" v-if="VideoOfImagesShow">
											<view class="uni-uploader__input" @tap="chooseVideoImage"></view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- <input id="files" type="file" multiple="multiple" name="file" style="width: 100%;border: 1px solid #ccc;" /> -->
				<view class="wx_submit"><button type="grey" @tap="submit()" @click="$noMultipleClicks()">确认提交</button></view>
				<!-- <view class="wx_submit"><button type="primary" @tap="modelSubmit">确认提交</button></view> -->
				<!-- 弹框1 -->
				<view class="wx_model" v-if="show">
					<view class="wx_model_text">您的信访流水号为C{{ number }},我们将在10个工作日内联系您,请保持电话畅通,有任何疑问,欢迎拨打我们的服务热线83161116反映,谢谢!</view>
					<view class="wx_model_btn">
						<view class="wx_model_btn_left" @tap="modelSubmit()">确认</view>
					</view>
				</view>
				<!-- 弹框2 -->
				<view class="wx_model" v-if="isShow">
					<view class="wx_model_text">虽然您不需要答复,但为了到位处理您反映的问题,以改进不足,我们可能有需要联系您,以补充完善相关信息,有任何疑问,欢迎拨打我们的服务热线83161116反映,谢谢!</view>
					<view class="wx_model_btn">
						<view class="wx_model_btn_left" @tap="modelSubmit()">确认</view>
					</view>
				</view>
				<!-- 弹框3 -->
				<view class="mask" v-if="isShowDialog"></view>
				<view class="wx_model" v-if="nowShow">
					<view class="wx_model_text">“请确保信访内容详实有效,且与巴士集团服务业务相关,否则有可能不予回复,详情可咨询83161116”。</view>
					<view class="wx_model_text" style="color: #FF3c3c;">提示:带*的为必填项,<i>如果有具体的相关内容输入,请先删除字样"无",再输入相关内容。</i></view>
					<view class="wx_model_btn">
						<view class="wx_model_btn_left" @tap="modSub()">确认</view>
					</view>
				</view>
				<!-- 个人工单列表中心 -->
				<view class="man" @tap="man()">
					<image src="../../static/icon/man.png" mode=""></image>
				</view>
			</view>
			<view class="wx_bottom">有任何疑问，欢迎拨打我们的服务热线83161116！</view>
			<view class="" v-if="uuidShow">
				{{uuid}}
				<input type="hidden" v-model="uuid" value="" />
			</view>
		</view>
		<!-- searchInput这是一个方法 传入子组件中 -->
		<zlpicker
			v-model="zlpvalue"
			ref="zlpicker"
			:data="lines"
			:initSelected="initSelected"
			:multiple="false"
			:showSearch="true"
			:resetVal="busLine"
			@changeZLPvalue="changeZLPvalue"
			@confirm="confirmzlpvalue"
			@change="changezlpvalue"
			@input="inputzlpvalue"
			:searchInput="searchInput"
			@handlerSearchKey="handlerSearchKey"
		></zlpicker>
	</view>
</template>
<script>
var user = uni.getStorageSync('user');
var id;
var sourceType = [['camera'], ['album'], ['camera', 'album']];
import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
import wPicker from '@/components/w-picker/w-picker.vue';
import zlpicker from '@/components/zhilin-picker/zhilin-picker.vue';
import jPicker from '@/components/J-Picker/jPicker.vue';
import KXDateTime from "@/components/kx-datetime/kx-datetime.vue"
export default {
	components: { ruiDatePicker, wPicker, zlpicker, jPicker, KXDateTime },
	data() {
		return {
			noClick:true,
			array: ['无','否','是'],
			index: 0,
			value: '',
			date: '',
			startdate: '',
			number: '',
			visiter: '',
			telephone: '',
			busNumber: '无',
			visitTime: '',
			eventTime: '',
			intoSite: '',
			outSite: '',
			driver: '无',
			crewMember: '无',
			whetherReply: '无',
			cardNumber: '无',
			content: '',
			// 公交线路
			busLine:'',
			lines: [],
			keywords: '', //搜索关键词
			zlpvalue: false,
			initSelected: [],
			id: '',
			nData: {
				bookTypeVal: 0,
				manTypeVal: 0,
				zdTypeVal: 0
			},
			shaowBtn: true,
			// 图片上传
			imageList: [], //图片
			src: '', //视频存放
			imagesUrlPath: [],
			sourceTypeIndex: 2,
			checkedValue: true,
			checkedIndex: 0,
			sourceType: ['拍摄', '相册', '拍摄或相册'],
			cameraList: [
				{
					value: 'back',
					name: '后置摄像头',
					checked: 'true'
				},
				{
					value: 'front',
					name: '前置摄像头'
				}
			],
			cameraIndex: 0,
			VideoOfImagesShow: true,
			// 弹框是否答复
			show: false,
			isShow: false,
			nowShow: true,
			uuidShow: false,
			uuid: '',
			// 遮罩层
			isShowDialog: true
		}
	},
	onLoad() {
		this.init();
		this.getNumber();
		this.getLineSites();
	},
	onUnload() {
		this.src = '',
		this.sourceTypeIndex = 2,
		this.sourceType = ['拍摄', '相册', '拍摄或相册'];
	},
	methods: {
		handlerSearchKey(val){},
		searchInput(val){},
		// 重置
		resetLine(){
			window.event.stopPropagation();
			this.busLine = '';
		},
		init() {
			var uuid = localStorage.getItem("uuid");
			if(uuid==undefined || uuid == null || uuid==""){
				// this.uuid = Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
				this.uuid = new Date().getTime()
				localStorage.setItem("uuid",this.uuid);
			}
			this.uuid = uuid;
			//赋值到页面的uuid
			console.log(uuid, 123)
		},
		// 流水号
		getNumber() {
			var url = this.$url + 'workNumber';
			uni.request({
				url: url,
				data: {
					number: this.number,
				},
				method: 'GET',
				success: res => {
					console.log(res);
					this.number = res.data;
					this.total = res.total;
				}
			});
		},
		// 弹框
		modSub() {
			this.nowShow = false
			this.isShowDialog = false
		},
		// 公交线路
		selectZLpicker() {
			this.zlpvalue = true;
			this.shaowBtn = false;
			this.$refs.zlpicker.inputSearch();
			var url = this.$url + 'getBusList';
			uni.request({
				url: url,
				data: {
					busLine: this.busLine,
				},
				method: 'GET',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success: res => {
					this.lines = res.data.map(p => {
						return {
							label: p,
							value: p
						};
					});
				},
				fail: (data, code) => {
					uni.showToast({
						icon: 'none',
						title: '網絡異常'
					});
					return false;
				}
			});
		},
		confirmzlpvalue(e) {
			console.log(e, 686876)
			this.busLine = e;
			// this.getLineSites();
		},
		inputzlpvalue(e) {},
		changeZLPvalue(v) {},
		changezlpvalue(){},
		// 获取公交线路数据
		getLineSites() {
			var url = this.$url + 'getBusList';
			uni.request({
				url: url,
				data: {
					busLine: this.busLine,
				},
				method: 'GET',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success: res => {
					this.lines = res.data.map(p => {
						return {
							label: p,
							value: p
						};
					});
				},
				fail: (data, code) => {
					uni.showToast({
						icon: 'none',
						title: '網絡異常'
					});
					return false;
				}
			});
		},
		// 搜索方法
		inputSearch() {
			var url = this.$url + 'getBusList';
			uni.request({
				url: url,
				data: {
					busLine: this.busLine,
					keywords: this.keywords
				},
				method: 'GET',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success: res => {
					
				},
			});
		},
		// 是否答复
		bindPickerChange: function(e) {
			this.index = e.target.value;
			this.whetherReply = e.detail.value;
			console.log(e.detail.value);
		},
		// 信访时间
		bindChangevisitTime(value) {
			this.value = value;
			this.visitTime = value;
			console.log('时间', value);
		},
		// 时间选择
		kxdatetime(e){
			this.date=e;
			this.eventTime = e;
			console.log('时间', e);
		},
		// 获取数据
		getNews() {
			uni.showNavigationBarLoading();
			var url = this.$url + 'vxworkorder';
			let page = this.page;
			uni.request({
				url: url,
				data: {
					// 登录
					username: user.number,
					choice: this.choice,
					id: this.id,
					number: this.number,
					visiter: this.visiter,
					telephone: this.telephone,
					busLine: this.busLine,
					busNumber: this.busNumber,
					visitTime: this.visitTime,
					eventTime: this.eventTime,
					intoSite: this.intoSite,
					outSite: this.outSite,
					driver: this.driver,
					crewMember: this.crewMember,
					whetherReply: this.whetherReply,
					content: this.content,
				},
				method: 'GET',
				success: res => {
					var rdata = res.data;
					this.total = rdata.total;
					uni.showToast({
						icon: 'none',
						title: res.data.msg
					});
					console.log(rows, 111111);
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
		modelSubmit() {
			this.show = false,
			this.isShow = false,
			this.isShowDialog = false,
			// this.submit = false,
			// 返回
			location.reload();
			window.location.href = 'http://wxkf.szbus.cn:8088/crmFile/h5/index.html?time='+new Date().getTime();
			setTimeout(() => {
				uni.navigateBack({
					delta: 1
				});
			}, 150);
		},
		submit() {
			// debugger;
			if(!this.handlervalidate()){
				return false;
			}
			if (this.whetherReply == 0) {
				this.whetherReply = '无';
			} else if (this.whetherReply == 1) {
				this.whetherReply = '否';
				this.show = false;
				this.isShow = true;
				this.isShowDialog = true
			} else if (this.whetherReply == 2) {
				this.whetherReply = '是';
				this.isShow = false;
				this.show = true;
				this.isShowDialog = true
			};
			var url = this.$url + 'vxworkorder';
			let query = {
				number: 'C' + this.number,
				visiter: this.visiter,
				telephone: this.telephone,
				busLine: this.busLine,
				busNumber: this.busNumber,
				visitTime: this.visitTime,
				eventTime: this.eventTime,
				intoSite: this.intoSite,
				outSite: this.outSite,
				driver: this.driver,
				crewMember: this.crewMember,
				cardNumber: this.cardNumber,
				whetherReply: this.whetherReply,
				content: this.content,
				uuid: this.uuid,
				pictureOne: this.imageList[0] ? this.imageList[0] : '',
				pictureTwo: this.imageList[1] ? this.imageList[1] : '',
				vedio: this.src ? this.src : ''
			}
			uni.request({
				url: url,
				method: 'POST',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: query,
				success: res => {
					console.log(res);
					// uni.showToast({
					// 	icon: 'none',
					// 	// title: '保存成功',
					// 	title: res.data.msg
					// });
					// 返回
					// setTimeout(() => {
					// 	uni.navigateBack({
					// 		delta: 1
					// 	});
					// }, 3000);
					// location.href = 'http://wxkf.szbus.cn:8088/crmFile/h5/index.html'
					// location.reload();
				},
				fail: () => {
					uni.showToast({
						title: '网络异常',
						icon: 'none'
					});
					return false;
				}
			});
		},
		handlervalidate(){
			if(this.visiter==""){
				uni.showToast({
					icon: 'none',
					title: '信访人姓名不能为空'
				});
				return false;
			}
			var minlength = 11;
			if(this.telephone.length < minlength){
				uni.showToast({
					icon: 'none',
					title: '电话号码不足11位'
				});
				return false;
			} 
			if(this.busNumber=="无"){
				uni.showToast({
					icon: 'none',
					title: '车辆编号不能为空'
				});
				return false;
			}
			if(this.eventTime==""){
				uni.showToast({
					icon: 'none',
					title: '事件发生时间不能为空'
				});
				return false;
			}
			if(this.intoSite=="无"){
				uni.showToast({
					icon: 'none',
					title: '上车站点不能为空'
				});
				return false;
			}
			if(this.outSite=="无"){
				uni.showToast({
					icon: 'none',
					title: '下车站点不能为空'
				});
				return false;
			}
			if(this.whetherReply=="无"){
				uni.showToast({
					icon: 'none',
					title: '是否答复未选择不能提交'
				});
				return false;
			}
			var minlength = 30;
			if( this.content.length < minlength ) {
				uni.showToast({
					icon: 'none',
					title: '内容字数不足30'
				});
				this.show = false;
				this.isShow = false;
				this.isShowDialog = false;
				return false;
			} else if( this.content.length > minlength ) {
				this.show = true;
				this.isShow = true;
				this.isShowDialog = true;
				return true;
			}
			// if(uuid == undefined || uuid == null || uuid == ""){
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '没有账号信息'
			// 	});
			// 	return false;
			// }
			return true;
		},
		// 	inputChange(e) {
		// 		const o = e.target;
		// 		// o.value = o.value.replace(/[^\u4E00-\u9FA5]/g, ''); // 清除除了中文以外的输入的字符
		// 		o.value = o.value.replace(/(.)\1+/g,'$1'); // 清除输入的重复的字符
		// 　　　	this.content = o.value;
		// 	},
		// 文件上传开始
		chooseVideoImage() {
			uni.showActionSheet({
				title: '选择上传类型',
				itemList: ['图片', '视频'],
				success: (res) => {
					console.log(res);
					if (res.tapIndex == 0) {
						this.chooseImage();
					} else {
						this.chooseVideo();
					}
				}
			});
		},
		// 图片上传
		chooseImage() {
			uni.chooseImage({
				count: 2, //默认9
				sizeType: ['original', 'compressed'],
				sourceType: ['album','camera'],
				success: (res) => {
					uni.showLoading({
					    title: '加载中'
					});
					console.log('654645646546546',res)
					var url = this.$url + 'workTempFile';
					// 当前选择的图片只有一张 添加到当前字段
					if(res.tempFilePaths.length == 1){
						this.imageList.push(res.tempFilePaths[0]);
					}
					// 两张图片一起选择 直接赋值
					if(res.tempFilePaths.length > 1){
						this.imageList = res.tempFilePaths
					}
					console.log(this.imageList.length)
					console.log(res.tempFilePaths.length)
					var imgFiles = res.tempFilePaths[0];
					let query = {
						number: 'C' + this.number
					}
					// 当前存储的图片只有一张 即刚开始选择图片上传
					
					if(this.imageList.length == 1){
						query.file1 = res.tempFiles[0]
					}
					// 当前存储的图片有两张 且选择的图片只有一张 即当前是一张一张上传的
					if(this.imageList.length > 1 && res.tempFilePaths.length == 1){
						query.file2 = res.tempFiles[0]
					}
					// 当前存储的图片有两张 且选择的图片有俩张 即当前两张一起上传的
					if(this.imageList.length > 1 && res.tempFilePaths.length > 1){
						query.file1 = res.tempFiles[0]
						query.file2 = res.tempFiles[1]
					}
					uni.uploadFile({
					    // 需要上传的地址
					    url: url,
						formData: query,
					    filePath: res.tempFilePaths[0],
					    name: 'file',
					    success(res) {
					        // 显示上传信息
					        console.log(res)
							setTimeout(function () {
							    uni.hideLoading();
							}, 1000);
					    },
						fail(error){
							console.log(error)
						}
					});
				}
			});
		},
		chooseVideo() {
			// 上传视频
			uni.chooseVideo({
				maxDuration: 60,
				count: 2,
				camera: this.cameraList[this.cameraIndex].value,
				sourceType: ['album'],
				success: responent => {
					console.log(responent)
					uni.showLoading({
					    title: '加载中'
					});
					var url = this.$url + 'workTempFile';
					let videoFile = responent.tempFilePath;
					this.src = responent.tempFilePath;  //头条
					console.log(this.src)
					uni.uploadFile({
						url: url,  
						formData: {
							number: 'C' + this.number,
							file3: responent.tempFile,
						},
						filePath: responent.tempFilePath,
						name: 'file',
						success: res => {
							console.log(res)
							setTimeout(function () {
							    uni.hideLoading();
							}, 2000);
						},
						fail(error){
							console.log(error)
						}
					});
				}
			});
		},
		previewImage: function(e) {
			//预览图片
			var current = e.target.dataset.src;
			uni.previewImage({
				current: current,
				urls: this.imageList
			});
		},
		delect(index) {
			console.log(index)
			uni.showModal({
				title: '提示',
				content: '是否要删除该图片',
				success: res => {
					console.log(res)
					if (res.confirm) {
						this.imageList.splice(index, 1);
					}
				}
			});
		},
		delectVideo() {
			uni.showModal({
				title: '提示',
				content: '是否要删除此视频',
				success: res => {
					if (res.confirm) {
						this.src = '';
					}
				}
			});
		},
		// 文件上传结束
		man() {
			uni.navigateTo({
				url: `/pages/chase/chase_next?uuid=${this.uuid}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.wx_content {
	width: 100%;
	height: auto;
	font-size: 14px;
}
.wx_nav image {
	width: 100%;
	height: 160px;
}
.wx_logo {
	width: 90%;
	height: 40px;
	line-height: 40px;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	padding: 10px 10px;
	margin: auto;
}
.wx_logo image {
	width: 45%;
	height: 35px;
}
.wx_logo text {
	font-size: 15px;
	color: #bf363d;
	margin-left: 10px;
}
.wx_list {
	width: 100%;
	height: auto;
}
.wx_list .wx_title {
	font-size: 19px;
	color: #649dca;
	text-align: center;
}
.wx_ul {
	width: 90%;
	height: auto;
	margin: 10px auto;
}
.wx_li {
	display: flex;
	height: 30px;
	line-height: 30px;
	font-size: 14px;
	margin-bottom: 10px;
	border-bottom: 1px solid #ccc;
	border-radius: 3px;
	position: relative;
}
.wx_li .icon-close{
	position: absolute;
	right: 5px;
	width: 20px;
}
.wx_li text {
	width: 40%;
	margin-left: 5px;
}
.wx_li i {
	color: red;
	font-size: 14px;
	line-height: 30px;
}
.wx_li .wx_data {
	width: 70%;
	height: 30px;
	line-height: 30px;
	text-align: center;
}
.wx_li input {
	// width: 80%;
	height: 30px;
	line-height: 30px;
	text-align: center;
	color: #000;
	font-size: 14px;
}
// .wx_li image {
// 	width: 20px;
// 	height: 20px;
// }
.line_wx {
	color: #007AFF !important;
	font-weight: bold;
}
.wx_li_line {
	
}
.wx_line {
	margin: auto;
}
.wxImg {
	width: 20%;
	height: 30px;
	margin: auto;
}
.wxImg image {
	width: 30px;
	height: 30px;
	margin-left: 15px;
}
.uploade_wrap{
	width: 95%;
	height: 75px;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	align-items: center;
	border: 1px dashed #ccc;
	margin: auto;
}
.wx_contents textarea {
	width: 95%;
	height: 180px;
	border: 1px solid #ccc;
	border-radius: 3px;
	font-size: 14px;
	margin: 5px auto;
	padding: 5px;
}
.model {
	width: 75%;
	height: 30px;
	line-height: 30px;
	text-align: center;
	color: #000;
}
.rui-picker {
	height: 10vw;
	font-size: 14px;
	color: #000;
	display: -webkit-flex;
	display: -webkit-box;
	display: block;
	-webkit-box-align: center;
	-webkit-align-items: center;
	align-items: center;
	padding: 0 10px;
	box-sizing: border-box;
	border: none;
	border-radius: 3px;
	text-align: center;
}
.wx_submit {
	width: 80%;
	height: 35px;
	margin: 5px auto;
}
.wx_submit button {
	margin-bottom: 20px;
	background-color: #76BDDB;
	color: #fff;
}

.iptfile {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 300px;
	height: 150px;
	display: inline-block;
	opacity: 0;
}
.pic {
	width: 300px;
	height: 150px;
}

.address-box {
	display: flex;
	width: 670rpx;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 15rpx 40rpx;
	margin-bottom: 10px;
}
.address-box-txt {
	align-items: flex-start;
}
.address-txt {
	width: 484rpx;
	height: 90rpx;
	font-size: 32rpx;
	font-weight: 500;
	line-height: 45rpx;
	color: rgba(51, 51, 51, 1);
}
.add-box {
	padding: 15rpx 0;
	flex-wrap: wrap;
}
.add-img-box {
	display: flex;
	width: 750rpx;
	padding-left: 10rpx;
	flex-direction: row;
	flex-wrap: wrap;
}
.add-img-item {
	/* width:210rpx;
		height:210rpx; */
	width: 200rpx;
	height: 200rpx;
	border-radius: 24rpx;
	position: relative;
	padding: 9rpx 0;
	margin-left: 20rpx;
}
.add-img-camera {
	flex: 1;
}
.add-img {
	width: 200rpx;
	height: 200rpx;
	border-radius: 24rpx;
}
.add-img-del {
	position: absolute;
	width: 40rpx;
	height: 40rpx;
	right: 8rpx;
	top: 17rpx;
	//background-color: rgba(238, 0, 0, 1);
	border-radius: 20rpx;
}
.address-time {
	width: 484rpx;
	height: 88rpx;
	background-color: rgba(245, 245, 245, 1);
	opacity: 1;
	border-radius: 24rpx;
	text-align: center;
	font-size: 35rpx;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
}
.line{
	width: 750rpx;
	height: 1px;
	transform: scaleY(0.3);
	background-color: rgba(0,0,0,0.5);
}
.wx_bottom {
	color: #ff3c3c;
	font-size: 14px;
	font-weight: bold;
	text-align: center;
	margin-top: 25px;
	margin-bottom: 20px;
	letter-spacing: 3px;
}
// 图片/视频上传css
.man image {
	width: 60px;
	height: 60px;
	z-index: 999;
	position: fixed;
	right: 10px;
	bottom: 30px;
	opacity: 0.5;
}
// 遮罩层
.mask {
	width:100%;
	height:100%;
	background:gray;
	position:fixed;
	top:0;
	left:0;
	z-index:100;
	opacity:0.3;
} 
// 弹框
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
	padding: 15px;
	min-height: 40px;
	font-size: 15px;
	line-height: 23px;
	color: #000;
	max-height: 400px;
	overflow-y: auto;
	border-bottom: 1px solid #eee;
	letter-spacing: 2px;
	text-align: left;
}
.wx_model_text i {
	color: #76BDDB;
	font-weight: bold;
	font-size: 15px;
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
	width: 100%;
	background-color: #76BDDB;
	color: #fff;
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

.uni-uploader {-webkit-box-flex: 1;-webkit-flex: 1;-ms-flex: 1;flex: 1;-webkit-box-orient: vertical;-webkit-box-direction: normal;-webkit-flex-direction: column;-ms-flex-direction: column;flex-direction: column;}
	.uni-uploader-body {margin-top: 8px;}
	
	.uni-uploader__input-box {
		position: relative;
		/* margin: 5px; */
		width: 100px;
		height: 100px;
		border: 1px solid #D9D9D9;
		margin-top: 5px;
		margin-left: 5px;
	}
	.uni-uploader__input-box:before {width: 2px;height: 39px;}
	.uni-uploader__input-box:before, .uni-uploader__input-box:after {
		content: " ";
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background-color: #D9D9D9;
	}
	.uni-uploader__input {position: absolute;z-index: 1;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;}
	.uni-uploader__input-box:after {width: 39px;height: 2px;}
	.uni-uploader__input-box:before, .uni-uploader__input-box:after {
		content: " ";
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background-color: #D9D9D9;
	}
	.uni-uploader-head {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		-webkit-flex-direction: row;
		-ms-flex-direction: row;
		flex-direction: row;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		-ms-flex-pack: justify;
		justify-content: space-between;
	}
	.uni-uploader-title {padding-left: 10px;}
	.uni-uploader-info {color: #B2B2B2;padding-right: 10px;}
	.uni-uploader-info {color: #B2B2B2;}
	.uni-list-cell::after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 15px;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		-ms-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}	
	.uni-uploader__img {
		display: block;
		width: 100px;
		height: 100px;
	}
	.burst-wrap{
	    width: 100%;
	    height: 100%;
	}
	// .burst-wrap .burst-wrap-bg>view{
	//     width: 90%;
	//     height: 100%;
	//     margin: 0 auto;
	//     position: absolute;
	//     top: 65upx;
	//     left: 0;
	//     right: 0;
	// }
	.form-item{
	    width: 100%;
	}
	.form-item textarea{
	    display: block;
	    height: 220upx;
	    width: 100%;
	    color: #AAAAAA;
	    font-size: 28upx;
	}
	.uni-uploader__file,.uploader_video{
	    position: relative;
	    z-index: 1;
	    width: 200upx;
	    height: 200upx;
		padding-left: 5px;
	}
	.uni-uploader__files {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		-webkit-flex-direction: row;
		-ms-flex-direction: row;
		flex-direction: row;
		-webkit-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		width: 95%;
		margin: 10px auto;
	}
	.icon-cuo {
	    position: absolute;
	    right: 0;
	    top: 5upx;
	    background: linear-gradient(90deg,rgba(251,91,80,1) 0%,rgba(240,45,51,1) 100%);
	    color: #FFFFFF;
	    z-index: 999;
	    border-top-right-radius: 20upx;
	    border-bottom-left-radius: 20upx;
	}
	.video{
	    width: 100%;
	    height: 100%;
	}
	
	.login-input-box{
	    position: relative;
	    border-bottom: 1upx solid #EEEEEE;
	}
	.login-input-box .forget,.login-input-box .phone{
	    position: absolute;
	    top: 0;
	    height: 100%;
	    z-index: 100;
	}
	.login-input-box .phone{
	    width: 100upx;
	    left: 0;
	    color: #666666;
	    font-weight: bold;
	}
	.login-input-box .phone-input{
	    padding-left: 100upx;
	}
	.address-wrap,.open-info{
	    margin-top: 20upx;
	}
	.open-info>view:last-child{
	    font-size: 28upx;
	    color: #999999;
	}
	.address-wrap .address {
	    background: #F2F2F2;
	    border-radius: 40upx;
	    padding: 0 20upx;
	}
	.user-set-btn{
	    margin: 40upx;
	    background: linear-gradient(90deg,rgba(251,91,80,1) 0%,rgba(240,45,51,1) 100%);
	    color: #FFFFFF;
	    text-align: center;
	    height: 88upx;
	    line-height: 88upx;
	}
	.delectVideo image {
		width: 25px;
		height: 25px;
		position: absolute;
		right: 0px;
		z-index: 999;
	}
</style>
