<template>
  <div>
    <div class="table-content">
      <div class="head">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Bài viết</th>
              <th scope="col">Bình luận</th>
              <th scope="col">Tác giả</th>
              <th scope="col">Thời gian</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody style="position: relative">
            <div
              v-if="loading"
              class="spinner-border"
              style="position: absolute; margin-left: 45%"
              role="status"
            >
              <span class="sr-only">Loading...</span>
            </div>
            <tr v-for="(item, index) in list" :key="item._id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.post.title.slice(0, 30) }}...</td>
              <td class="comment">
                {{ item.name.slice(0, 30) }}...
                <div class="comment-full">
                  <p>
                    {{ item.name }}
                  </p>
                </div>
              </td>
              <td>{{ item.author.username }}</td>
              <td>{{ new Date(item.created_time).toLocaleString() }}</td>
              <td>
                <a
                  class="text-danger"
                  style="cursor: pointer"
                  @click="handleDelete(item._id)"
                  >Xoá</a
                >
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination
          class="pag"
          :count="count"
          :size="10"
          @changePaginator="changePaginator"
        />
      </div>
      <notifications />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import Pagination from "../pagination.vue";
import { notify } from "@kyvg/vue3-notification";
export default {
  components: {
    Pagination,
  },
  setup() {
    const list = ref([]);
    const count = ref(0);
    const skip = ref(0);
    const limit = ref(10);
    const loading = ref(true);

    const fetchComments = async () => {
      try {
        const rs = await axios.post(
          `${process.env.VUE_APP_URL}/comment/list?skip=${skip.value}&limit=${limit.value}`,
          {}
        );
        if (rs.data.success) {
          list.value = rs.data.data;
          count.value = rs.data.count;
          loading.value = false;
        }
        // console.log("list", list.value);
      } catch (error) {
        console.error(error);
      }
    };

    const handleDelete = async (id) => {
      try {
        const rs = await axios.delete(
          `${process.env.VUE_APP_URL}/comment/delete/${id}`,
          {}
        );
        if (rs.data.success) {
          notify({
            type: "success",
            title: "Thành công",
          });
          fetchComments();
        }
      } catch (error) {
        console.error(error);
      }
    };

    const changePaginator = (pageNumber) => {
      skip.value = Number(pageNumber - 1) * 10;
      limit.value = 10;
      //   console.log('skip', skip.value)
      fetchComments();
    };

    fetchComments();

    return {
      list,
      handleDelete,
      count,
      changePaginator,
      loading,
    };
  },
};
</script>
<style scoped>
.comment-full {
  top: 0px;
  position: absolute;
  left: 0;
  z-index: 99;
  width: 500px;
  background-color: #fff;
  box-shadow: 0px 4px 24px rgb(0 0 0 / 10%);
  padding: 20px;
  border-radius: 10px;
  display: none;
}
.comment {
  position: relative;
  cursor: pointer;
}
.comment:hover .comment-full {
  display: block;
}
</style>
