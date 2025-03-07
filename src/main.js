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

const handleErrors = {
  install(Vue) {
    Vue.prototype.$handleErrors = function (error) {
      if (error.response.data) {
        Object.keys(error.response.data).forEach((key) => {
          if (typeof error.response.data[key] === "string") {
            this.$message.error(`${key}: ${error.response.data[key]}`);
          } else if (typeof error.response.data[key] === "object") {
            error.response.data[key].forEach((message) => {
              this.$message.error(`${key}: ${message}`);
            });
          }
        });
      }
    };
  },
};

Vue.use(handleErrors);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
