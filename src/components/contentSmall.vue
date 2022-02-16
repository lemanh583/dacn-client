<template>
  <div class="row">
    <div class="col-12">
      <ul>
        <li v-for="(p, i) in posts" :key="i"> 
          <router-link :to="`/${p.slug}`"> 
            <h3>
              {{p.title}}
            </h3>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ["posts"],
  setup(props) {
    return {
      props
    }
  },
}
</script>
<style scoped>

h3 {
  font-size: 15px;
  line-height: 22px;
  font-weight: 700;
}
a {
  text-decoration: none;
  color: black;
}
a:hover {
  color: blue;
}
ul li {
    margin-bottom: 20px;
}
</style>
