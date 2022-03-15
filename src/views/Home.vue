<template>
  <div>
    <Header />
    <!-- {{ this.$store.state.isAuth }}
    {{ this.$store.state.isRole }}
    {{ this.$store.state.nameUser }}
    {{ this.$store.state.id }}
    {{ this.$store.state.img }} -->
    <div class="container" style="">
      <div class="row">
        <div class="col-8">
          <ContentBig :post="bigPost[0]" :flag="true" />
        </div>
        <div class="col-4">
          <ContentBig :post="bigPost[1]" :flag="false" />
          <Content :post="bigPost[2]" :flag="false" />
        </div>
      </div>
      <div class="row" style="">
        <div class="col-8" style="">
          <div v-for="(value, key) in listPost" :key="key">
            <div :class="['category', key != 'Thời sự' ? 'mar-50' : '']">
              <h3>{{ key }}</h3>
            </div>
            <Content v-for="post in value" :key="post._id" :post="post" />
          </div>
        </div>
        <div class="col-4">
          <div class="category">
            <h3>Được quan tâm</h3>
          </div>
          <!-- <ContentBig :post="post[0]" :flag="false" /> -->
          <ContentSmall :posts="listViewPost" />
          <div class="category mar-50">
            <h3>Tin mới nhất</h3>
          </div>
          <ContentSmall :posts="listNewPost" />
          <!-- Đang được quan tâm Tin mới nhất Random tin -->
        </div>
      </div>
    </div>
    <Footer />
    <!-- </LayoutPage> -->
    <!--Start of Webchat Script-->
    
    <!--End of Webchat Script-->
  </div>
</template>
<script>
import Content from "../components/Content.vue";
import ContentBig from "../components/contentBig.vue";
import ContentSmall from "../components/contentSmall.vue";
import Header from "../components/Header.vue";
import { checkToken } from "../module/index.js";
import { useStore } from "vuex";
import { ref } from "vue";
import axios from "axios";
import Footer from "../components/Footer.vue";

export default {
  components: {
    Content,
    ContentBig,
    ContentSmall,
    Header,
    Footer,
  },
  setup() {
    const post = ref([]);
    const store = useStore();
    const listPost = ref({});
    const bigPost = ref([]);
    const listViewPost = ref([]);
    const listNewPost = ref([]);

    const fetchPostRight = async () => {
      try {
        let response = await axios.post(
          `${process.env.VUE_APP_URL}/post/list?limit=6`,
          {
            sort: {
              view: -1,
            },
            filter: {
              approved: 1,
            },
          }
        );
        let rs = await axios.post(
          `${process.env.VUE_APP_URL}/post/list?limit=6`,
          {
            sort: {
              created_time: -1,
            },
            filter: {
              approved: 1,
            },
          }
        );
        if (response.data.success && rs.data.success) {
          listViewPost.value = response.data.data;
          listNewPost.value = rs.data.data;
        }
        console.log("fetchPostRight", response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPostRight();
    const fechPost = async () => {
      try {
        const list = await axios.get(
          `${process.env.VUE_APP_URL}/category/list`
        );
        console.log("listpost", list.data.data);
        if (list.data.success) {
          for (let i = 0; i < list.data.data.length; i++) {
            let response = await axios.post(
              `${process.env.VUE_APP_URL}/post/list?limit=3`,
              {
                filter: {
                  category: list.data.data[i]._id,
                  approved: 1,
                },
              }
            );
            if (response.data.success) {
              listPost.value[list.data.data[i].name] = response.data.data;
            }
          }

          // await Promise.all(
          //   list.data.data.map(async (cate) => {
          //     let response = await axios.post(
          //       `${process.env.VUE_APP_URL}/post/list?limit=3`,
          //       {
          //         filter: {
          //           category: cate._id,
          //           approved: 1,
          //         },
          //       }
          //     );
          //     if (response.data.success) {
          //       listPost.value[cate.name] = response.data.data;
          //     }
          //   })
          // );
          console.log("listpost", listPost.value);
        }
      } catch (error) {
        console.error(error.response);
      }
    };

    const fetchBigPost = async () => {
      try {
        const resbigPost = await axios.post(
          `${process.env.VUE_APP_URL}/post/list?limit=3`,
          {
            filter: { approved: 1 },
            sort: {
              created_time: -1,
            },
          }
        );
        if (resbigPost.data.success) {
          console.log('bigposst', resbigPost.data.data)
          bigPost.value = resbigPost.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkToken().then((result) => {
      if (result) {
        console.log("result", result);
        store.commit("setAuth", true);
        store.commit("setRole", result.data.role);
        store.commit("setName", result.data.name);
        store.commit("setId", result.data._id);
        console.log("rs", result);
        if (result.data.img) {
          store.commit("setImg", result.data.img.src);
        }
      }
    });
    fetchBigPost();
    fechPost();

    return {
      post,
      listPost,
      bigPost,
      listViewPost,
      listNewPost,
    };
  },
};
</script>

<style scoped>
.category h3 {
  font-size: 18px;
  font-weight: 700;
  padding-left: 20px;
  box-shadow: -5px 0px #fda13e;
  margin-left: 5px;
}
.mar-50 {
  margin-top: 50px;
}

/* .brand {
  background-color: #ee002d;
  height: 100px;
}
.logo {
  margin-top: 10px;
  color: white;
}
.form-search {
  border: 1px solid black;
  margin-right: 50px;
  background-color: white;
  padding: 5px;
  border-radius: 10px;
}
.form-search:hover {
  border: 1px solid rgb(22, 211, 54);
}
.input-search {
  border: none;
}
.input-search:focus {
  outline: none;
} */
</style>
