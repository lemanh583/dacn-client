<template>
  <div class="row">
  
    <div v-for="(b, i) in block" :key="i" class="col-xl-3 col-md-6 mb-4">
      <div class="card border-left-success shadow h-100 py-2">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div
                class="text-xs font-weight-bold text-success text-uppercase mb-1"
              >
                {{b.name}}
              </div>
              <div class="h5 mb-0 font-weight-bold text-gray-800">{{b.count}}</div>
            </div>
            <div class="col-auto">
              <i :class="b.icon"></i>
              <i class=""></i>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import {ref} from "vue";
import axios from "axios"
export default {
  setup() {
    const block = ref([
      {
        name: "Số lượng người dùng",
        count: "10",
        icon: "fa-solid fa-users fa-2x text-gray-300"
      },
      {
        name: "Số lượng người dùng bị chặn",
        count: "10",
        icon: "fa-solid fa-user-large-slash fa-2x text-gray-300"
      },
      {
        name: "Số lượng người trong ngày",
        count: "10",
        icon: "fa-solid fa-user-plus fa-2x text-gray-300"
      },
      {
        name: "Số lượng quản trị viên",
        count: "10",
        icon: "fa-solid fa-user-gear fa-2x text-gray-300"
      },
      {
        name: "Số lượng cộng tác viên",
        count: "10",
        icon: "fa-solid fa-user-pen fa-2x text-gray-300"
      },
      {
        name: "Số lượng bài viết",
        count: "10",
        icon: "fa-solid fa-newspaper fa-2x text-gray-300"
      },
      {
        name: "Số lượng bài viết trong ngày",
        count: "10",
        icon: "fa-solid fa-paper-plane fa-2x text-gray-300"
      },
      {
        name: "Số lượng bài viết chưa được duyệt",
        count: "10",
        icon: "fa-solid fa-file-slash fa-2x text-gray-300"
      },
      {
        name: "Số lượng thể loại",
        count: "10",
        icon: "fa-brands fa-algolia fa-2x text-gray-300"
      },

    ])

    const fetchDashboard = async () => {
      try {
         const response = await axios.get(
          `${process.env.VUE_APP_URL}/dashboard/get`
        );
        if(response.data.success) {
          block.value[0].count = response.data.data.member
          block.value[1].count = response.data.data.userBlock
          block.value[2].count = response.data.data.userToday
          block.value[3].count = response.data.data.moderator
          block.value[4].count = response.data.data.collaborators
          block.value[5].count = response.data.data.postActive
          block.value[6].count = response.data.data.postToday
          block.value[7].count = response.data.data.postNotActive
          block.value[8].count = response.data.data.categories
        }
        console.log('rs', response)
      } catch (error) {
        console.error(error.response)
      }
    }
    fetchDashboard()



    return {
      block
    }
  },
}
</script>
