<template>
  <div class="task-card-wrapper">
    <div class="task-card">
      <div class="check-complete">
        <a-tooltip :mouseEnterDelay="0.5">
          <template slot="title"> Выполнено </template>
          <a-checkbox :checked="task.is_completed" @change="setComplete" />
        </a-tooltip>
      </div>
      <div class="info">
        <div class="title">{{ task.title }}</div>
        <div class="description">{{ task.description }}</div>
      </div>
      <a-button icon="edit" @click="edit" />
      <a-button ghost type="danger" icon="delete" @click="deleteTask" />
    </div>
    <div class="gap-block"></div>
  </div>
</template>
<script>
export default {
  name: "TaskItem",
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  methods: {
    setComplete(event) {
      this.$emit("setComplete", this.task.id, event.target.checked);
    },
    edit() {
      this.$emit("edit", this.task);
    },
    deleteTask() {
      this.$emit("deleteTask", this.task);
    },
  },
};
</script>
<style scoped>
.task-card-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 75px 15px;
}
.task-card {
  min-height: 0;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 10px;
  display: grid;
  grid-template-columns: auto 1fr repeat(2, auto);
  gap: 1rem;
  align-items: center;
  height: 75px;
  .info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    .title,
    .description {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 1.1rem;
      font-weight: 500;
    }
    .description {
      font-size: 1rem;
      font-weight: unset;
      opacity: 0.8;
    }
  }
}
</style>
