<template>
  <div style="background: linear-gradient(to right, #33ccff 0%, #ff99cc 100%);padding: 30px 0;">
    <div class="table-content update-post">
      <h3> <strong>Bài viết</strong> </h3>
      <h5>
        <strong>Trạng thái: </strong>
        <span class="text-danger">{{approved == "1" ? "Đã duyệt" : "Chưa duyệt"}}</span>
      </h5>
      <h5>
        <strong>Tác giả: </strong> 
        <span style="color: red">{{ author.name }} / {{ author.email }} </span>
      </h5>
      <form method="POST" enctype="multipart/form-data">
        <div class="form-group">
          <label for="exampleInputEmail1"> <strong>Chọn thể loại bài viết</strong> </label>
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
          <label for="exampleInputEmail1"> <strong>Nhập tiêu đề bài viết</strong> </label>
          <input
            type="text"
            class="form-control"
            id=""
            placeholder="Nhập tiêu đề"
            v-model="title"
          />
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1"> <strong>Tải lên ảnh bìa</strong> </label>
          <input
            type="file"
            class="form-control"
            id="inputGroupFile02"
            name="upload"
            @change="handleGetImg($event)"
          />
          <img :src="srcImg" alt="bcxvbxcvb" />
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1"> <strong>Mô tả</strong> </label>
          <textarea
            type="text"
            class="form-control"
            id=""
            placeholder="Nhập mô tả"
            v-model="descriptions"
          />
        </div>
        <label for="exampleInputPassword1"> <strong>Nội dung</strong> </label>
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
import { useRoute } from "vue-router";

export default {
  setup() {
    const editor = ClassicEditor;
    const route = useRoute();
    const id = ref("");
    const author = ref({});
    const editorData = ref("");
    const title = ref("");
    const descriptions = ref("");
    const token = localStorage.getItem("token");
    const img = ref(null);
    const srcImg = ref("");
    const selectCate = ref("");
    const listCategory = ref([]);
    const approved = ref()
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
          `${process.env.VUE_APP_URL}/post/update/${id.value}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          //   title.value = "";
          //   descriptions.value = "";
          //   editorData.value = "";
          //   img.value = null
          //   document.getElementById("inputGroupFile02").value = null;
          notify({
            type: "success",
            title: "Cập nhật bài viết thành công",
          });
        }
        // console.log("res-creat-post", response.data.data);
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

    const fetchPost = async () => {
      try {
        let response = await axios.get(
          `${process.env.VUE_APP_URL}/post/get/${route.params.id}`
        );
        if (response.data.success && response.data.data) {
          editorData.value = response.data.data.content;
          title.value = response.data.data.title;
          descriptions.value = response.data.data.descriptions;
          selectCate.value = response.data.data.category._id;
          srcImg.value = response.data.data.image.src;
          id.value = response.data.data._id;
          author.value = response.data.data.author;
          approved.value = response.data.data.approved
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
    // console.log('route', )

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
      srcImg,
      author,
      approved
    };
  },
};
</script>
<style scoped>
body {
  background-color: bisque;
}
.btn-submit {
  margin-top: 20px;
  margin-left: 93%;
}
img {
  margin-top: 20px;
  max-width: 150px;
  max-height: 150px;
  object-fit: cover;
  object-position: top;
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
