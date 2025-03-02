<template>
  <a-layout>
    <a-layout-header>
      <NavBar />
    </a-layout-header>
    <a-layout-content style="padding: 24px; min-height: calc(100vh - 64px)">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script>
import NavBar from "./components/NavBar.vue";
export default {
  components: {
    NavBar,
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem("access");
    },
  },
};
</script>

<style>
.ant-layout-header {
  background: #1890ff;
}
</style>
