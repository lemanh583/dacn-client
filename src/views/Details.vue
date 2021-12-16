<template>
    <div>
        <Header :slug="categoryActive" />
        <div class="container">
            <div class="row">
                <div class="col-8">
                    <div class="content-detail" v-html="post.content">

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
import {ref} from "vue"
import {useRoute} from "vue-router"
import axios from "axios"
export default {
    components: {
        Header,
        Footer
    },
    setup() {
        const router = useRoute()
        const params = router.params.slug
        const post = ref({
            // title: "",
            // content: "",
        })
        const categoryActive = ref("") 
        const fetchPost = async () => {
            try {
                 let response = await axios.get(`${process.env.VUE_APP_URL}/post/get/${params}`)
                 post.value = response.data.data
                 categoryActive.value = response.data.data.category.slug
                 console.log('post', post.value)
            } catch (error) {
                console.error(error);                
            }
        }
        fetchPost()
        console.log('route', router.params.slug)
        return {
            post,
            categoryActive
        }
    },
}
</script>
<style >
.content-detail img {
    max-width: 100%;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
