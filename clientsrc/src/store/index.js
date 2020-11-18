import { authProvider } from "@bcwdev/auth0-vue/AuthProvider"
import { STATES } from "mongoose"
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
import { api } from "./AxiosService"
import ns from "../Services/NotificationService"

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    user: {},
    boards: [],
    activeBoard: {},
    lists: [],
    tasks: {},
    comments: {}
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setBoards(state, boards) {
      state.boards = boards
    },
    setActiveBoard(state, board) {
      state.activeBoard = board
    },
    createBoard(state, board) {
      state.boards.push(board)
    },
    removeBoard(state, id) {
      state.boards = state.boards.filter(b => b.id != id)
    },
    setLists(state, lists) {
      state.lists = lists
    },
    removeList(state, list) {
      state.lists = state.lists.filter(l => l.id != list)
    },
    createList(state, list) {
      state.lists = list
    },
    setTasks(state, data) {
      Vue.set(state.tasks, data.listId, data.tasks)
    },
    createTask(state, tasks) {
      state.tasks = tasks
    },
    removeTask(state, task) {
      state.tasks[task.listId] = state.tasks[task.listId].filter(t => t.id != task.id)
    },
    setComments(state, data) {
      Vue.set(state.comments, data.taskId, data.comments)
    },
    createComment(state, comments) {
      state.comments = comments
    },
    removeComment(state, comment) {
      state.comments[comment.taskId] = state.comments[comment.taskId].filter(c => c.id != comment.id)
    }
  },

  actions: {
    //#region -- AUTH STUFF --
    setBearer({ }, bearer) {
      api.defaults.headers.authorization = bearer;
    },
    resetBearer() {
      api.defaults.headers.authorization = "";
    },
    async getProfile({ commit }) {
      try {
        let res = await api.get("/profile")
        commit("setUser", res.data)
      } catch (err) {
        console.error(err)
      }
    },
    //#endregion


    //#region -- BOARDS --

    async getBoards({ commit }) {
      try {
        let res = await api.get('boards')
        commit("setBoards", res.data)
      } catch (error) {
        console.error(error);
      }
    },
    async addBoard({ commit }, boardData) {
      try {
        let res = await api.post('boards', boardData)
        commit("createBoard", res.data)
        // @ts-ignore
        $("#exampleModal").hide()
        // @ts-ignore
        $(".modal-backdrop").hide()
        ns.success()

      } catch (error) {
        console.error(error);
      }
    },

    async deleteBoard({ commit }, boardId) {
      try {
        if (await ns.confirmAction("Do you want to delete this board?", "You'll never get it back ...")) {
          await api.delete('boards/' + boardId)
          commit("removeBoard", boardId)
          commit("setActiveBoard", {})
          router.push({ name: "boards" })
          ns.toast("Board DESTROYED", 1500)

        }
      } catch (error) {
        console.error(error);
      }
    },

    async getActiveBoard({ commit }, boardId) {
      try {
        let res = await api.get('boards/' + boardId)
        commit('setActiveBoard', res.data)
        // @ts-ignore
        this.dispatch("getLists", boardId);
      } catch (error) {
        console.error(error);
      }
    },
    async editBoard({ commit }, boardData) {
      try {
        let res = await api.put('boards/' + boardData.id, boardData)
        commit('setActiveBoard', res.data)
      } catch (error) {
        console.error(error);
      }
    },
    async getLists({ commit }, boardId) {
      try {
        let res = await api.get('boards/' + boardId + '/lists')
        commit('setLists', res.data)
      } catch (error) {
        console.error(error);
      }
    },
    async addList({ commit, state }, listData) {
      try {
        let res = await api.post('lists', listData)
        console.log(res.data)
        commit("createList", [...state.lists, res.data])
      } catch (error) {
        console.error(error);
      }
    },
    async deleteList({ commit }, listId) {
      try {
        if (await ns.confirmAction("Do you want to delete this list?", "You'll never get it back ...")) {
          await api.delete('lists/' + listId)
          commit("removeList", listId)
          ns.toast("List DESTROYED", 1500)
        }
      } catch (error) {
        console.error(error);
      }
    },

    async deleteTask({ commit }, task) {
      try {
        if (await ns.confirmAction("Do you want to delete this task?", "You'll never get it back ...")) {
          await api.delete('tasks/' + task.id)
          commit("removeTask", task)
          // @ts-ignore
          $(".modal-backdrop").hide()
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getTasks({ commit }, listId) {
      try {
        let res = await api.get('lists/' + listId + '/tasks')
        commit('setTasks', {
          tasks: res.data, listId: listId
        })
      } catch (error) {
        console.error(error);
      }
    },

    async addTask({ commit, dispatch }, taskData) {
      try {
        let res = await api.post('tasks', taskData)
        console.log(res);
        dispatch("getTasks", taskData.listId)
      } catch (error) {
        console.error(error);
      }
    },


    async getComments({ commit }, taskId) {
      try {
        let res = await api.get('tasks/' + taskId + '/comments')
        commit('setComments', { comments: res.data, taskId: taskId })
      } catch (error) {
        console.error(error);
      }
    },

    async addComment({ commit, dispatch }, commentData) {
      try {
        let res = await api.post('comments', commentData)
        dispatch("getComments", commentData.taskId)
      } catch (error) {
        console.error(error);
      }
    },

    async deleteComment({ commit }, comment) {
      try {
        await api.delete('comments/' + comment.id)
        commit("removeComment", comment)
      } catch (error) {
        console.error(error);
      }
    },



    //#endregion


    //#region -- LISTS --



    //#endregion
  }
})
