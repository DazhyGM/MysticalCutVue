import { createRouter, createWebHistory } from 'vue-router';
import Index from '../components/HomeIndex.vue';
import Login from '../components/LoginUser.vue';
import Home from '../components/HomeUser.vue';
import Error404 from '../components/ErrorAuth.vue'; // 🛑
import Users from '../components/UsersInfo.vue';
import Perfil from '../components/PerfilUsuario.vue';
import Register from '../components/RegisterUser.vue';
import EditUser from '../components/EditUsers.vue';
import VerUser from '../components/VerUser.vue';
import AgregarUser from '../components/AgregarUser.vue';
import EditPerfil from '../components/EditPerfil.vue';
import ErrorRole from '../components/ErrorRole.vue'; //🛑
import ErrorUserBlock from '../components/ErrorUserBlock.vue'; //🛑
import ErrorUserDeleted from '../components/ErrorUserDeleted.vue'; //🛑
import ErrorPNF from '../components/ErrorPNF.vue'; //🛑
import UsersInactives from '../components/UsersInactives.vue'; 
import ForgotPassword from '../components/ForgotPassword.vue'; 
import ResetPassword from '../components/ResetPassword.vue';

import Service from '../components/ServicesBarber.vue';
import CrearServicios from '@/components/CrearServicios.vue';
import EditarServicios from '@/components/EditarServicios.vue';
import ServicesInactivos from '@/components/ServicesInactivos.vue';
import ViewService from '@/components/ViewService.vue';
import SeleccionarBarbero from '@/components/SeleccionarBarbero.vue';
import CalendarioCitas from '@/components/CalendarioCitas.vue';
import FacturaServicios from '@/components/FacturaServicios.vue';
import CitasPendientes from '@/components/CitasPendientes.vue';
import Reportes from '@/components/Reportes.vue';


import Products from '../components/ProductsView.vue';
import ProductsInactives from '../components/ProductsInactives.vue';
import CrearProducto from '@/components/CrearProducto.vue';
import EditarProducto from '@/components/EditarProducto.vue';
import CartView from '@/components/CartView.vue';






const routes = [
  { path: '/', component: Index, meta: { title: 'Inicio | MysticalCut' } },
  { path: '/Login', component: Login, meta: { title: 'Login | MysticalCut' } },
  { path: '/Home', component: Home, meta: { title: 'Home | MysticalCut', requiresAuth: true } },
  { path: '/error', component: Error404, meta: { title: 'Error 404 | MysticalCut' } },
  { path: '/:pathMatch(.*)*', redirect: '/errorPNF' },
  { path: '/Users', component: Users, meta: { title: 'Users | MysticalCut', requiresAuth: true, role: 'Admin' } },
  { path: '/Perfil', component: Perfil, meta: { title: 'Perfil | MysticalCut', requiresAuth: true } },
  { path: '/Register', component: Register, meta: { title: 'Registrate | MysticalCut'} },
  { path: '/EditUser/:id', component: EditUser, meta: { title: 'Editar | MysticalCut', requiresAuth: true, role: 'Admin' } },
  { path: '/VerUser/:id', component: VerUser, meta: { title: 'Ver | MysticalCut', requiresAuth: true, role: 'Admin' } },
  { path: '/AgregarUser', component: AgregarUser, meta: { title: 'Agregar | MysticalCut', requiresAuth:true, role: 'Admin' } },
  { path: '/EditPerfil/:id', component: EditPerfil, meta: { title: 'Editar | MysticalCut', requiresAuth: true } },
  { path: '/errorRole', component: ErrorRole, meta: { title: 'Error 404 | MysticalCut' } },
  { path: '/errorUserBlock', component: ErrorUserBlock, meta: { title: 'Error | MysticalCut' } },
  { path: '/errorUserDeleted', component: ErrorUserDeleted, meta: { title: 'Error | MysticalCut' } },
  { path: '/errorPNF', component: ErrorPNF, meta: { title: 'Error | MysticalCut' } },
  { path: '/usersInactives', component: UsersInactives, meta: { title: 'Usuarios Inactivos | MysticalCut', requiresAuth: true, role: 'Admin' } },
  { path: '/forgotPassword', component: ForgotPassword, meta: { title: 'Recuperar Contraseña | MysticalCut' } },
  { path: '/reset-password/:token', component: ResetPassword, meta: { title: 'Resetear Contraseña | MysticalCut' } },

  { path: '/Services', component: Service, meta: { title: 'Servicios | MysticalCut' } },
  { path: '/Create-Services', component: CrearServicios , meta: { title: 'Crear Servicios | MysticalCut' } },
  { path: '/Editar-Services/:id', component: EditarServicios , meta: { title: 'Editar Servicios | MysticalCut' } },
  { path: '/Services-Inactivos', component: ServicesInactivos , meta: { title: 'Servicios inactivos| MysticalCut' } },
  { path: '/View-Service/:id', component: ViewService , meta: { title: 'Ver Servicios | MysticalCut' } },
  { path: '/Select-Barbero', component: SeleccionarBarbero , meta: { title: 'Seleccionar Barbero | MysticalCut' } },
  { path: '/Calendario', component: CalendarioCitas , meta: { title: 'Calendario | MysticalCut' } },
  { path: '/FacturaServicios', component: FacturaServicios , meta: { title: 'factura | MysticalCut' } },
  { path: '/Citas', component: CitasPendientes , meta: { title: 'Citas | MysticalCut', requiresAuth: true } },
  { path: '/Reportes', component: Reportes , meta: { title: 'Reportes | MysticalCut', requiresAuth: true, role: 'Admin'  } },

  { path: '/Products', component: Products, meta: { title: 'Productos | MysticalCut', requiresAuth: true} },
  { path: '/ProductsInactives', component: ProductsInactives, meta: { title: 'Productos inactivos | MysticalCut', requiresAuth: true} },
  { path: '/Create-Products', component: CrearProducto, meta: { title: 'Crear Productos | MysticalCut', requiresAuth: true} },
  { path: '/Edit-Products/:id', component: EditarProducto, meta: { title: 'Editar Productos | MysticalCut', requiresAuth: true} },
  { path: '/Cart', component: CartView, meta: { title: 'Editar Productos | MysticalCut', requiresAuth: true} },





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
      next('/error'); // Si no está autenticado, redirigir a vista de error
    } else if (to.meta.role && to.meta.role !== user.role) {
      // Si el rol no coincide, cerrar sesión y redirigir a la página de error
      localStorage.removeItem('user');  // Limpiar datos de usuario
      localStorage.removeItem('token'); // Eliminar el token de autenticación

      alert('No tienes permisos para acceder a esta página. Sesión cerrada.'); // Mensaje de error
      next('/errorRole'); // Redirigir a mensaje de error
    } else {
      next(); // Si todo está bien, permitir el acceso
    }
  } else {
    next(); // Si la ruta no requiere autenticación, sigue normal
  }
});



export default router;
