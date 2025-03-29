import { createRouter, createWebHistory } from 'vue-router';
import Index from '../components/LoginUser.vue';
import recuperarContraseña from '../components/LoginUser.vue';

const routes = [
  { path: '/', component: Index, meta: { title: 'Inicio | MysticalCut' }},
  { path: '/', component: recuperarContraseña }, // Ruta para iniciar sesión
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'MysticalCut';
  next();
});

export default router;