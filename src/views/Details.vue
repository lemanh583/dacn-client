<template>
  <div>
    <Header :slug="categoryActive" @handleActive="handleActive"/>
    <div class="container">
      <div class="row">
        <div class="col-8">
          
          <div v-if="activePost" class="list-post">
            <Content v-for="p in posts"  :key="p._id" :post="p" />
          </div>

          <div v-else class="content">
            <div class="title">
              <h1>{{ post.title }}</h1>
            </div>
            <div class="descriptions">
              <p>{{ post.descriptions }}</p>
            </div>
            <div class="content-detail" v-html="post.content"></div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Content from "../components/Content.vue"
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
export default {
  components: {
    Header,
    Footer,
    Content
  },
  setup() {
    const router = useRoute();
    const routerPush = useRouter();
    const params = ref(router.params.slug);
    const post = ref({});
    const categoryActive = ref("");
    const conditionPost = ref("");
    const activePost = ref(null)
    const posts = ref([])
    
    // const getParam = () => {
    //   params.value = router.params.slug
    //   fetchPostCate()
    // }

    const handleActive = () => {
      categoryActive.value = ""
      console.log('categoryActive', categoryActive.value)
    }

    const fetchPostCate = async () => {
      try {
        let response = await axios.get(
          `${process.env.VUE_APP_URL}/category/get/${params.value}`
        );
        if (response.data.success && response.data.data) {
          conditionPost.value = response.data.data._id;
          let resPosts = await axios.post(`${process.env.VUE_APP_URL}/post/list`, {
            filter: {
              category: conditionPost.value,
            },
          });

          if(resPosts.data.success) { 
            posts.value = resPosts.data.data
            activePost.value = true
          }     
          // console.log('posts', resPosts)
        }
        else {
          fetchPost()
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
        if(response.data.success && response.data.data) {
          post.value = response.data.data;
          categoryActive.value = response.data.data.category.slug;
          activePost.value = false
        } else {
          routerPush.push({path: "/404"})
        }

        // console.log("post", post.value);
      } catch (error) {
        console.error(error.response);
        // routerPush.push({path: "/404"})
      }
    };
    fetchPostCate()

     watch( () => router.params.slug, (cur) => {
         params.value = cur
         fetchPostCate()
         console.log('dhvi')
      }
    );

    // fetchPost()
    console.log("route", router.params.slug);
    console.log('test back')
    return {
      post,
      categoryActive,
      activePost,
      posts,
      handleActive
    };
  },
};
</script>
<style>
.content-detail img {
  max-width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
