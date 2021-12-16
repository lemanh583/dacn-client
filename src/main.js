import { createApp } from 'vue'
import App from './App.vue'
import './css/index.css'
import './css/sb-admin-2.css'
import './css/sb-admin-2.min.css'
import './css/dataTables.bootstrap4.css'
import './css/dataTables.bootstrap4.min.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/src/jquery.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import router from './router'
import store from './store'
import CKEditor from '@ckeditor/ckeditor5-vue';
import Notifications from '@kyvg/vue3-notification'


createApp(App).use(router).use(store).use(CKEditor).use(Notifications).mount('#app')
