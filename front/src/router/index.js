import { createRouter, createWebHistory } from 'vue-router';
import IniciarSesion from '../components/LoginUser.vue';
import recuperarContraseña from '../components/LoginUser.vue';

const routes = [
  { path: '/', component: IniciarSesion },
  { path: '/', component: recuperarContraseña }, // Ruta para iniciar sesión
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  
});

export default router;