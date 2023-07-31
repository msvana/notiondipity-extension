import {createApp} from 'vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import App from './components/app.vue'
import Home from './components/home.vue'
import Login from './components/login.vue'
import Search from './components/search.vue'
import Ideas from './components/ideas.vue'

const routes = [
    {path: '/', component: Home, name: 'home'},
    {path: '/login', component: Login, name: 'login'},
    {path: '/search', component: Search, name: 'search'},
    {path: '/ideas', component: Ideas, name: 'ideas'}
]

// @ts-ignore
const router = createRouter({
    routes,
    history: createWebHashHistory('index.html'),
    linkActiveClass: 'active'
})

// @ts-ignore
const app = createApp(App)

app.use(router)
app.mount('#app')
