<template>
  <div class="table-content">
    <h3> bài viết</h3>
    <h5>Tác giả: <span style="color: red">{{author.name}} / {{author.email}} </span> </h5>
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
        <img :src="srcImg" alt="bcxvbxcvb">
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
</template>
<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { notify } from "@kyvg/vue3-notification";
import axios from "axios";
import { ref } from "vue";
import { useRoute } from "vue-router"

export default {
  setup() {
    const editor = ClassicEditor;
    const route = useRoute()
    const id = ref("")
    const author = ref({})
    const editorData = ref("");
    const title = ref("");
    const descriptions = ref("");
    const token = localStorage.getItem("token");
    const img = ref(null);
    const srcImg = ref("")
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
            let response = await axios.get(`${process.env.VUE_APP_URL}/post/get/${route.params.id}`);
            if(response.data.success && response.data.data) {
               editorData.value = response.data.data.content
               title.value = response.data.data.title
               descriptions.value = response.data.data.descriptions
               selectCate.value = response.data.data.category._id
               srcImg.value = response.data.data.image.src
               id.value = response.data.data._id
               author.value = response.data.data.author
            }
        } catch (error) {
            console.error(error);
        }
    }
    fetchPost()
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
      author
    };
  },
};
</script>
<style scoped>
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
</style>
