<template>
  <div style="background: linear-gradient(to right, #33ccff 0%, #ff99cc 100%); padding: 30px 0px;">
    <div class="container" style="">
      <div class="row table-content" style="margin-bottom: 0px">
        <div class="col-6">
          <div class="row">
            <div class="col-6">
              <h3 class="text-success"><strong> Thông tin</strong></h3>
              <h5>
                <strong>Trạng thái: </strong>
                <span class="text-danger">
                  {{ active ? "active" : "ban" }}</span
                >
              </h5>

              <h5 v-if="this.$store.state.isRole == 0 && role != 0">
                <strong>Quyền:</strong>
                <span style="margin-left: 10px">
                  <select v-model="role" @change="handleChageRole">
                    <option v-for="(r, i) in arrRole" :key="i" :value="r.role">
                      {{ r.name }}
                    </option>
                  </select></span
                >
              </h5>
            </div>
            <div class="col-6">
              <img
                :src="
                  imgSrc
                    ? imgSrc
                    : 'http://windows79.com/wp-content/uploads/2021/02/Thay-the-hinh-dai-dien-tai-khoan-nguoi-dung-mac.png'
                "
                alt=""
                style="
                  width: 150px;
                  height: 150px;
                  object-fit: cover;
                  border-radius: 50%;
                "
              />
            </div>
          </div>
          <form method="POST">
            <div class="form-group">
              <label for="exampleInputEmail1"> <strong>Username</strong></label>
              <input
                type="text"
                class="form-control"
                id=""
                placeholder="Nhập username"
                v-model="username"
              />
            </div>

            <div class="form-group">
              <label for="exampleInputEmail1">
                <strong>Tên người dùng</strong></label
              >
              <input
                type="text"
                class="form-control"
                id=""
                placeholder="Nhập tên"
                v-model="name"
              />
            </div>

            <div class="form-group">
              <label for="exampleInputEmail1"> <strong>Email</strong></label>
              <input
                type="text"
                class="form-control"
                id=""
                placeholder="Nhập email"
                v-model="email"
              />
            </div>

            <div class="form-group">
              <label for="exampleInputEmail1">
                <strong>Số điện thoại</strong></label
              >
              <input
                type="text"
                class="form-control"
                id=""
                placeholder="Nhập số điện thoại"
                v-model="phone"
              />
            </div>

            <div class="form-group">
              <label for="exampleInputEmail1">
                <strong>Ngày sinh</strong></label
              >
              <input type="date" class="form-control" v-model="date" />
            </div>

            <div class="form-group">
              <label for="exampleInputEmail1">
                <strong>Tải lên ảnh đại diện</strong></label
              >
              <input
                type="file"
                class="form-control"
                id="inputGroupFile02"
                name="upload"
                @change="handleGetImg($event)"
              />
            </div>
            <div class="row">
              <div class="col-6">
                <input
                  class="btn btn-success"
                  type="submit"
                  @click="handleUpdateUser"
                  value="Cập nhật"
                />
              </div>
              <div class="col-6">
                <button
                  class="btn btn-warning"
                  @click="displayPass"
                  style="float: right"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </form>
          <form v-if="display" method="POST" style="margin-top: 20px">
            <div class="form-group">
              <label for="exampleInputEmail1">
                <strong>Đổi mật khẩu</strong></label
              >
              <input
                type="password"
                class="form-control"
                id=""
                placeholder="Nhập mật khẩu"
                v-model="password"
              />
            </div>
            <button
              class="btn btn-success"
              type="submit"
              @click="handleChangePass"
            >
              Xác nhận thay đổi mật khẩu
            </button>
          </form>

          <!-- {{ user.name }} -->
        </div>
        <div class="col-6">
          <h3 class="text-warning">
            <strong>Danh sách bài viết đã đăng</strong>
          </h3>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tiêu đề</th>
                <th scope="col">Lượt xem</th>
                <th scope="col">...</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, index) in posts" :key="index">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ p.title.slice(0, 40) }}...</td>
                <td>{{ p.view }}</td>
                <td>
                  <span class="text-warning" @click="handleUpdate(p.slug)"
                    >Xem</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <Pagination
            :count="count"
            :size="10"
            @changePaginator="changePaginator"
          />
        </div>
      </div>
      <notifications />
      <!-- {{ this.$route.params.id }} -->
    </div>
  </div>
