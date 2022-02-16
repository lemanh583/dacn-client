<template>
  <div>
    <div class="table-content">
       <div class="head">
        <select
          class="custom-select"
          v-model="accept"
          @change="handleChangeAccept"
        >
          <option value="">Tất cả</option>
          <option value="1">Xác nhận</option>
          <option value="0">Chưa xác nhận</option>  
        </select>
        <select
          class="custom-select"
          @change="handleChangeSort"
          v-model="sortModel"
        >
          <option value="0">Thời gian tạo mới nhất</option>
          <option value="1">Thời gian tạo cũ nhất</option>
          <option value="2">Lượt xem ít nhất</option>
          <option value="3">Lượt xem nhiều nhất</option>
        </select>
        
        <select
          class="custom-select"
          @change="handleChangeCategory"
          v-model="categoryModel"
        >
          <option value="">Thể loại</option>
          <option v-for="ca in listCategory" :key="ca._id" :value="ca._id">{{ca.name}}</option>
        </select>

      </div>
      <div class="table-responsive">
        <table class="table">
            <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tiêu đề</th>
              <th scope="col">Thể loại</th>
              <th scope="col">Tác giả</th>
              <th scope="col">Lượt xem</th>
              <th scope="col">Tạo lúc</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
           <tbody style="position: relative">
            <div v-if="loading" class="spinner-border loading" role="status">
              <span class="sr-only">Loading...</span>
            </div>
           <tr v-else v-for="(item, index) in listPost" :key="index">
              <th scope="row">{{ skip + index + 1}}</th>
              <td>{{ item.title.slice(0,50)}}...</td>
              <td>{{ item.category.name }}</td>
              <td>{{ item.author.name }}</td>
              <td>{{ item.view }}</td>
              <td>{{ new Date(item.created_time).toLocaleString() }}</td>
              <td v-if="item.approved == 0"><span @click="handleApproved(item)">Duyệt</span></td>
              <td v-if="item.approved == 1"><span class="text-success">Done</span></td>
              <td>
                  <span class="text-warning" @click="handleUpdate(item.slug)">Xem</span> /
                  <span class="text-danger"  @click="handleDelete(item._id)">Xoá</span>
              </td>
            </tr>
           </tbody>
        </table>
        <Pagination :count="count" :size="10" @changePaginator="changePaginator"/>
      </div>
    </div>
     <notifications />
  </div>
</template>
<script>
import { watch, ref } from "vue";
import axios from "axios";
import { notify } from "@kyvg/vue3-notification";
import {useRouter} from "vue-router"
import Pagination from "../pagination.vue";
// import ModalUser from "./ModalUser.vue";

export default {
  props: ["contentSearch"],
  components: {
    Pagination,
  },
  setup(props) {
    const listPost = ref([])
    const token = localStorage.getItem("token");
    const search = ref("");
    // const filter = ref("");
    const count = ref(0);
    const accept = ref('')
    const sortModel = ref('0')
    const sort = ref({created_time: -1})
    const router = useRouter()
    const loading = ref(true);
    const approved = ref("")
    const category = ref("")
    const categoryModel = ref("")
    const listCategory = ref([])
    const skip = ref(0)
    const limit = ref(10)

    watch(
      () => props.contentSearch.search,
      (cur) => {
        search.value = cur;
        loading.value = true;
        setTimeout(() => {
          fetchListPost();
        }, 1000);
      }
    );

    const handleDelete = async (id) => {
      try {
        const rs = await axios.delete(`${process.env.VUE_APP_URL}/post/delete/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(rs.data.success) {
          notify({
            type: "success",
            title: "Xoá thành công",
          });
          fetchListPost()
        }
      } catch (error) {
         console.error(error.response);
          notify({
            type: "error",
            title: "Xoá thất bại",
          });
      }
    }

    const handleUpdate = (id) => {
      router.push({path: `/update-post/${id}`})  
    }

    const changePaginator = (pageNumber) => {
      console.log('pageNumber', pageNumber)
      skip.value = Number(pageNumber - 1) * 10;
      limit.value = 10;
      console.log('limit', limit.value)
      fetchListPost()
    }


    const fetchListPost = async () => {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_URL}/post/list?limit=${limit.value}&skip=${skip.value}`,
          {
            search: search.value,
            filter: {
              category: category.value,
              approved: approved.value
            },
            sort: sort.value
          },
        );
        if (response.data.success) {
          listPost.value = response.data.data;
          count.value = response.data.count;
          loading.value = false;
        }
        console.log("response post", response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const handleApproved = async (item) => {
      try {
        const list = await axios.post(`${process.env.VUE_APP_URL}/post/update/${item._id}`, {
          approved: 1
        },{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (list.data.success) {
          notify({
            type: "success",
            title: "Thành công",
          });
        }
        fetchListPost()
      } catch (error) {
        console.error(error.response);
          notify({
            type: "error",
            title: "Thất bại",
          });
      }
    }


     const fetchCategory = async () => {
      try {
        const list = await axios.get(
          `${process.env.VUE_APP_URL}/category/list`
        );
        if (list.data.success) {
          listCategory.value = list.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategory();
    
    const handleChangeAccept = () => {
      approved.value = accept.value
      fetchListPost()
    }

    const handleChangeCategory = () => {
      category.value = categoryModel.value
      fetchListPost()
    }

    const handleChangeSort = () => {
      if(sortModel.value == 0) {
        sort.value = {
          created_time: -1
        }
      }
      if(sortModel.value == 1) {
        sort.value = {
          created_time: 1
        }
      }
      if(sortModel.value == 2) {
        sort.value = {
          view: 1
        }
      }
      if(sortModel.value == 3) {
        sort.value = {
          view: -1
        }
      }
      fetchListPost()
    }
    

    fetchListPost()

    return {
      loading,
      accept,
      handleChangeAccept,
      handleChangeSort,
      sortModel,
      handleChangeCategory,
      categoryModel,
      listCategory,
      listPost,
      handleApproved,
      count,
      changePaginator,
      skip,
      handleUpdate,
      handleDelete
    }
  }
}
</script>
<style scoped>
.loading {
  position: absolute;
  left: 48%;
  top: 30%;
}
.head {
  margin-bottom: 20px;
  width: 80%;
  display: flex;
}
span:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
