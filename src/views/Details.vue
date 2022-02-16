<template>
  <div>
    <Header :slug="categoryActive" @handleActive="handleActive" />
    <div class="container">
      <h1
        v-if="activePost"
        style="margin-top: 30px; margin-bottom: 2 0px; color: #04416d"
      >
        <strong>{{ category.name }}</strong>
      </h1>
      <div class="row">
        <div class="col-8">
          <div v-if="activePost" class="list-post">
            <Content v-for="p in posts" :key="p._id" :post="p" />
          </div>

          <div v-else class="content">
            <div class="header-content">
              <h6 style="color: #076db6">{{ post.category.name }}</h6>
              <h6 style="color: #757575">
                {{ new Date(post.created_time).toLocaleString() }}
              </h6>
            </div>
            <div class="title">
              <h1>
                <strong>{{ post.title }}</strong>
              </h1>
            </div>
            <div class="descriptions">
              <p>{{ post.descriptions }}</p>
            </div>
            <div class="content-detail" v-html="post.content"></div>
            <div class="comment">
              <div class="header-comment">
                <h4>Bình luận</h4>
                <form action="" style="display: flex">
                  <div style="width: 90%">
                    <textarea
                      type="text"
                      class="input-comment"
                      placeholder="Nhập bình luận của bạn"
                      v-model="comment"
                    >
                    </textarea>
                  </div>
                  <button
                    class="btn btn-success"
                    type="submit"
                    @click="handleCreateComment"
                    style="margin-left: 20px; height: 50px"
                  >
                    Gửi
                  </button>
                </form>
              </div>
              <div class="list-comment">
                <div
                  v-for="cmt in listCmt"
                  :key="cmt._id"
                  style="display: flex; margin-top: 10px"
                >
                  <img
                    style="
                      width: 50px;
                      height: 50px;
                      border-radius: 50%;
                      object-fit: cover;
                    "
                    :src="
                      cmt.author.img
                        ? cmt.author.img.src
                        : 'http://windows79.com/wp-content/uploads/2021/02/Thay-the-hinh-dai-dien-tai-khoan-nguoi-dung-mac.png'
                    "
                    alt=""
                  />
                  <p style="margin-left: 10px">
                    <strong>{{ cmt.author.name }}</strong>
                    {{ cmt.name }}
                  </p>
                </div>
              </div>
              <Pagination
                v-if="countCmt > 5"
                :count="countCmt"
                :size="5"
                @changePaginator="changePaginatorCmt"
              />
            </div>
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
import { useRoute, useRouter } from "vue-router";
import Pagination from "../components/pagination.vue";
import { checkToken } from "../module/index.js";
import axios from "axios";
import { notify } from "@kyvg/vue3-notification";
export default {
  components: {
    Header,
    Footer,
    Content,
    Pagination,
  },
  setup() {
    const router = useRoute();
    const routerPush = useRouter();
    const params = ref(router.params.slug);
    const post = ref({});
    const categoryActive = ref("");
    const conditionPost = ref("");
    const activePost = ref(null);
    const posts = ref([]);
    const count = ref(0);
    const comment = ref("");
    const store = useStore();
    const listCmt = ref([]);
    const countCmt = ref(5);
    const skipCmt = ref(0);
    const limitCmt = ref(5);
    const limitPost = ref(10);
    const skipPost = ref(0);
    const category = ref({});
    //  let isRole = computed(() => store.state.isRole);
    // const getParam = () => {
    //   params.value = router.params.slug
    //   fetchPostCate()
    // }

    const handleActive = () => {
      categoryActive.value = "";
      console.log("categoryActive", categoryActive.value);
    };

    const fetchPostCate = async () => {
      try {
        let response = await axios.get(
          `${process.env.VUE_APP_URL}/category/get/${params.value}`
        );
        if (response.data.success && response.data.data) {
          conditionPost.value = response.data.data._id;
          category.value = response.data.data;
          let resPosts = await axios.post(
            `${process.env.VUE_APP_URL}/post/list?skip=${skipPost.value}&limit=${limitPost.value}`,
            {
              filter: {
                category: conditionPost.value,
                approved: "1",
              },
            }
          );

          if (resPosts.data.success) {
            posts.value = resPosts.data.data;
            activePost.value = true;
            count.value = resPosts.data.count;
            console.log("count", count.value);
          }
          // console.log('posts', resPosts)
        } else {
          await fetchPost();
        }
      } catch (error) {
        console.error(error.response);
      }
    };

    const fetchPost = async () => {
      try {
        let response = await axios.get(
          `${process.env.VUE_APP_URL}/post/get/${params.value}`
        );
        if (response.data.success && response.data.data) {
          post.value = response.data.data;
          categoryActive.value = response.data.data.category.slug;
          activePost.value = false;
          await fetchComment();
        } else {
          routerPush.push({ path: "/404" });
        }

        console.log("post", post.value);
      } catch (error) {
        console.error(error.response);
        // routerPush.push({path: "/404"})
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

    const handleCreateComment = async (e) => {
      try {
        e.preventDefault();
        if (!comment.value) return;
        if (!store.state.isAuth) {
          notify({
            type: "error",
            title: "Cần đăng nhập!",
          });
          return;
        }
        // console.log("state", store.state.isAuth);
        // console.log('sdv', store.state.id)
        let response = await axios.post(
          `${process.env.VUE_APP_URL}/comment/create`,
          {
            post: post.value._id,
            author: store.state.id,
            name: comment.value,
          }
        );
        if (response.data.success) {
          comment.value = "";
          await fetchComment();
        }
      } catch (error) {
        console.error(error.response);
      }
    };

    const fetchComment = async () => {
      try {
        let response = await axios.post(
          `${process.env.VUE_APP_URL}/comment/list?skip=${skipCmt.value}&limit=${limitCmt.value}`,
          {
            filter: {
              post: post.value._id,
            },
          }
        );
        if (response.data.success) {
          listCmt.value = response.data.data;
          countCmt.value = response.data.count;
          console.log("listcmt", response.data.data);
        }
      } catch (error) {
        console.error(error.response);
      }
    };

    const changePaginatorCmt = async (number) => {
      skipCmt.value = (number - 1) * 5;
      await fetchComment();
    };

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
    // fetchPost()
    console.log("route", router.params.slug);
    console.log("test back");
    return {
      post,
      categoryActive,
      activePost,
      posts,
      handleActive,
      count,
      handleCreateComment,
      comment,
      listCmt,
      countCmt,
      changePaginatorCmt,
      category,
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
