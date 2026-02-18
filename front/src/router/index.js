import { createRouter, createWebHistory } from 'vue-router';

//Home
const Index = () => import('@/views/home/HomeIndex.vue');
const Home = () => import('@/views/home/HomeUser.vue');

//Auth
const Login = () => import('@/views/auth/LoginUser.vue');
const Register = () => import('@/views/auth/RegisterUser.vue');
const ForgotPassword = () => import('@/views/auth/ForgotPassword.vue');
const ResetPassword = () => import('@/views/auth/ResetPassword.vue');

//Users
const Users = () => import('@/views/users/UsersInfo.vue');
const Perfil = () => import('@/views/users/PerfilUsuario.vue');
const EditUser = () => import('@/views/users/EditUsers.vue');
const VerUser = () => import('@/views/users/VerUser.vue');
const AgregarUser = () => import('@/views/users/AgregarUser.vue');
const EditPerfil = () => import('@/views/users/EditPerfil.vue');
const UsersInactives = () => import('@/views/users/UsersInactives.vue');

//Services
const Service = () => import('@/views/services/ServicesBarber.vue');
const CrearServicios = () => import('@/views/services/CrearServicios.vue');
const EditarServicios = () => import('@/views/services/EditarServicios.vue');
const ServicesInactivos = () => import('@/views/services/ServicesInactivos.vue');
const ViewService = () => import('@/views/services/ViewService.vue');
const SeleccionarBarbero = () => import('@/views/services/SeleccionarBarbero.vue');
const CalendarioCitas = () => import('@/views/services/CalendarioCitas.vue');
const FacturaServicios = () => import('@/views/services/FacturaServicios.vue');
const CitasPendientes = () => import('@/views/services/CitasPendientes.vue');
const Reportes = () => import('@/views/services/Reportes.vue');

//Products
const Products = () => import('@/views/products/ProductsView.vue');
const ProductsInactives = () => import('@/views/products/ProductsInactives.vue');
const CrearProducto = () => import('@/views/products/CrearProducto.vue');
const EditarProducto = () => import('@/views/products/EditarProducto.vue');
const CartView = () => import('@/views/products/CartView.vue');

//Errors
const ErrorAuth = () => import('@/views/errors/ErrorAuth.vue');
const ErrorRole = () => import('@/views/errors/ErrorRole.vue');
const ErrorUserBlock = () => import('@/views/errors/ErrorUserBlock.vue');
const ErrorUserDeleted = () => import('@/views/errors/ErrorUserDeleted.vue');
const ErrorPNF = () => import('@/views/errors/ErrorPNF.vue');


const routes = [
  //Home
  { path: '/', component: Index, meta: { title: 'Inicio | MysticalCut', hideLayout: true } },
  { path: '/Home', component: Home, meta: { title: 'Home | MysticalCut', requiresAuth: true, isHome: true, hideLayout: true } },

  //Auth
  { path: '/Login', component: Login, meta: { title: 'Login | MysticalCut', hideLayout: true } },
  { path: '/Register', component: Register, meta: { title: 'Registrate | MysticalCut', hideLayout: true} },
  { path: '/forgotPassword', component: ForgotPassword, meta: { title: 'Recuperar Contraseña | MysticalCut', hideLayout: true } },
  { path: '/reset-password/:token', component: ResetPassword, meta: { title: 'Resetear Contraseña | MysticalCut', hideLayout: true } },

  //Users
  { path: '/Users', component: Users, meta: { title: 'Users | MysticalCut', requiresAuth: true, role: 'Admin' } },
  { path: '/Perfil', component: Perfil, meta: { title: 'Perfil | MysticalCut', requiresAuth: true } },
  { path: '/EditUser/:id', component: EditUser, meta: { title: 'Editar | MysticalCut', requiresAuth: true, role: 'Admin' } },
  { path: '/VerUser/:id', component: VerUser, meta: { title: 'Ver | MysticalCut', requiresAuth: true, role: 'Admin' } },
  { path: '/AgregarUser', component: AgregarUser, meta: { title: 'Agregar | MysticalCut', requiresAuth:true, role: 'Admin' } },
  { path: '/EditPerfil/:id', component: EditPerfil, meta: { title: 'Editar | MysticalCut', requiresAuth: true } },
  { path: '/usersInactives', component: UsersInactives, meta: { title: 'Usuarios Inactivos | MysticalCut', requiresAuth: true, role: 'Admin' } },

  //Services
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

  //Products
  { path: '/Products', component: Products, meta: { title: 'Productos | MysticalCut', requiresAuth: true} },
  { path: '/ProductsInactives', component: ProductsInactives, meta: { title: 'Productos inactivos | MysticalCut', requiresAuth: true} },
  { path: '/Create-Products', component: CrearProducto, meta: { title: 'Crear Productos | MysticalCut', requiresAuth: true} },
  { path: '/Edit-Products/:id', component: EditarProducto, meta: { title: 'Editar Productos | MysticalCut', requiresAuth: true} },
  { path: '/Cart', component: CartView, meta: { title: 'Editar Productos | MysticalCut', requiresAuth: true} },

  //Errores
  { path: '/error', component: ErrorAuth, meta: { title: 'Error 404 | MysticalCut', hideLayout: true } },
  { path: '/:pathMatch(.*)*', redirect: '/errorPNF' },
  { path: '/errorRole', component: ErrorRole, meta: { title: 'Error 404 | MysticalCut', hideLayout: true } },
  { path: '/errorUserBlock', component: ErrorUserBlock, meta: { title: 'Error | MysticalCut', hideLayout: true } },
  { path: '/errorUserDeleted', component: ErrorUserDeleted, meta: { title: 'Error | MysticalCut', hideLayout: true } },
  { path: '/errorPNF', component: ErrorPNF, meta: { title: 'Error | MysticalCut' } },

];


const router = createRouter({
  history: createWebHistory(),
  routes,
});
//Middleware para cambiar el título de la página al navegar
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
});
//Protección de rutas
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (to.meta.requiresAuth) {
    if (!user) {
      next('/error');
    } else if (to.meta.role && to.meta.role !== user.role) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      alert('No tienes permisos para acceder a esta página. Sesión cerrada.');
      next('/errorRole');
    } else {
      next();
    }
  } else {
    next();
  }
});



export default router;
