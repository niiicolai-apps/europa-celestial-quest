import { createRouter, createWebHashHistory } from 'vue-router'

import NotFound from './layout/NotFound.vue'
import Game from './pages/Game.vue'

const routes = [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    { path: '/', component: Game },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
