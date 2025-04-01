import { createRouter, createWebHistory } from 'vue-router';
import Index from '../components/HomeIndex.vue';
import Login from '../components/LoginUser.vue';
import Home from '../components/HomeUser.vue';
import Error404 from '../components/ErrorAuth.vue'; // 🛑 Importa la vista de error
import Users from '../components/UsersInfo.vue';
import Perfil from '../components/PerfilUsuario.vue';
import Register from '../components/RegisterUser.vue';
import EditUser from '../components/EditUsers.vue';
import VerUser from '../components/VerUser.vue';
import AgregarUser from '../components/AgregarUser.vue';
import EditPerfil from '../components/EditPerfil.vue';
import ErrorRole from '../components/ErrorRole.vue';

const routes = [
  { path: '/', component: Index, meta: { title: 'Inicio | MysticalCut' } },
  { path: '/Login', component: Login, meta: { title: 'Login | MysticalCut' } },
  { path: '/Home', component: Home, meta: { title: 'Home | MysticalCut', requiresAuth: true } },
  { path: '/error', component: Error404, meta: { title: 'Error 404 | MysticalCut' } }, // Ruta de error
  { path: '/:pathMatch(.*)*', redirect: '/error' }, // Captura cualquier otra ruta inválida
  { path: '/Users', component: Users, meta: { title: 'Users | MysticalCut', requiresAuth: true, role: 'Admin' } },
  { path: '/Perfil', component: Perfil, meta: { title: 'Perfil | MysticalCut', requiresAuth: true } },
  { path: '/Register', component: Register, meta: { title: 'Registrate | MysticalCut'} },
  { path: '/EditUser/:id', component: EditUser, meta: { title: 'Editar | MysticalCut', requiresAuth: true, role: 'Admin' } },
  { path: '/VerUser/:id', component: VerUser, meta: { title: 'Ver | MysticalCut', requiresAuth: true, role: 'Admin' } },
  { path: '/AgregarUser', component: AgregarUser, meta: { title: 'Agregar | MysticalCut', requiresAuth:true, role: 'Admin' } },
  { path: '/EditPerfil/:id', component: EditPerfil, meta: { title: 'Editar | MysticalCut', requiresAuth: true } },
  { path: '/errorRole', component: ErrorRole, meta: { title: 'Error 404 | MysticalCut' } },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});
// 🔹 Middleware para cambiar el título de la página al navegar
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
});
// 🔒 Protección de rutas
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (to.meta.requiresAuth) {
    if (!user) {
      next('/Login'); // Si no está autenticado, redirigir a login
    } else if (to.meta.role && to.meta.role !== user.role) {
      // Si el rol no coincide, cerrar sesión y redirigir a la página de error
      localStorage.removeItem('user');  // Limpiar datos de usuario
      localStorage.removeItem('token'); // Eliminar el token de autenticación

      alert('No tienes permisos para acceder a esta página. Sesión cerrada.'); // Mensaje de error
      next('/errorRole'); // Redirigir a login
    } else {
      next(); // Si todo está bien, permitir el acceso
    }
  } else {
    next(); // Si la ruta no requiere autenticación, sigue normal
  }
});



export default router;
