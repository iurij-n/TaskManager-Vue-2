<template>
  <a-drawer
    :title="task ? 'Редактировать задачу' : 'Добавить задачу'"
    :visible="visible"
    :afterVisibleChange="afterVisibleChange"
    @close="$emit('close')"
    width="400"
  >
    <a-form-model ref="taskForm" layout="vertical" :model="form" :rules="rules">
      <a-form-model-item label="Заголовок" prop="title">
        <a-input v-model="form.title" />
      </a-form-model-item>
      <a-form-model-item label="Описание" prop="description">
        <a-textarea v-model="form.description" />
      </a-form-model-item>
      <a-form-model-item>
        <a-checkbox v-model="form.is_completed">Выполнено</a-checkbox>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="submitTask">Сохранить</a-button>
      </a-form-model-item>
    </a-form-model>
  </a-drawer>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    task: {
      type: Object,
      default: () => {},
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: { title: "", description: "", is_completed: false },
      rules: {
        title: [{ required: true, message: "Пожалуйста, введите заголовок" }],
        description: [
          {
            required: true,
            message: "Пожалуйста, введите описание",
          },
        ],
      },
    };
  },
  methods: {
    async submitTask() {
      this.$refs.taskForm.validate(async (valid) => {
        if (valid) {
          try {
            debugger;
            if (this.isEdit && this.task) {
              const updatedTask = await this.$store.dispatch("updateTask", {
                id: this.task.id,
                ...this.form,
              });
              this.$emit("taskUpdated", updatedTask);
            } else {
              await this.$store.dispatch("createTask", this.form);
            }
            this.$emit("close");
          } catch (error) {
            console.error("Ошибка при создании задачи:", error);
            this.$message.error("Ошибка при создании задачи");
          }
        }
      });
    },
    afterVisibleChange(vis) {
      if (vis) {
        if (this.isEdit && this.task) this.form = { ...this.task };
      } else {
        this.form.title = "";
        this.form.description = "";
        this.form.is_completed = false;
      }
    },
  },
};
</script>

<style scoped></style>
