import { createApp } from 'vue'
import App from './App.vue'
import './css/index.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/src/jquery.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import router from './router'
import store from './store'
import CKEditor from '@ckeditor/ckeditor5-vue';

createApp(App).use(router).use(store).use(CKEditor).mount('#app')
