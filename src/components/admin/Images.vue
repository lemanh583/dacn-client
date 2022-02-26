<template>
  <div class="table-content">
    <div v-if="loading" class="spinner-border" style="margin-left: 45%" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <div class="row">
      <div v-for="item in list" :key="item._id" class="col-3 ard-img">
        <div>
          <img class="img" :src="item.src" alt="" />
        </div>
        <i class="fa-solid fa-x destroy" @click="handleDestroy(item)"></i>
      </div>
      <Pagination
        class="pag"
        :count="count"
        :size="20"
        @changePaginator="changePaginator"
      />
    </div>
    <notifications />
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
    const limit = ref(20);
    const loading = ref(true)
    const fetchImgs = async () => {
      try {
        const rs = await axios.get(
          `${process.env.VUE_APP_URL}/image/list?skip=${skip.value}&limit=${limit.value}`
        );
        if (rs.data.success) {
          list.value = rs.data.data;
          count.value = rs.data.count;
          loading.value = false
        }
        // console.log("list", list.value);
      } catch (error) {
        console.error(error);
      }
    };

    const changePaginator = (pageNumber) => {
      skip.value = Number(pageNumber - 1) * 20;
      limit.value = 20;
      //   console.log('skip', skip.value)
      fetchImgs();
    };

    const handleDestroy = async (item) => {
      try {
        const rs = await axios.delete(
          `${process.env.VUE_APP_URL}/image/delete/${item._id}`
        );
        if (rs.data.success) {
          notify({
            type: "success",
            title: "Thành công",
          });
          fetchImgs();
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchImgs();
    return {
      list,
      count,
      changePaginator,
      handleDestroy,
      loading
    };
  },
};
</script>
<style scoped>
.img {
  width: 200px;
  height: 150px;
  object-fit: cover;
  object-position: top;
}
.destroy {
  position: absolute;
  top: 5px;
  right: 70px;
  color: cornflowerblue;
  display: none;
  cursor: pointer;
}
.ard-img {
  margin-bottom: 20px;
  position: relative;
}
.ard-img:hover .destroy {
  display: block;
}
.ard-img:hover img {
  transform: scale(1.1);
  transition: 0.4s ease-in-out;
  cursor: pointer;
}
.pag {
  display: flex;
  justify-content: flex-end;
}
</style>
