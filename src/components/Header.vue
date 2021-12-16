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
              <form method="GET">
                <div class="input-group">
                  <input
                    type="text"
                    class="input-search"
                    placeholder="Tìm kiếm"
                  />
                  <button
                    style="border: none; background-color: white"
                    type="submit"
                  >
                    <i class="fas fa-search auto-margin"></i>
                  </button>
                </div>
              </form>
            </div>
            <div>
              {{ this.$store.state.nameUser }}
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
            
              <a v-else @click="handleLogout">
                Đăng xuất
              </a>
                 <router-link to="/admin/dashboard">Admin</router-link>
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
import { useRoute } from "vue-router";
export default {
  props: ["slug"],
  setup(props) {
    const fixed = ref(false);
    const listCategory = ref([]);
    // const menu = ref([])
    const router = useRoute();
    const params = ref(router.params.slug);
    const store = useStore();
    const isAuth = computed(()=> store.state.isAuth)
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
        params.value = router.params.slug;
        console.log("router.params.slug", router.params.slug);
      }, 100);
    };

    const handleLogout = () => {
      localStorage.setItem("token", "");
      store.commit("setAuth", false);
      store.commit("setRole", Number);
      store.commit("setName", "");
    };

    onMounted(() => {
      window.document.onscroll = () => {
        let nav = document.querySelector(".nav-bar-header");
        if (window.scrollY > nav.offsetTop) {
          fixed.value = true;
        } else {
          fixed.value = false;
          console.log(fixed.value);
        }
      };
    });

    // call function

    fetchCategory();

    return {
      fixed,
      listCategory,
      handleActive,
      params,
      handleLogout,
      isAuth,
      props,
    };
  },
};
</script>

<style scoped>
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
