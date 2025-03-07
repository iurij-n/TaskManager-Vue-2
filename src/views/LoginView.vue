<template>
  <div class="login-container">
    <a-form-model
      ref="loginForm"
      :model="form"
      :rules="rules"
      @submit.prevent="submit"
      class="login-form"
    >
      <h2>Вход</h2>
      <a-form-model-item label="Имя пользователя" prop="username">
        <a-input
          v-model="form.username"
          placeholder="Имя пользователя"
          size="large"
        >
          <a-icon slot="prefix" type="user" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="Пароль" prop="password">
        <a-input-password
          v-model="form.password"
          placeholder="Пароль"
          size="large"
        >
          <a-icon slot="prefix" type="lock" />
        </a-input-password>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          block
          :loading="loading"
        >
          Войти
        </a-button>
      </a-form-model-item>
      <a-form-model-item>
        <span>Нет аккаунта? </span>
        <router-link to="/register"> Зарегистрироваться </router-link>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: "Пожалуйста, введите имя пользователя" },
        ],
        password: [{ required: true, message: "Пожалуйста, введите пароль" }],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            await this.$store.dispatch("login", this.form);
            this.$router.push("/");
          } catch (error) {
            console.log("Ошибка входа:", error);
            this.$handleErrors(error);
          } finally {
            this.loading = false;
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  background-color: #f0f2f5;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

h2 {
  text-align: center;
  margin-bottom: 24px;
}
</style>
