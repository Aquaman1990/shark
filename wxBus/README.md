QQ交流群:950275933，备注说明原因

根据自己的项目接口配置对应的参数  requestUrl,uploadName,fileType,imgType,token

图片上传默认限制2M,文件上传默认限制5M,可根据项目要求在自行修改限制大小

文件下载/预览支持的格式，doc, xls, ppt, pdf, docx, xlsx, pptx + 图片格式

点击文件下载打开后，可点击右上角按钮发送至微信传输助手或收藏文件保存，图片点击预览后长按可保存

```html
<template>
	<view class="w-upload">
		<button class="w-btn" type="primary" @click="uploadOpen" plain="true">上传</button>
        <button class="w-btn w-btn1" type="primary" @click="wpriven(src)" plain="true">下载</button>
		<w-upload
			ref="wUpload"
			:token="token"
			:fileShow="fileShow"
			:imgShow="imgShow"
			:uploadName="uploadName"
			:requestUrl="requestUrl"
			:fileType="fileType"
			:imgType="imgType"
			@updateImgList="updateImgList"
			@updateFileList="updateFileList"
			:fileList="fileList"
			:imgList="imgList"
			@imgSuccess="imgSuccess"
			@fileSuccess="fileSuccess"
		></w-upload>
	</view>
</template>
```



```js
<script>
import wUpload from '@/components/file-img-upload/w-upload.vue';
export default {
	components: { wUpload },
	data() {
		return {
			imgShow: true,// 是否展示图片列表
			fileShow: true,// 是否展示文件列表
			token : '', 非必填
			requestUrl: '', // 上传文件/图片的请求地址，必填
			uploadName: 'upload_resource', // 看上传文件/图片接口的名字关键字，必填
			fileType : 'file', // 看上传接口要求的文件格式关键字，必填
			imgType : 'pictures',// 看上传接口要求上传的图片格式关键字，必填
			fileList: [],
			imgList: [],
            src : "" // 下载文件的网络地址
		};
	},
	created() {},
	methods: {
		// 打开上传文件弹窗
		uploadOpen() {
			this.$refs.wUpload.uploadOpen();
		},
        // 下载预览文件/图片
		wpriven(url) {
			this.$refs.wUpload.wpriven(url);
		},
		// 返回被删除的文件和索引号
		updateFileList(val) {
			console.log(val);
		},
		// 返回被删除的图片和索引号
		updateImgList(val) {
			console.log(val);
		},
        // 返回图片上传成功后的图片信息
		imgSuccess(val) {
			console.log(val);
		},
        // 返回文件/图片上传成功后的文件信息
		fileSuccess(val) {
			console.log(val);
		}
	}
};
</script>
```







