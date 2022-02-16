<template>
  <div class="table-content">
    <form method="POST">
      <div class="form-group">
        <label for="exampleInputEmail1"><strong>Nhập username</strong></label>
        <input type="text" class="form-control" v-model="username" />
      </div>
      <p class="text-danger">{{ handleNotification(arrErrors, "username") }}</p>
      <div class="form-group">
        <label for="exampleInputEmail1"><strong>Nhập email</strong></label>
        <input type="text" class="form-control" v-model="email" />
      </div>
      <p class="text-danger">
        {{ handleNotification(arrErrors, "email") }}
      </p>
      <div class="form-group">
        <label for="exampleInputEmail1"><strong>Nhập họ tên</strong></label>
        <input type="text" class="form-control" v-model="name" />
      </div>
      <p class="text-danger">{{ handleNotification(arrErrors, "name") }}</p>
      <div class="form-group">
        <label for="exampleInputEmail1"><strong>Nhập mật khẩu</strong></label>
        <input type="password" class="form-control" v-model="password" />
      </div>
      <p class="text-danger">{{ handleNotification(arrErrors, "password") }}</p>
      <div class="form-group">
        <label for="exampleInputEmail1"
          ><strong>Nhập lại mật khẩu</strong></label
        >
        <input type="password" class="form-control" v-model="rePassword" />
      </div>
      <p class="text-danger">
        {{ handleNotification(arrErrors, "rePassword") }}
      </p>

      <button type="submit" class="btn btn-primary" @click="handelRegister">
        Submit
      </button>
    </form>
    <notifications />
  </div>
</template>
<script>
import { ref } from "vue";
import axios from "axios";
import { handleNotification } from "../../module/index.js";
import { notify } from "@kyvg/vue3-notification";
export default {
  setup() {
    const username = ref("");
    const email = ref("");
    const rePassword = ref("");
    const password = ref("");
    const name = ref("");
    const arrErrors = ref([]);

    const handelRegister = async (event) => {
      try {
        event.preventDefault();
        let data = {
          username: username.value,
          email: email.value,
          name: name.value,
          password: password.value,
          rePassword: rePassword.value,
        };
        const response = await axios.post(
          `${process.env.VUE_APP_URL}/user/create`,
          data
        );
        console.log("responseReg", response);
        if (response.data.success) {
          notify({
            type: "success",
            title: "Tạo thành công",
          });
          username.value = ""
          name.value = ""
          email.value = ""
          password.value = ""
          rePassword.value = ""
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.data.errors) {
          arrErrors.value = error.response.data.errors;
        } else {
          arrErrors.value = [];
        }
      }
    };

    return {
      username,
      email,
      rePassword,
      password,
      name,
      arrErrors,
      handelRegister,
      handleNotification,
    };
  },
};
</script>
