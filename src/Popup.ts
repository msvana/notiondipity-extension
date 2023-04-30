import App from '@/App.vue'
import Home from '@/Home.vue'
import {createApp} from 'vue'
import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {path: '/', component: Home, name: 'home'}
]

const router = createRouter({routes, history: createWebHashHistory("index.html")})

const app = createApp(App)
app.use(router)
app.mount('#app')
