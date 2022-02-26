<template>
  <div v-if="post">
    <div :class="['row', 'content-big', flag ? 'hei-500' : '']">
      <div class="col-12">
        <div class="image">
          <img
            :src="
              post?.image
                ? post.image.src
                : 'https://1.bp.blogspot.com/-Al0uKuyGnYU/V0gJX5ULmGI/AAAAAAAADHw/Mqe3WxnvBqEzHuq_E_M4yzuhid_PoxnBgCLcB/s1600/img.gif'
            "
            alt=""
          />
        </div>
        <div class="title">
          <router-link :to="`/${post?.slug}`">
            <h3>{{  post?.title }}</h3>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import {toRefs} from "vue"
export default {
  props: ["flag", "post"],
  //   flag: {
  //     type: Boolean
  //   },
  //   post: {
  //     type: Object,
  //     default: () => ({
  //       // slug: "",
  //       // title: ""
  //     })
  //   }
  // },
  setup(props) {
    // const refPost = toRefs(props).post
    // console.log('post.props',props.post)
    // console.log('context',context)

    return {
      props,
      // refPost
    };
  },
};
</script>

<style scoped>
.content-big {
  margin-bottom: 20px;
  margin-top: 20px;
}
.hei-500 {
  height: 500px;
}
.image img {
  width: 100%;
  max-width: 100%;
  max-height: 400px;
  object-fit: cover;
  object-position: top;
}
.title {
  margin-top: 20px;
}
.title h3 {
  font-size: 20px;
  font-weight: 700;
}
a {
  color: black;
  text-decoration: none;
}
a:hover {
  color: blue;
}
</style>
