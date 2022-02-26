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
              <th scope="col">Trạng thái</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody style="position: relative">
            <div v-if="loading" class="spinner-border loading" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <tr v-else v-for="(item, index) in listUser" :key="index">
              <th scope="row">{{ skip + index + 1 }}</th>
              <td><img src="dsvsdv" alt="" /></td>
              <td>{{ item.username }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td style="text-align: center">{{ item.countPost }}</td>
              <td style="text-align: center" class="text-success">
                {{ item.permision }}
              </td>
              <!-- <td>{{ new Date(item.created_time).toLocaleString() }}</td> -->
              <td>{{ item.active ? "active" : "ban" }}</td>
              <td>
                <span class="text-warning" @click="handleUpdate(item._id)"
                  >Xem</span
                >
                /
                <span
                  v-if="item.active && item.role != 0"
                  class="text-danger"
                  @click="handleBan(item._id)"
                  >Chặn</span
                >
                <span
                  v-if="!item.active"
                  class="text-danger"
                  @click="handleUnBan(item._id)"
                  >Bỏ Chặn</span
                >
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination :count="count" :size="10"   @changePaginator="changePaginator" />
      </div>
      <notifications />
    </div>
  </div>
</template>
<script>
import { watch, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Pagination from "../pagination.vue";
// import ModalUser from "./ModalUser.vue";
import { notify } from "@kyvg/vue3-notification";

export default {
  props: ["contentSearch"],
  components: {
    Pagination,
  },
  setup(props) {
    // watchEffect(() => {
    //   console.log(props.contentSearch.search)
    // })
    const skip = ref(0)
    const limit = ref(10)
    const listUser = ref([]);
    const token = localStorage.getItem("token");
    const search = ref("");
    const filter = ref("");
    const count = ref(0);
    const router = useRouter();
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
      {
        key: "ban",
        name: "Danh sách bị chặn",
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

    const handleUpdate = (id) => {
      router.push({ path: `/update-user/${id}` });
    };
    const handleBan = async (id) => {
      try {
        let response = await axios.post(
          `${process.env.VUE_APP_URL}/user/ban-user/${id}`,
          { flag: "ban" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          notify({
            type: "success",
            title: "Chặn thành công",
          });
          fetchListUser();
        }
        console.log("resBan", response.data);
      } catch (error) {
        console.error(error.response);
        notify({
          type: "error",
          title: "Không được phép",
        });
      }
    };

    const handleUnBan = async (id) => {
      try {
        let response = await axios.post(
          `${process.env.VUE_APP_URL}/user/ban-user/${id}`,
          { flag: "unban" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          notify({
            type: "success",
            title: "Bỏ Chặn thành công",
          });
          fetchListUser();
        }
        console.log("resBan", response.data);
      } catch (error) {
        console.error(error.response);
      }
    };

    const fetchListUser = async () => {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_URL}/user/list?skip=${skip.value}&limit=${limit.value}`,
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

    const changePaginator = (pageNumber) => {
      skip.value = Number(pageNumber - 1) * 10;
      limit.value = 10;
      //   console.log('skip', skip.value)
      fetchListUser();
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
      handleUpdate,
      handleBan,
      handleUnBan,
      changePaginator,
      skip
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
span:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
