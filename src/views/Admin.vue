<template>
  <div>
    <!-- {{this.$store.state.isAuth}} -->
    <AdminLayout>
      <template v-slot:default="search">
        <UserContent v-if="url == '/admin/users'" :contentSearch="search"/>

        <PostContent v-if="url == '/admin/posts'" />
        
        <CreatePost  v-if="url == '/admin/create-post'"/>

      </template>
    </AdminLayout>
  </div>
</template>
<script>
import AdminLayout from "../layout/AdminLayout.vue";
import UserContent from "../components/admin/User.vue";
import PostContent from "../components/admin/Post.vue";
import CreatePost from "../components/CreatePost.vue";
import { useRoute } from "vue-router";
import { onUpdated, ref } from "vue";
export default {
  components: {
    AdminLayout,
    UserContent,
    PostContent,
    CreatePost
  },
  setup() {
    const route = useRoute();
    const url = ref(route.path);
    console.log("url", url);
    console.log("route", route.name);
    onUpdated(() => {
      url.value = route.path;
    });
    return {
      url,
    };
  },
};
</script>
