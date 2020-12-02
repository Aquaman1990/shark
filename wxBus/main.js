import Vue from 'vue'
import App from './App'
//配置公共方法
import common from './common/common.js'
Vue.prototype.$noMultipleClicks = common.noMultipleClicks;

Vue.config.productionTip = false

Vue.prototype.bus = new Vue()

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()


// 域名
// Vue.prototype.$url = "http://172.17.3.15:8081/app/";
// 公网地址
Vue.prototype.$url = "http://wxkf.szbus.cn/app/";
// Vue.prototype.$url = "http://58.250.251.4:8082/app/";
// 巴士
// Vue.prototype.$url = "http://10.128.0.107:8080/app/";
// Vue.prototype.$username = "";
