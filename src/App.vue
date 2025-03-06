<template>
  <a-layout class="layout">
    <a-layout-header>
      <NavBar />
    </a-layout-header>
    <a-layout-content class="content">
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
.content {
  padding: 24px;
  min-height: calc(100vh - 64px);
  overflow-y: hidden;
  background-color: #fff;
}
.layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
}
</style>
