<template>
  <div class="wrapper">
    <div class="title">Список задач</div>
    <div class="add-task">
      <div class="title-input">
        <a-input v-model="form.title" size="large" />
      </div>
      <a-button
        type="primary"
        size="large"
        icon="plus"
        :disabled="loading"
        @click="addTask()"
        >Добавить</a-button
      >
    </div>
    <div class="task-controls">
      <a-select v-model="sortOrder" @change="reloadList" style="width: 250px">
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
    <div class="task-list">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @setComplete="setComplete"
        @edit="edit"
        @deleteTask="deleteTaskConfirm"
      />
      <infinite-loading
        ref="tasksInfinite"
        @infinite="getList"
        v-bind:distance="5"
      >
        <div slot="spinner"><a-spin /></div>
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
      <div v-if="showEmpty" style="padding-top: 5rem">
        <a-empty>
          <span slot="description">Нет задач</span>
        </a-empty>
      </div>
    </div>
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
import TaskItem from "@/components/TaskItem.vue";
import InfiniteLoading from "vue-infinite-loading";

export default {
  components: { TaskDrawer, TaskItem, InfiniteLoading },
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
      form: { title: "", description: "", is_completed: false },
      drawerVisible: false,
      taskModalVisible: false,
      selectedTask: null,
      showCompleted: false,
      sortOrder: "-created_at",
      loading: false,
      reload: false,
      page_size: 8,
      page: 1,
      next: true,
      showEmpty: false,
    };
  },
  methods: {
    checkEmpty() {
      if (this.tasks && !this.tasks.length) this.showEmpty = true;
      else this.showEmpty = false;
    },
    async getList($state) {
      if (!this.loading) {
        let params = {
          page: this.page,
          page_size: this.page_size,
          show_completed: localStorage.getItem("showCompleted") === "true",
          sort_order: this.sortOrder,
        };
        this.loading = true;
        try {
          const { data } = await this.$http.get("tasks/", {
            params,
          });
          if (data?.results?.length === 0) {
            $state.complete();
          }
          if (data?.results?.length) {
            this.$store.commit("addTasks", data.results);
            if (data.next) {
              this.page += 1;
              $state.loaded();
            } else {
              $state.complete();
            }
          }
          this.checkEmpty();
        } catch (e) {
          console.log(e);
        } finally {
          this.loading = false;
        }
      }
    },
    async setComplete(taskID, is_completed) {
      try {
        await this.$store.dispatch("setCompleted", {
          taskID: taskID,
          is_completed: is_completed,
        });
        this.$message.info("Задача обновлена");
      } catch (error) {
        console.error("Ошибка при обновлении задачи:", error);
        this.$message.error("Ошибка при обновлении задачи");
      }
    },
    async addTask() {
      this.form.title = this.form.title.trim();
      if (!this.form.title.length) return;
      try {
        await this.$store.dispatch("createTask", this.form);
        this.clearForm();
        this.checkEmpty();
        this.$message.success("Задача добавлена!");
      } catch (error) {
        console.error("Ошибка при создании задачи:", error);
        this.$message.error("Ошибка при создании задачи");
      }
    },
    clearForm() {
      this.form.title = "";
    },
    edit(task) {
      this.openDrawer(task, true);
    },
    onChange(event) {
      if (event.target.checked) {
        localStorage.setItem("showCompleted", true);
      } else {
        localStorage.removeItem("showCompleted");
      }
      this.reloadList();
    },
    reloadList() {
      this.page = 1;
      this.next = true;
      this.$store.commit("setTasks", []);

      this.$nextTick(() => {
        if (this.$refs.tasksInfinite) {
          this.$refs.tasksInfinite.stateChanger.reset();
        }
      });
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
    deleteTaskConfirm(task) {
      const instance = this;
      this.$confirm({
        title: `Удалить задачу "${task.title}"`,
        onOk() {
          instance.deleteTask(task);
        },
        onCancel() {},
      });
    },
    async deleteTask(task) {
      this.loading = true;
      try {
        await this.$store.dispatch("deleteTask", task.id);
        this.checkEmpty();
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
.wrapper {
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  display: grid;
  grid-template-rows: repeat(3, auto) 1fr;
  .title {
    width: 100%;
    text-align: center;
    font-size: xx-large;
    font-weight: 600;
    margin-bottom: 2rem;
  }
  .add-task {
    width: 100%;
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    .title-input {
      width: 100%;
    }
  }
}
.task-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 20px;
}
.task-list {
  padding: 0;
  overflow-y: auto;
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
