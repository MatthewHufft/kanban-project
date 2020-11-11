<template>
  <div class="container-fluid board japanese-home-picture">
    <div class="row header d-flex justify-content-center text-light title-bg">
      <div class="col-12 d-flex flex-column">
        <div class="title d-flex justify-content-center">
          <h1 v-if="board.title && !editToggle">{{ board.title }}</h1>
          <div class="btn-group dropright">
            <i
              class="fa fa-ellipsis-v btn big-button"
              aria-hidden="true"
              role="button"
              data-toggle="dropdown"
            ></i>
            <div class="dropdown-menu ml-1 text-center">
              <p class="btn" @click="editToggle = !editToggle">Edit Board</p>
              <p class="btn" @click="deleteBoard">Delete Board</p>
            </div>
          </div>
        </div>
        <h4 v-if="board.description && !editToggle">{{ board.description }}</h4>
      </div>

      <div id="editForm">
        <form class="form" @submit.prevent="editBoard" v-if="editToggle">
          <input
            type="text"
            class="form-control mb-2"
            aria-describedby="helpId"
            v-model="boardData.title"
            placeholder="Board Title..."
          />
          <input
            type="text"
            class="form-control"
            aria-describedby="helpId"
            v-model="boardData.description"
            placeholder="Board Description..."
          />
          <button
            type="submit"
            class="btn btn-warning"
            @click="editToggle = !editToggle"
          >
            <i class="fa fa-arrow-circle-right big-icon" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col-12 d-flex">
        <form class="form-inline">
          <div class="form-group">
            <i
              class="fa fa-plus-circle btn btn-danger text-shadow pointer"
              @click="addList"
              aria-hidden="true"
            ></i>
            <input
              type="text"
              placeholder="Type new list name..."
              class="form-control"
              v-model="newList.title"
              required
            />
          </div>
        </form>
      </div>
    </div>

    <div class="row mt-4 d-flex">
      <list-component v-for="list in lists" :key="list.id" :listProp="list" />
      <!-- inject lists here -->
      <!-- <div class="col-3 listComp">
        <div class="rounded" style="width: 25rem;">
          <h4 class="card-header d-flex justify-content-between">3 things on your agenda</h4>
          <ul class="list-group" id="tasks">
            
          </ul>
          <form @click="addTask">
            <input type="text" class="form-control" placeholder="Add list item + Enter" required />
          </form>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import ListComponent from "../components/ListComponent";
import TaskComponent from "../components/TaskComponent";
import CommentComponent from "../components/CommentComponent";
export default {
  name: "board",
  mounted() {
    this.$store.dispatch("getActiveBoard", this.$route.params.boardId);
  },
  computed: {
    lists() {
      return this.$store.state.lists;
    },
    board() {
      return this.$store.state.activeBoard;
    },
    tasks() {
      return this.$store.state.tasks;
    },
  },
  data() {
    return {
      newList: {
        title: "",
        boardId: this.$route.params.boardId,
      },
      boardData: {
        title: "",
        description: "",
      },
      editToggle: false,
    };
  },
  props: ["boardId"],
  components: {
    ListComponent,
    TaskComponent,
  },
  methods: {
    deleteBoard() {
      this.$store.dispatch("deleteBoard", this.board.id);
    },
    addList() {
      this.$store.dispatch("addList", this.newList);
    },
    editBoard() {
      this.boardData.id = this.$route.params.boardId;
      console.log(this.boardData);
      this.$store.dispatch("editBoard", this.boardData);
    },
  },
};
</script>
<style>
.pointer {
  cursor: pointer;
}
.title-bg {
  background-color: rgba(68, 67, 67, 0.534);
}
.big-button {
  font-size: 1.3em;
}
.big-button:active {
  text-shadow: 0px 0px 1px #2c2c2c;
  transform: ;
}
.text-shadow {
  text-shadow: 2px 2px 6px #000000;
}
</style>
