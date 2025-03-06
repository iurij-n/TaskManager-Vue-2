import Vue from "vue";
import Vuex from "vuex";
import axios from "@/config/axios";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: !!localStorage.getItem("access"),
    tasks: [],
  },
  mutations: {
    setAuthData(state, { access, refresh }) {
      state.isAuthenticated = true;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
    },
    setAccessToken(state, { access }) {
      localStorage.setItem("access", access);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.tasks = [];
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    addTasks(state, tasks) {
      state.tasks.push(...tasks);
    },
    addTask(state, task) {
      state.tasks.unshift(task);
    },
    updateTask(state, updatedTask) {
      const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) {
        Vue.set(state.tasks, index, updatedTask);
      }
    },
    removeTask(state, taskId) {
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
    },
  },
  actions: {
    async login({ commit }, payload) {
      const response = await axios.post("users/login/", payload);
      commit("setAuthData", response.data);
    },
    async register(_, payload) {
      await axios.post("users/register/", payload);
    },
    async refreshToken({ commit }) {
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        const response = await axios.post("users/refresh/", {
          refresh: refreshToken,
        });
        commit("setAccessToken", response.data);
      }
    },
    logout({ commit }) {
      commit("logout");
      router.push("/login");
    },
    async createTask({ commit }, taskData) {
      const response = await axios.post("tasks/", taskData);
      commit("addTask", response.data);
    },
    async updateTask({ commit }, taskData) {
      const response = await axios.put(`tasks/${taskData.id}/`, taskData);
      commit("updateTask", response.data);
      return response.data;
    },
    async setCompleted({ commit }, { taskID, is_completed }) {
      const response = await axios.patch(`tasks/${taskID}/`, {
        is_completed: is_completed,
      });
      commit("updateTask", response.data);
      if (is_completed && localStorage.getItem("showCompleted") !== "true") {
        commit("removeTask", response.data.id);
      }
      return response.data;
    },
    async deleteTask({ commit }, taskId) {
      await axios.delete(`tasks/${taskId}/`);
      commit("removeTask", taskId);
    },
  },
});
