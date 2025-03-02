<template>
  <nav class="navbar">
    <router-link to="/" class="nav-link">Главная</router-link>
    <div class="nav-right">
      <router-link v-if="!isAuthenticated" to="/login" class="nav-link"
        >Вход</router-link
      >
      <router-link v-if="!isAuthenticated" to="/register" class="nav-link"
        >Регистрация</router-link
      >
      <a v-if="isAuthenticated" class="nav-link" href="#" @click="logout"
        >Выход</a
      >
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1890ff;
}
.nav-link {
  color: white;
  text-decoration: none;
  margin: 0 10px;
  font-weight: bold;
}
.nav-link:hover {
  text-decoration: underline;
}
.nav-right {
  display: flex;
}
</style>
