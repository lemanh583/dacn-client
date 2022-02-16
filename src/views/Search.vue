<template>
  <div>
    <Header />
    <div class="container">
      <h1 style="margin-top: 30px; margin-bottom: 2 0px; color: #04416d">
        <span class="text-danger"> <strong>Tìm kiếm: </strong> </span
        ><strong>{{ params }}</strong>
      </h1>
      <div class="row">
        <div class="col-8">
          <div class="list-post">
            <Content v-for="p in posts" :key="p._id" :post="p" />
          </div>
          <Pagination
            style="margin-top: 30px"
            :count="count"
            :size="10"
            @changePaginator="changePaginatorPost"
          />
        </div>
      </div>
    </div>
    <Footer />
    <notifications />
  </div>
</template>
<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Content from "../components/Content.vue";
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Pagination from "../components/pagination.vue";
import { checkToken } from "../module/index.js";
import axios from "axios";

export default {
  components: {
    Header,
    Footer,
    Content,
    Pagination,
  },
  setup() {
    const router = useRoute();
    const params = ref(router.params.slug);
    const post = ref({});
    const categoryActive = ref("");
    // const conditionPost = ref("");
    const activePost = ref(null);
    const posts = ref([]);
    const count = ref(1);
    const comment = ref("");
    const store = useStore();
    const listCmt = ref([]);
    const limitPost = ref(10);
    const skipPost = ref(0);
    const category = ref({});
    //  let isRole = computed(() => store.state.isRole);
    // const getParam = () => {
    //   params.value = router.params.slug
    //   fetchPostCate()
    // }

    const fetchPostCate = async () => {
      try {
        console.log("params", params.value);
        let resPosts = await axios.post(
          `${process.env.VUE_APP_URL}/post/list?skip=${skipPost.value}&limit=${limitPost.value}`,
          {
            filter: {
              approved: "1",
            },
            search: params.value,
          }
        );

        if (resPosts.data.success) {
          console.log("vdsd", resPosts.data);
          posts.value = resPosts.data.data;
          activePost.value = true;
          count.value = resPosts.data.count;
          console.log("count", count.value);
        }
        // console.log('posts', resPosts)
      } catch (error) {
        console.error(error.response);
      }
    };

    fetchPostCate();

    watch(
      () => router.params.slug,
      (cur) => {
        params.value = cur;
        fetchPostCate();
        // console.log("dhvi");
      }
    );
    const changePaginatorPost = async (number) => {
      skipPost.value = (number - 1) * 10;
      await fetchPostCate();
    };

    checkToken().then((result) => {
      if (result) {
        console.log("result", result);
        store.commit("setAuth", true);
        store.commit("setRole", result.data.role);
        store.commit("setName", result.data.name);
        store.commit("setId", result.data._id);
        if (result.data.img) {
          store.commit("setImg", result.data.img.src);
        }
      }
    });

    return {
      post,
      categoryActive,
      activePost,
      posts,
      count,
      comment,
      listCmt,
      category,
      params,
      changePaginatorPost,
    };
  },
};
</script>
<style>
.header-content {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  margin-bottom: 10px;
}
.content-detail img {
  max-width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.header-comment h4 {
  margin-top: 50px;
  font-size: 18px;
  font-weight: 700;
  padding-left: 20px;
  box-shadow: -5px 0px #fda13e;
  margin-left: 5px;
}
.input-comment {
  border: 1px solid #d0021b;
  width: 100%;
  height: 50px;
  border-radius: 10px;
  padding-top: 13px;
  padding-left: 20px;
}
</style>
