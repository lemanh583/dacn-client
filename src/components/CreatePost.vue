<template>
  <div
    style="
      background: linear-gradient(to right, #33ccff 0%, #ff99cc 100%);
      padding: 30px 0;
    "
  >
    <div class="table-content update-post">
      <h3>Tạo bài viết</h3>
      <form method="POST" enctype="multipart/form-data">
        <div class="form-group">
          <label for="exampleInputEmail1">Chọn thể loại bài viết</label>
          <select
            v-model="selectCate"
            class="custom-select form-control"
            style="width: 50%"
          >
            <!-- <option value="" selected>Chọn thể loại</option> -->
            <option
              v-for="(item, index) in listCategory"
              :key="index"
              :value="item._id"
            >
              {{ item.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="exampleInputEmail1">Nhập tiêu đề bài viết</label>
          <input
            type="text"
            class="form-control"
            id=""
            placeholder="Nhập tiêu đề"
            v-model="title"
          />
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Tải lên ảnh bìa</label>
          <input
            type="file"
            class="form-control"
            id="inputGroupFile02"
            name="upload"
            @change="handleGetImg($event)"
          />
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Mô tả</label>
          <textarea
            type="text"
            class="form-control"
            id=""
            placeholder="Nhập mô tả"
            v-model="descriptions"
          />
        </div>
        <label for="exampleInputPassword1">Nội dung</label>
        <div id="editor">
          <ckeditor
            :editor="editor"
            v-model="editorData"
            :config="editorConfig"
            style="width: 500px; height: 300px"
          ></ckeditor>
        </div>
        <button
          type="submit"
          class="btn btn-primary btn-submit"
          @click="handleCreate"
        >
          Submit
        </button>
      </form>
      <notifications />
    </div>
  </div>
</template>
<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { notify } from "@kyvg/vue3-notification";
import axios from "axios";
import { ref } from "vue";

export default {
  setup() {
    const editor = ClassicEditor;
    const editorData = ref("");
    const title = ref("");
    const descriptions = ref("");
    const token = localStorage.getItem("token");
    const img = ref(null);
    const selectCate = ref("");
    const listCategory = ref([]);
    const editorConfig = ref({
      height: "500px",
      ckfinder: {
        uploadUrl: "http://localhost:3002/api/image/create",
      },
    });

    const handleGetImg = (event) => {
      img.value = event.target.files[0];
      // console.log('event', event.target.files[0])
      // console.log('eventsdvds', event)
    };

    const handleCreate = async (event) => {
      try {
        event.preventDefault();
        let data = new FormData();
        data.append("file", img.value);
        data.append("title", title.value.trim());
        data.append("descriptions", descriptions.value.trim());
        data.append("content", editorData.value);
        data.append("category", selectCate.value);
        let response = await axios.post(
          `${process.env.VUE_APP_URL}/post/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          title.value = "";
          descriptions.value = "";
          editorData.value = "";
          img.value = null;
          document.getElementById("inputGroupFile02").value = null;
          notify({
            type: "success",
            title: "Tạo bài viết thành công",
          });
        }
        console.log("res-creat-post", response.data.data);
      } catch (error) {
        console.error(error.response);
        notify({
          type: "error",
          title: "Tạo bài viết thất bại",
        });
      }
    };

    const fetchCategory = async () => {
      try {
        const list = await axios.get(
          `${process.env.VUE_APP_URL}/category/list`
        );
        if (list.data.success) {
          listCategory.value = list.data.data;
          selectCate.value = listCategory.value[0]._id;
          console.log("selectCate", selectCate.value);
        }
        console.log("list", list);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategory();

    return {
      editor,
      editorData,
      editorConfig,
      handleCreate,
      descriptions,
      title,
      handleGetImg,
      listCategory,
      selectCate,
    };
  },
};
</script>
<style scoped>
.btn-submit {
  margin-top: 20px;
  margin-left: 93%;
}
.update-post {
  /* margin-top: 30px; */
  width: 85%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0;
  /* margin-top: 30px; */
  /* display: flex; */
  /* padding: 0 20px; */
}
</style>