</template>
<script>
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import axios from "axios";
import Pagination from "../components/pagination.vue";
import { notify } from "@kyvg/vue3-notification";
export default {
  components: {
    Pagination,
  },
  setup() {
    const router = useRoute();
    const id = router.params.id;
    const token = localStorage.getItem("token");
    const user = ref({});
    const posts = ref([]);
    const skip = ref(0);
    const limit = ref(10);
    const count = ref(0);
    const username = ref("");
    const name = ref("");
    const email = ref("");
    const imgSrc = ref("");
    const img = ref("");
    const active = ref("");
    const role = ref(null);
    const phone = ref("");
    const date = ref("");
    const display = ref(false);
    const password = ref("");
    // const arrRole = ref([]);
    const arrRole = ref([
      {
        name: "Moderator",
        role: 1,
      },
      {
        name: "Collaborators",
        role: 2,
      },
      {
        name: "Member",
        role: 3,
      },
    ]);

    const handleChageRole = async () => {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_URL}/user/change-role/${id}`,
          {
            role: role.value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          notify({
            type: "success",
            title: "Sửa thành thành công",
          });
        }
      } catch (error) {
        console.error(error.response);
      }
    };

    // const fetchRole = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${process.env.VUE_APP_URL}/role/list`
    //     );
    //     if (response.data.succes) {
    //       arrRole.value = response.data.data;
    //     }
    //     console.log("role", response.data);
    //   } catch (error) {
    //     console.error(error.response);
    //   }
    // };
    // fetchRole();
    const handleChangePass = async (event) => {
      try {
        event.preventDefault();
        console.log("pass", password.value);
        let response = await axios.post(
          `${process.env.VUE_APP_URL}/user/change-pass/${id}`,
          {
            password: password.value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          notify({
            type: "success",
            title: "Thay đổi mật khẩu thành công",
          });
        }
      } catch (error) {
        console.error(error.response);
        notify({
          type: "error",
          title: "Thay đổi thất bại",
        });
      }
    };

    const displayPass = (e) => {
      e.preventDefault();
      display.value = !display.value;
    };
    const handleGetImg = (event) => {
      img.value = event.target.files[0];
      // console.log('event', event.target.files[0])
      // console.log('eventsdvds', event)
    };

    const handleUpdateUser = async (event) => {
      event.preventDefault();
      let data = new FormData();
      data.append("username", username.value);
      data.append("name", name.value);
      data.append("email", email.value);
      if (img.value) {
        data.append("file", img.value);
      }
      if (phone.value) {
        data.append("phone", phone.value);
      }
      if (date.value) {
        data.append("date", date.value);
      }
      // console.log('data', data.values()
      for (var value of data.values()) {
        console.log("data", value);
      }
      try {
        let response = await axios.post(
          `${process.env.VUE_APP_URL}/user/update/${id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          notify({
            type: "success",
            title: "Sửa thành thành công",
          });
        }
        console.log("res-update-user", response.data);
      } catch (error) {
        console.error(error.response);
        notify({
          type: "error",
          title: "Sửa thất bại",
        });
      }
    };

    const handleUpdate = (id) => {
      useRouter().push({ path: `/update-post/${id}` });
    };

    const changePaginator = (pageNumber) => {
      console.log("pageNumber", pageNumber);
      skip.value = Number(pageNumber - 1) * 10;
      limit.value = 10;
      console.log("limit", limit.value);
      fetchPosts();
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_URL}/user/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log('respon-iser', response.data.data)
        if (response.data.success) {
          user.value = response.data.data;
          username.value = response.data.data.username;
          name.value = response.data.data.name;
          email.value = response.data.data.email;
          imgSrc.value = response.data.data.img
            ? response.data.data.img.src
            : "";
          active.value = response.data.data.active;
          role.value = response.data.data.role;
          phone.value = response.data.data.phone
            ? response.data.data.phone
            : "";
          date.value = response.data.data.date ? response.data.data.date : "";
        }
        // console.log('respon', response)
      } catch (error) {
        console.error(error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_URL}/post/list?limit=${limit.value}&skip=${skip.value}`,
          {
            filter: {
              author: id,
            },
          }
        );
        if (response.data.success) {
          posts.value = response.data.data;
          count.value = response.data.count;
          console.log("count", response.data.count);
        }
        // console.log('respon-posts', response)
      } catch (error) {
        console.error(error.response);
      }
    };

    fetchUser();
    fetchPosts();
    // console.log('router', router.params.id)
    return {
      user,
      posts,
      handleUpdate,
      changePaginator,
      count,
      username,
      email,
      name,
      imgSrc,
      handleGetImg,
      active,
      role,
      phone,
      date,
      displayPass,
      display,
      password,
      handleUpdateUser,
      handleChangePass,
      arrRole,
      handleChageRole,
    };
  },
};
</script>
