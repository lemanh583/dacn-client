<template>
  <div>
    <h1>Ahihi</h1>
    <h1>{{ isAuth }}</h1>
    <h1>{{ isRole }}</h1>
    <button @click="logout">Logout</button>
    <router-link to="/about"> about</router-link>
    <img src="../assets/logo.png" alt="" />
    <!-- <textarea name="" id="" cols="30" rows="10" v-model="area" @select="handleSelect">
      <div contenteditable="true" style="background-color: red;width: 30px;height: 30px;">ssdvnsdvkl</div>
    </textarea> -->
    <div contenteditable="true">
      kmsldkvmsldkvmlksdmvklsdv
      <button>đồ ngốc</button>
    </div>
    <!-- <p >skdvklsdvklsdv</p> -->
    <div id="editor">
      <ckeditor
        :editor="editor"
        v-model="editorData"
        :config="editorConfig"
        style="width: 500px; height: 300px"
      ></ckeditor>
      <!-- :config="editorConfig" -->
    </div>
    <div>
      {{ editorData }}
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { checkToken } from "../module/index.js";
import { computed, ref, onMounted } from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import EssentialsPlugin from "@ckeditor/ckeditor5-essentials/src/essentials";
export default {
  setup() {
    const store = useStore();
    let isAuth = computed(() => store.state.isAuth);
    let isRole = computed(() => store.state.isRole);
    const area = ref("");
    const editor = ClassicEditor;
    const editorData = ref("<h1>dssdvsdvsdvdsvsdv</h1>");
    const editorConfig = ref({
      resize_maxWidth: 500,
      ckfinder: {
        uploadUrl: "http://localhost:3002/api/image/create",
      },
    });
    const logout = () => {
      localStorage.setItem("token", "");
      // store.commit("isAuth", false);
      // store.commit("isRole", Number);
      console.log("editorData", editorData.value);
    };
    checkToken().then((result) => {
      if (result) {
        store.commit("isAuth", true);
        store.commit("isRole", result.data.role);
      }
    });

    const handleSelect = (event) => {
      console.log(event);
      // console.log(event)
      // console.log(event.target.value.substring(event.target.selectionStart, event.target.selectionEnd));
    };
    //  editorData.value = ""
    // onMounted(() => {
    //   // editorData.value = ""
    //   console.log(document.querySelector("#editor"));
    //   editor
    //     .create(document.querySelector("#editor"), {
    //       ckfinder: {
    //         uploadUrl: "http://localhost:3002/api/image/create",
    //         // headers: {
    //         //   "X-CSRF-TOKEN": "CSFR-Token",
    //         //   // Authorization: "Bearer <JSON Web Token>",
    //         // },
    //       },
    //     })
    //     .then((result) => {
    //       console.log("result", result);
    //       console.log("result");
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // });

    onMounted(() => {
      // editor.on("fileUploadResponse", (ev) => {
      //   console.log("ev", ev);
      // });
    });

    return {
      logout,
      checkToken,
      isAuth,
      isRole,
      area,
      handleSelect,
      editor,
      editorData,
      editorConfig,
    };
  },
};
</script>
