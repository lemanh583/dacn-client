<template>
  <div class="paginate">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li v-for="i in page" :key="i" class="page-item"><a class="page-link" href="#">{{i}}</a></li>
      
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
import {ref, watch} from "vue"
export default {
    props: ["count", "size"],
    setup(props) {
        const page = ref(1)
        watch(() => props.count ,(cur) => {
          page.value = Math.floor (cur / props.size)
        })
        console.log('page', page.value)
        return {
            page
        }
    },
}
</script>
<style scoped>
.paginate {
  float: right;
}
</style>