import { createApp } from 'vue'
// import 'bootstrap'
// axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// loading
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
// mitt
import mitt from 'mitt'

// 匯入 vee-validate 主套件
import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate'
// 匯入 vee-validate 相關規則(二擇一)
// import { required, email, min, max } from '@vee-validate/rules'
// 匯入 vee-validate 全部規則(二擇一)
import AllRules from '@vee-validate/rules'
// 匯入多國語系的功能
import { localize, setLocale } from '@vee-validate/i18n'
// 匯入繁體中文語系檔案
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
// NT$
import { currency } from '@/methods/currency'

import App from './App.vue'
import router from './router'

// 切換頁面滾動條置頂
// https://blog.csdn.net/weixin_40881970/article/details/102912283
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

// mitt
const eventBus = mitt()

// 定義驗證規則(二擇一)
// defineRule('required', required)
// defineRule('email', email)
// defineRule('min', min)
// defineRule('max', max)
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})

// 設定 vee-validate 全域規則
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true // 當輸入任何內容直接進行驗證
})

// 設定預設語系
setLocale('zh_TW')

const app = createApp(App)
// loading
app.component('VLoading', VueLoading)
// 註冊 vee-validate 三個全域元件
app.component('VForm', Form)
app.component('VField', Field)
app.component('ErrorMessage', ErrorMessage)
// 把 mitt 加入 Vue 的全域 Property，讓任何一個元件都能使用
app.config.globalProperties.$mitt = eventBus

app.config.globalProperties.$currency = currency
// axios
app.use(VueAxios, axios)
app.use(router)
app.mount('#app')
