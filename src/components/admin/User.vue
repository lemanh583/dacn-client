<template>
  <div>
    <div class="table-content">
      <div class="head">
        <select
          v-model="filter"
          @change="handleChangeOption"
          class="custom-select"
        >
          <option
            v-for="(item, index) in selectOp"
            :key="index"
            :value="item.key"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
      <!-- {{ contentSearch.search }} -->

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Ảnh</th>
              <th scope="col">Tên đăng nhập</th>
              <th scope="col">Tên người dùng</th>
              <th scope="col">Email</th>
              <th scope="col" style="text-align: center">Số bài viết</th>
              <th scope="col" style="text-align: center">Quyền</th>
              <th scope="col">Tạo lúc</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody style="position: relative">
            <div v-if="loading" class="spinner-border loading" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <tr v-else v-for="(item, index) in listUser" :key="index">
              <th scope="row">{{ index }}</th>
              <td><img src="dsvsdv" alt="" /></td>
              <td>{{ item.username }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td style="text-align: center">{{ item.countPost }}</td>
              <td style="text-align: center">{{ item.permision }}</td>
              <td>{{ new Date(item.created_time).toLocaleString() }}</td>
              <td>
                <button class="btn btn-success">Sửa</button>
                <button class="btn btn-danger">Xoá</button>
                <!-- <button class="btn btn-danger">Phê duyệt</button> -->
               
              </td>
            </tr>
          </tbody>
        </table>
        <!-- <ModalUser /> -->

        <Pagination :count="count" :size="10" />
      </div>
    </div>
  </div>
</template>
<script>
import { watch, ref } from "vue";
import axios from "axios";
import Pagination from "../pagination.vue";
// import ModalUser from "./ModalUser.vue";

export default {
  props: ["contentSearch"],
  components: {
    Pagination,

  },
  setup(props) {
    // watchEffect(() => {
    //   console.log(props.contentSearch.search)
    // })
    const listUser = ref([]);
    const token = localStorage.getItem("token");
    const search = ref("");
    const filter = ref("");
    const count = ref(0);
    const visible = ref(false)
    const selectOp = ref([
      {
        key: "",
        name: "Tất cả",
      },
      {
        key: "mod",
        name: "Danh sách moderate",
      },
      {
        key: "mem",
        name: "Danh sách người dùng",
      },
      {
        key: "col",
        name: "Danh sách cộng tác viên",
      },
    ]);
    const loading = ref(true);

    watch(
      () => props.contentSearch.search,
      (cur) => {
        search.value = cur;
        loading.value = true;
        setTimeout(() => {
          fetchListUser();
        }, 1000);
      }
    );

    const showModal = () => {
      visible.value = true
    }
    const handleCancel = () => {
      visible.value = false
    }

    const fetchListUser = async () => {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_URL}/user/list`,
          {
            search: search.value,
            filter: filter.value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          listUser.value = response.data.data;
          count.value = response.data.count;
          loading.value = false;
        }
        // console.log("response user", response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const handleChangeOption = () => {
      loading.value = true;
      fetchListUser();
    };

    // function
    fetchListUser();

    return {
      props,
      listUser,
      selectOp,
      filter,
      handleChangeOption,
      count,
      loading,
      showModal,
      handleCancel,
      visible
    };
  },
};
</script>
<style scoped>
.loading {
  position: absolute;
  left: 48%;
  top: 30%;
}
.head {
  margin-bottom: 20px;
  width: 30%;
}
</style>
