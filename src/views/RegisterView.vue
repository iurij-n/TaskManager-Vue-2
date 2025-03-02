<template>
  <div class="register-container">
    <a-form-model
      ref="registerForm"
      :model="form"
      :rules="rules"
      @submit.prevent="submit"
      layout="vertical"
      class="register-form"
    >
      <h2>Регистрация</h2>
      <a-form-item label="Имя пользователя" prop="username">
        <a-input
          size="large"
          v-model="form.username"
          placeholder="Введите имя пользователя"
        />
      </a-form-item>
      <a-form-item label="Email" prop="email">
        <a-input
          v-model="form.email"
          type="email"
          placeholder="Введите email"
          size="large"
        />
      </a-form-item>
      <a-form-item label="Пароль" prop="password">
        <a-input-password
          v-model="form.password"
          placeholder="Введите пароль"
          size="large"
        />
      </a-form-item>
      <a-form-item label="Подтвердите пароль" prop="confirmPassword">
        <a-input-password
          v-model="form.confirmPassword"
          placeholder="Повторите пароль"
          size="large"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          block
          :loading="loading"
          >Зарегистрироваться</a-button
        >
      </a-form-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: "Пожалуйста, введите имя пользователя" },
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "Пожалуйста, введите email",
          },
        ],
        password: [{ required: true, message: "Пожалуйста, введите пароль" }],
        confirmPassword: [
          { required: true, message: "Пожалуйста, введите пароль повторно" },
        ],
      },
    };
  },
  methods: {
    async submit() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          if (this.form.password !== this.form.confirmPassword) {
            this.$message.error("Пароли не совпадают!");
            return;
          }
          this.loading = true;
          delete this.form.confirmPassword;
          try {
            await this.$store.dispatch("register", this.form);
            this.$router.push("/login");
          } catch (error) {
            console.log("Ошибка регистрации:", error);
            this.$message.error("Ошибка регистрации");
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  background-color: #f0f2f5;
}
.register-form {
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
