import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import Vue from "vue";
import App from "./App.vue";
import axios from "./config/axios.js";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
