<template>
  <div class="paginate">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <span class="page-link" href="" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </span>
        </li>
        <li v-for="i in page" :key="i" @click="handleChange(i)" class="page-item"><span class="page-link">{{i}}</span></li>
      
        <li class="page-item">
          <span class="page-link" href="" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </span>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
import {ref, watch} from "vue"
export default {
    props: ["count", "size"],
    setup(props, context) {
        const page = ref(0)
        watch(() => props.count ,(cur) => {
          if(cur % props.size == 0) {
             page.value = Math.floor (cur / props.size)
          }
          else {
            page.value = Math.floor(cur / props.size) + 1
          }
        })
        console.log('page', page.value)
        const handleChange = (pageNumber) => {
          context.emit('changePaginator', pageNumber)
        }
        return {
            page,
            handleChange
        }
    },
}
</script>
<style scoped>
.paginate {
  float: right;
}
</style>