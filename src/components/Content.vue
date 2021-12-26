<template>
  <div>
    <div class="row block-content">
      <div class="col-4">
        <router-link :to="`/${post.slug}`"> 
        <img
          class="image-content"
          :src="post.image.src"
          alt=""
        />
        </router-link>
      </div>
      <div class="col-8 ">
        <div class="content">
          <router-link :to="`/${post.slug}`"> 
            <h3 class="title">
              {{post.title}}
            </h3>
          </router-link>
          <p class="descriptions">
             {{post.descriptions}}
          </p>
        </div>
      </div> 
    </div>
    <div class="row">
      <div class="col-12">
        <div class="line"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["post"],
  setup(props) {
    return {
        props
    }
  },
}
</script>

<style scoped>
.block-content {
  padding: 20px 0;
  width: 100%;
  height: 150px;
  /* border-bottom: 1px solid black; */
  box-sizing: border-box;
  text-overflow: ellipsis;
}
.image-content {
  max-width: 100%;
  max-height: 120px;
  width: 100%;
  object-fit: cover;
  object-position: top;
}
.title {
  font-size: 16px;
  line-height: 22px;
  font-weight: 700;
}
.descriptions {
  text-overflow: ellipsis;
}
.content {
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
}
p {
  font-size: 13px;
}
a {
  text-decoration: none;
  color: black;
}
a:hover {
  color: blue;
}
</style>
