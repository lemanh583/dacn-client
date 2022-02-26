<template>
  <div>
    <!-- {{this.$store.state.isAuth}} -->
    <AdminLayout>
      <template v-slot:default="search">
        <UserContent v-if="url == '/admin/users'" :contentSearch="search"/>

        <PostContent v-if="url == '/admin/posts'" :contentSearch="search"/>

        <CategoryContent v-if="url == '/admin/categories' && this.$store.state.isRole == 0" />
        <p v-if="url == '/admin/categories' && this.$store.state.isRole != 0"> Bạn không có quyền truy cập vào tính năng này! </p>
        
        <CreatePost  v-if="url == '/admin/create-post'"/>

        <Dashboard  v-if="url == '/admin/dashboard'"/>

        <CreateUser  v-if="url == '/admin/create-user'"/>

        <Images  v-if="url == '/admin/images'"/>

        <Comments  v-if="url == '/admin/comments'"/>

      </template>
    </AdminLayout>
  </div>
</template>
<script>
import AdminLayout from "../layout/AdminLayout.vue";
import UserContent from "../components/admin/User.vue";
import PostContent from "../components/admin/Post.vue";
import CreatePost from "../components/CreatePost.vue";
import Dashboard from "../components/admin/Dashboard.vue";
import CreateUser from "../components/admin/CreateUser.vue";
import CategoryContent from "../components/admin/Categories.vue";
import Images from "../components/admin/Images.vue";
import Comments from "../components/admin/Comments.vue";
import { useStore } from "vuex";
import { checkToken } from "../module/index.js";
import { useRoute } from "vue-router";
import { onUpdated, ref } from "vue";
export default {
  components: {
    AdminLayout,
    UserContent,
    PostContent,
    CreatePost,
    Dashboard,
    CreateUser,
    CategoryContent,
    Images,
    Comments
  },
  setup() {
    const route = useRoute();
    const url = ref(route.path);
     const store = useStore();
    console.log("url", url);
    console.log("route", route.name);
    onUpdated(() => {
      url.value = route.path;
    });

    checkToken().then((result) => {
      if (result) {
        console.log("result", result);
        store.commit("setAuth", true);
        store.commit("setRole", result.data.role);
        store.commit("setName", result.data.name);
        store.commit('setId', result.data._id)
      }
    });
    return {
      url,
    };
  },
};
</script>
