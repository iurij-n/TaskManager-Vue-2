<template>
  <div>
    <h1>Список задач</h1>
    <div class="task-controls">
      <a-button
        type="primary"
        icon="plus"
        @click="openDrawer(null, false)"
        :disabled="loading"
        >Добавить</a-button
      >
      <a-select
        v-model="sortOrder"
        @change="fetchTasks"
        style="width: 200px; margin-left: 10px"
      >
        <a-select-option value="-created_at">Сначала новые</a-select-option>
        <a-select-option value="created_at">Сначала старые</a-select-option>
        <a-select-option value="-is_completed"
          >Сначала выполненные</a-select-option
        >
        <a-select-option value="is_completed"
          >Сначала не выполненные</a-select-option
        >
      </a-select>
      <a-checkbox :defaultChecked="defaultChecked" @change="onChange"
        >Показывать выполненные</a-checkbox
      >
    </div>
    <a-spin :spinning="loading">
      <ul class="task-list">
        <li v-for="task in tasks" :key="task.id" class="task-item">
          <span class="task-title" :title="task.title">{{ task.title }}</span>
          <div class="task-actions">
            <a-button v-if="task.is_completed" class="completed" type="link"
              >Выполнено</a-button
            >
            <a-button v-else class="not_completed" type="link"
              >Не выполнено</a-button
            >
            <a-button type="link" @click="showTaskDetails(task)"
              >Подробнее</a-button
            >
            <a-button type="link" @click="openDrawer(task, true)"
              >Изменить</a-button
            >
            <a-popconfirm
              title="Вы уверены, что хотите удалить эту задачу?"
              ok-text="Да"
              cancel-text="Нет"
              @confirm="deleteTask(task)"
            >
              <a-button type="link" danger>Удалить</a-button>
            </a-popconfirm>
          </div>
        </li>
      </ul>
    </a-spin>
    <TaskDrawer
      :visible.sync="drawerVisible"
      :task="selectedTask"
      :isEdit="isEdit"
      @close="closeDrawer"
      @taskUpdated="updateTask"
    />
    <a-modal
      :visible.sync="taskModalVisible"
      title="Просмотр задачи"
      @cancel="taskModalVisible = false"
    >
      <template slot="footer">
        <a-button key="back" type="primary" @click="taskModalVisible = false">
          Закрыть
        </a-button>
      </template>
      <p><strong>Заголовок:</strong> {{ selectedTask?.title }}</p>
      <p><strong>Описание:</strong> {{ selectedTask?.description }}</p>
      <p>
        <strong>Статус:</strong>
        {{ selectedTask?.is_completed ? "Выполнено" : "Не выполнено" }}
      </p>
    </a-modal>
  </div>
</template>

<script>
import TaskDrawer from "@/components/TaskDrawer.vue";
export default {
  components: { TaskDrawer },
  computed: {
    tasks() {
      return this.$store.state.tasks;
    },
    defaultChecked() {
      return localStorage.getItem("showCompleted") === "true";
    },
  },
  data() {
    return {
      isEdit: false,
      drawerVisible: false,
      taskModalVisible: false,
      selectedTask: null,
      showCompleted: false,
      sortOrder: "-created_at",
      loading: false,
    };
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    onChange(event) {
      if (event.target.checked) {
        localStorage.setItem("showCompleted", true);
      } else {
        localStorage.removeItem("showCompleted");
      }
      this.fetchTasks();
    },
    async fetchTasks() {
      this.loading = true;
      try {
        await this.$store.dispatch("fetchTasks", {
          showCompleted: localStorage.getItem("showCompleted") === "true",
          sortOrder: this.sortOrder,
        });
      } catch (error) {
        console.log("Ошибка получения списка задач:", error);
        this.$message.error("Ошибка получения списка задач");
      } finally {
        this.loading = false;
      }
    },
    openDrawer(task, isEdit) {
      if (task) this.selectedTask = task;
      this.isEdit = isEdit;
      this.drawerVisible = true;
    },
    closeDrawer() {
      this.isEdit = false;
      this.drawerVisible = false;
    },
    updateTask(updatedTask) {
      this.$store.commit("updateTask", updatedTask);
    },
    async deleteTask(task) {
      this.loading = true;
      try {
        await this.$store.dispatch("deleteTask", task.id);
        this.$message.success(`Задача "${task.title}" удалена`);
      } catch (error) {
        console.log("Ошибка удаления задачи:", error);
        this.$message.error("Ошибка удаления задачи");
      } finally {
        this.loading = false;
      }
    },
    showTaskDetails(task) {
      this.selectedTask = task;
      this.taskModalVisible = true;
    },
  },
};
</script>

<style scoped>
.task-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 20px;
}
.task-list {
  list-style: none;
  padding: 0;
}
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 5px;
}
.task-actions {
  display: flex;
  gap: 10px;
}
.completed {
  color: rgb(3, 207, 3);
  cursor: default;
}
.not_completed {
  color: red;
  cursor: default;
}
.task-title {
  display: inline-block;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
