<template>
  <div>
    <Header />
    <div class="container" style="">
      <div class="row">
        <div class="col-8">
          <ContentBig :post="post[0]" :flag="true" />
        </div>
        <div class="col-4">
          <ContentBig :post="post[0]" :flag="false" />
        </div>
      </div>
      <div class="row" style="">
        <div class="col-8" style="">
          <div class="category">
            <h3>Thời sự</h3>
          </div>
          <Content />
          <Content />
          <Content />
          <Content />
          <div class="category mar-50">
            <h3>Thời sự</h3>
          </div>
          <Content />
          <Content />
          <Content />
          <Content />
          <div class="category mar-50">
            <h3>Thời sự</h3>
          </div>
          <Content />
          <Content />
          <Content />
          <Content />
        </div>
        <div class="col-4">
          <div class="category">
            <h3>Thời sự</h3>
          </div>
          <ContentBig :post="post[0]" :flag="false" />
          <ContentSmall />
          <div class="category mar-50">
            <h3>Thời sự</h3>
          </div>
          <ContentSmall />
          Đang được quan tâm Tin mới nhất Random tin
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "../components/Header.vue";
import Content from "../components/Content.vue";
import Footer from "../components/Footer.vue";
import ContentBig from "../components/contentBig.vue";
import ContentSmall from "../components/contentSmall.vue";
import {ref} from "vue"
import axios from "axios"
export default {
  components: {
    Header,
    Content,
    Footer,
    ContentBig,
    ContentSmall,
  },
  setup() {
    const post = ref([])
    const fechPost = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_URL}/post/list`)
        post.value = response.data.data
        console.log('post', response.data)
      } catch (error) {
        console.error(error);
      }
    }
    fechPost()
    return {
      post
    }
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
