<template>
  <div>
    <div class="table-content">
      <div class="form-group" style="display: flex">
        <input
          style="width: 300px"
          type="text"
          class="form-control"
          v-model="add"
        />
        <button
          class="btn btn-success"
          style="margin-left: 30px"
          @click="handleAdd"
        >
          Thêm
        </button>
      </div>
      <div class="head">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tiêu đề</th>
              <th scope="col" style="text-align: center">slug</th>
              <th scope="col">Ngày tạo</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody style="position: relative;">
            <div
              v-if="loading"
              class="spinner-border"
              style="position: absolute;margin-left: 45%"
              role="status"
            >
              <span class="sr-only">Loading...</span>
            </div>
            <tr v-for="(item, index) in list" :key="item._id">
              <th scope="row">{{ index + 1 }}</th>
              <td style="width: 350px">
                <div class="form-group">
                  <input
                    :disabled="dis[item._id]"
                    type="text"
                    class="form-control"
                    v-model="model[item._id]"
                  />
                </div>
              </td>
              <td style="text-align: center">{{ item.slug }}</td>
              <td>{{ new Date(item.created_time).toLocaleString() }}</td>
              <td>
                <a
                  v-if="dis[item._id]"
                  class="text-warning"
                  @click="handleOpenInput(item._id)"
                  >Sửa</a
                >
                <a
                  v-if="!dis[item._id]"
                  class="text-success"
                  @click="handleUpdate(item._id)"
                  >Cập nhật</a
                >

                /
                <a class="text-danger" @click="handleDelete(item._id)">Xoá</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <notifications />
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import axios from "axios";
import { notify } from "@kyvg/vue3-notification";
export default {
  setup() {
    const list = ref([]);
    const model = ref({});
    const dis = ref({});
    const add = ref("");
    const loading = ref(true)
    const fetchCategory = async () => {
      try {
        const rs = await axios.get(`${process.env.VUE_APP_URL}/category/list`);
        if (rs.data.success) {
          list.value = rs.data.data;
          list.value.forEach((element) => {
            model.value[element._id] = element.name;
            dis.value[element._id] = true;
          });
          loading.value = false
        //   console.log("mode", model.value["61ae1fc88d2569dcad0678a8"]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const handleOpenInput = (id) => {
      dis.value[id] = !dis.value[id];
    };

    const handleUpdate = async (id) => {
      try {
        dis.value[id] = !dis.value[id];
        let rs = await axios.post(
          `${process.env.VUE_APP_URL}/category/update/${id}`,
          {
            name: model.value[id].trim(),
          }
        );
        if (rs.data.success) {
          notify({
            type: "success",
            title: "Thành công",
          });
          fetchCategory();
        }
      } catch (error) {
        console.error(error);
      }
    };

    const handleAdd = async () => {
      try {
        if (!add.value) return;
        let rs = await axios.post(
          `${process.env.VUE_APP_URL}/category/create`,
          {
            name: add.value.trim(),
          }
        );
        if (rs.data.success) {
          notify({
            type: "success",
            title: "Thành công",
          });
          fetchCategory();
        }
      } catch (error) {
        console.error(error);
      }
    };

    const handleDelete = async (id) => {
      let rs = await axios.delete(
        `${process.env.VUE_APP_URL}/category/delete/${id}`
      );
      if (rs.data.success) {
        notify({
          type: "success",
          title: "Thành công",
        });
        fetchCategory();
      }
    };

    fetchCategory();
    return {
      list,
      model,
      dis,
      handleOpenInput,
      handleUpdate,
      add,
      handleAdd,
      handleDelete,
      loading
    };
  },
};
</script>
