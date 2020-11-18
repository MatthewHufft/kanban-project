<template>
  <div class="col-12 col-md-4 col-lg-3 mb-2">
    <div class="rounded p-1 trans-bg" style=" min-height: 40vh;">
      <div class="card-header d-flex justify-content-between">
        <h4 class="pr-5">{{listProp.title}}</h4>
        <div class="btn-group dropright">
          <i class="fa fa-ellipsis-v btn" aria-hidden="true" role="button" data-toggle="dropdown"></i>
          <div class="dropdown-menu ml-4">
            <p class="btn" @click="addTaskToggle = !addTaskToggle; newTask.title = '' ">Add Task</p>
            <p class="btn" @click="deleteList">Delete List</p>
          </div>
        </div>
      </div>
      <form @submit.prevent="addTask" v-if="addTaskToggle">
        <input
          type="text"
          class="form-control mb-2"
          placeholder="add task"
          v-model="newTask.title"
          required
        />
      </form>

      <div class="row tasks">
        <task-component v-for="task in tasks" :key="task.id" :taskProp="task" />
        <!-- Tasks injected here w/ cols -->
      </div>
    </div>
  </div>
</template>

<script>
import TaskComponent from "../components/TaskComponent";
export default {
  name: "list-component",
  mounted() {
    this.$store.dispatch("getTasks", this.listProp.id);
  },
  props: ["listProp"],
  computed: {
    tasks() {
      return this.$store.state.tasks[this.listProp.id];
    },
  },
  data() {
    return {
      newTask: {
        title: "",
        listId: this.listProp.id,
      },
      addTaskToggle: false,
    };
  },
  methods: {
    addTask() {
      this.$store.dispatch("addTask", this.newTask);
      this.addTaskToggle = !this.addTaskToggle;
    },
    deleteList() {
      this.$store.dispatch("deleteList", this.listProp.id);
    },
  },
  components: { TaskComponent },
};
</script>

<style>
.pointer {
  cursor: pointer;
}
.trans-bg {
  background-color: rgba(221, 221, 221, 0.767);
}
</style>