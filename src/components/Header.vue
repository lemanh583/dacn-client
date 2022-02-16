<template>
  <div>
    <div class="full-width brand">
      <div class="container">
        <div class="row">
          <div class="col-6 logo">
            <div>
              <h1>WEBNEWSLM</h1>
              <p>Chào mừng bạn đến với chúng tôi</p>
            </div>
          </div>
          <div class="col-6 flx-end alg-center">
            <div class="form-search">
              <form method="POST">
                <div class="input-group">
                  <input
                    type="text"
                    class="input-search"
                    placeholder="Tìm kiếm"
                    v-model="search"
                  />
                  <button
                    style="border: none; background-color: white"
                    type="submit"
                    @click="handleSearchPost"
                  >
                    <i class="fas fa-search auto-margin"></i>
                  </button>
                </div>
              </form>
            </div>
            <div>
              <div style="position: relative;">
                <div
                  v-if="this.$store.state.isAuth"
                  class="button-name"
                  @click="handleOpenDrowdown"
                >
                  <img style="width: 30px; height: 30px;border-radius: 50%;margin-right: 10px;object-fit: cover;" :src="this.$store.state.img" alt="">
                  <strong>{{ this.$store.state.nameUser }}</strong> 
                  <i
                    v-if="openDropdown"
                    class="fa-solid fa-arrow-down"
                    style="font-size: 20px;margin-left: 10px"
                  ></i>
                  <i
                    v-if="!openDropdown"
                    class="fa-solid fa-arrow-up"
                    style="font-size: 20px;margin-left: 10px;"
                  ></i>
                </div>
                <div v-if="openDropdown" class="drowdown-custome">
                  <router-link :to="`/update-user/${this.$store.state.id}`" >
                    <p class="drop-link">Thông tin cá nhân</p> 
                  </router-link>
                  <router-link v-if="this.$store.state.isAuth && [0,1,2].indexOf(this.$store.state.isRole) >= 0" to="/create-post">
                    <p class="drop-link">Tạo bài viết</p> 
                  </router-link>
                   <router-link v-if="this.$store.state.isAuth && this.$store.state.isRole == 0 || this.$store.state.isRole == 1" to="/admin/dashboard">
                    <p class="drop-link">Trang admin</p> 
                  </router-link>
                  <router-link to="" @click="handleLogout">
                    <p class="drop-link">Đăng xuất</p>
                  </router-link>
                </div>
              </div>
              <span v-if="!isAuth">
                <router-link to="/login">
                  <button class="btn btn-success" style="margin-right: 10px">
                    Đăng nhập
                  </button>
                </router-link>
                <router-link to="/register">
                  <button class="btn btn-success">Đăng ký</button>
                </router-link>
              </span>

              <!-- <span class="text-light" v-else @click="handleLogout">
                <router-link class="text-light" to="">Đăng xuất /    </router-link>
              </span>
              <span v-if="this.$store.state.isAuth">
                <router-link class="text-light" :to="`/update-user/${this.$store.state.id}`">Thông tin cá nhân</router-link>
              </span>
              <span v-if="this.$store.state.isAuth && [0,1,2].indexOf(this.$store.state.isRole) >= 0">
                 <router-link class="text-light" to="/create-post"> / Tạo bài viết</router-link>
              </span>
              <span v-if="this.$store.state.isAuth && this.$store.state.isRole == 0 || this.$store.state.isRole == 1">
                 <router-link class="text-light" to="/admin/dashboard"> / Admin</router-link>
              </span> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="['nav-bar-header', fixed ? 'fixed' : '']">
      <div class="container">
        <div class="flx jtc-start">
          <ul class="flx">
            <router-link to="/">
              <li
                @click="handleActive"
                :class="[params == undefined ? 'active' : '']"
                :style="fixed ? 'padding: 15px' : ''"
              >
                <strong> Home </strong>
              </li>
            </router-link>
            <span v-for="category in listCategory" :key="category._id">
              <router-link :to="`/${category.slug}`">
                <li
                  @click="handleActive"
                  :class="[
                    params == category.slug || slug == category.slug
                      ? 'active'
                      : '',
                  ]"
                  :style="fixed ? 'padding: 15px' : ''"
                >
                  <strong> {{ category.name }} </strong>
                </li>
              </router-link>
            </span>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
export default {
  props: ["slug"],
  setup(props, context) {
    const fixed = ref(false);
    const listCategory = ref([]);
    // const menu = ref([])
    const search = ref("")
    const route = useRoute();
    const router = useRouter();
    const params = ref(route.params.slug);
    const store = useStore();
    const isAuth = computed(() => store.state.isAuth);
    const openDropdown = ref(false);
    const fetchCategory = async () => {
      try {
        const list = await axios.get(
          `${process.env.VUE_APP_URL}/category/list`
        );
        if (list.data.success) {
          listCategory.value = list.data.data;
        }
        console.log("list", list);
      } catch (error) {
        console.error(error);
      }
    };

    const handleActive = () => {
      setTimeout(() => {
        params.value = route.params.slug;
        console.log("router.params.slug", route.params.slug);
      }, 100);
      context.emit("handleActive", true);
      console.log("props.slug", props.slug);
    };

    const handleLogout = () => {
      localStorage.setItem("token", "");
      store.commit("setAuth", false);
      store.commit("setRole", Number);
      store.commit("setName", "");
      store.commit("setId", "");
      openDropdown.value = !openDropdown.value
    };

    const handleOpenDrowdown = () => {
      openDropdown.value = !openDropdown.value;
    };

    const handleSearchPost = async (e) => {
      e.preventDefault()
      if(!search.value) return 
      router.push({path: `/search/${search.value}`})
      console.log('searc', search.value)
    }

    onMounted(() => {
      // console.log('props.slug', props.slug)
      // window.document.onscroll = () => {
      //   let nav = document.querySelector(".nav-bar-header");
      //   if (window.scrollY > nav.offsetTop) {
      //     fixed.value = true;
      //   } else {
      //     fixed.value = false;
      //     console.log(fixed.value);
      //   }
      // };
    });

    // call function

    fetchCategory();

    return {
      fixed,
      listCategory,
      handleActive,
      params,
      handleLogout,
      handleOpenDrowdown,
      search,
      handleSearchPost,
      openDropdown,
      isAuth,
      props,
    };
  },
};
</script>

<style scoped>
.drop-link {
  padding: 5px 20px;
}
.drop-link:hover {
  background-color: aqua;
}
.button-name {
  color: white;
  font-size: 20px;
  /* background-color: blue; */
  padding: 5px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 5px;
}
.drowdown-custome {
  max-width: 220px;
  width: max-content;
  /* height: 100px; */
  padding: 10px 10px;
  background-color: rgb(240, 231, 231);
  border-radius: 10px;
  position: absolute;
  text-align: center;
  z-index: 9;
}
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100000;
}
p {
  margin: 0;
  padding: 0;
}
h1 {
  margin: 0;
  padding: 0;
}
.brand {
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
}
ul {
  padding: 0;
  margin: 0;
}
ul li {
  list-style: none;
  /* margin-right: 20px; */
  padding: 25px 15px;
  transition: 0.4s ease-in-out;
}
.active {
  box-shadow: 0 -5px white;
  color: #ee002d;
}
.nav-bar-header {
  box-shadow: 0px 0px 36px 0px rgb(0 0 0 / 10%);
  background-color: white;
}
a {
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  color: #002e5b;
}
ul li:hover {
  color: #fc3f00;
}
ul li:hover {
  box-shadow: 0 -5px white;
}
</style>
