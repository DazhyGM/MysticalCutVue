<template>
  <div>
    <div class="container">
      <header
        class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div class="col-md-3 mb-2 mb-md-0">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125"
            class="d-inline-block align-text-top" />
        </div>

        <!-- 🔹 Menú filtrado según el rol -->
        <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li v-for="module in filteredModules" :key="module.module_route" class="nav-item">
            <a class="nav-link" :href="`/${module.module_route}`">{{ module.role_module }}</a>
          </li>
        </ul>

        <!-- Menú Perfil -->
        <div class="col-md-3 text-end">
          <div class="dropdown">
            <button class="btn dropdown-toggle" @click="toggleMenu">
              <img src="/img/background/Icono usuario.png" alt="Profile" class="icon me-2" />
              {{ user.full_name || 'Usuario' }}
            </button>
            <ul v-if="isMenuOpen" class="dropdown-menu dropdown-menu-end show">
              <!-- 🔹 Opción "Perfil" como botón -->
              <li>
                <button class="dropdown-item" @click="goToProfile">Perfil</button>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <button class="dropdown-item" @click="logout">Cerrar Sesión</button>
              </li>
            </ul>
          </div>
        </div>

      </header>
    </div>

    <!--Carrusel-->

    <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
      <div class="carousel-indicators">
        <button v-for="(item, index) in images" :key="index" type="button" :data-bs-target="'#carouselExampleCaptions'"
          :data-bs-slide-to="index" :class="{ active: index === 0 }" :aria-label="'Slide ' + (index + 1)">
        </button>
      </div>

      <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div v-for="(item, index) in images" :key="index" class="carousel-item" :class="{ active: index === 0 }">
            <img :src="item.src" class="d-block w-100" :alt="item.alt" />

            <!-- Título centrado solo en la primera imagen -->
            <h2 v-if="index === 0" class="titulo1">{{ item.title }}</h2>

            <!-- Para las demás imágenes -->
            <div v-else class="carousel-caption d-none d-md-block">
              <h2 class="carousel-title">{{ item.title }}</h2>
              <p v-if="item.text">{{ item.text }}</p>
            </div>
          </div>
        </div>

        <!-- Controles del carrusel -->
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Anterior</span>
        </button>

        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

<!--Seccion de servicios-->

    <div class="container section">
      <h2 class="section-title">Servicios</h2>
      <div class="row row-cols-1 row-cols-md-4 g-8">
        <div v-for="service in services" :key="service.title" class="col">
          <div class="card">
            <a href="/usuario/elegir-tipo-cita">
              <img :src="service.image" class="card-img-top" :alt="service.title" />
            </a>
            <div class="card-body">
              <h5 class="card-title">{{ service.title }}</h5>
              <p class="card-text">{{ service.text }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-4">
    <a href="/usuario/elegir-tipo-cita" class="btn btn-custom">Agenda tu cita</a>
  </div>
    </div>

<!--Seccion de Productos-->

    <div class="container section">
      <h2 class="section-title">Productos</h2>
      <div class="row row-cols-1 row-cols-md-4 g-8">
        <div v-for="product in products" :key="product.title" class="col">
          <div class="card">
            <a href="/usuario/productos">
              <img :src="product.image" class="card-img-top" :alt="product.title" />
            </a>
            <div class="card-body">
              <h5 class="card-title">{{ product.title }}</h5>
              <p class="card-text">{{ product.text }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Botón para elegir un producto con más espacio abajo -->
<div class="text-center mt-4 mb-4">
  <a href="/usuario/productos" class="btn btn-custom">Elige un producto</a>
</div>

    </div>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <!-- Información de la barbería -->
          <div class="footer-info">
            <h5>Barbería Mystical Cut</h5>
            <p>
              <strong>Dirección:</strong> Calle Ejemplo 123, Ciudad, País <br />
              <strong>Teléfono:</strong> (123) 456-7890 <br />
              <strong>Email:</strong> contacto@mysticalcut.com
            </p>
            <!-- Redes Sociales -->
            <div class="social-icons">
              <a v-for="social in socialLinks" :key="social.name" :href="social.url" target="_blank"
                class="social-link">
                <img :src="getImagePath(social.image)" :alt="social.name" class="social-icon" />
              </a>
            </div>
          </div>

          <!-- Ubicación en Google Maps -->
          <div class="footer-map">
            <h5>Ubicación</h5>
            <iframe width="300" height="200" frameborder="0" style="border: 0; border-radius: 10px" allowfullscreen
              loading="lazy" referrerpolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d320.7485814835074!2d-74.11363336743096!3d4.566516616706714!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f98b7eaad79d7%3A0xd3bcb757e2f470a5!2sBoxter%20Barber%20Shop!5e1!3m2!1ses!2sco!4v1743355924822!5m2!1ses!2sco"></iframe>
          </div>
        </div>

        <!-- Copyright -->
        <p class="footer-copyright">© 2024 www.mysticalcut.com, Inc</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from "vue-router";
import '@/assets/css/style.css';
import '@/assets/css/footer.css';

const router = useRouter();
const isMenuOpen = ref(false);
const user = ref({ full_name: '', role: '' }); // ✅ Define `user` antes de usarlo

// Función para alternar el menú
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Función para cerrar el menú si se hace clic fuera
const closeMenu = (event) => {
  if (!event.target.closest(".dropdown")) {
    isMenuOpen.value = false;
  }
};

// 🔹 Agregar evento al montar el componente
onMounted(() => {
  document.addEventListener("click", closeMenu);

  // 🔹 Cargar usuario desde localStorage
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
      console.log("🔍 Usuario cargado desde localStorage:", user.value);
    } catch (error) {
      console.error("❌ Error al parsear usuario de localStorage", error);
    }
  }
});

// 🔹 Eliminar evento al desmontar el componente
onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});

// Cerrar sesión
const logout = () => {
  localStorage.removeItem('token'); // Eliminar token
  localStorage.removeItem('user'); // Eliminar usuario
  router.push('/'); // Redirigir al Index
};

// Función para ir a la página de perfil
const goToProfile = () => {
  console.log("🔹 Redirigiendo a perfil...");
  isMenuOpen.value = false;
  router.push("/Perfil");
};

// 🔹 Definir los módulos y qué roles pueden verlos
const allModules = [
  { module_route: 'Home', role_module: 'Home', roles: ['Admin', 'Client', 'Employee'] },
  { module_route: 'Users', role_module: 'Users', roles: ['Admin'] },
  { module_route: 'Services', role_module: 'Servicios', roles: ['Admin', 'Client'] },
  { module_route: 'Productos', role_module: 'Productos', roles: ['Admin', 'Client'] },
  { module_route: 'Citas', role_module: 'Citas', roles: ['Employee', 'Client'] },
];
  
// Filtrar los módulos según el rol del usuario
const filteredModules = computed(() => {
  if (!user.value.role) return [];
  console.log("🧐 Filtrando módulos para el rol:", user.value.role);
  console.log("✅ Módulos filtrados:", filteredModules.value);
  return allModules.filter(module => module.roles.includes(user.value.role));
});

// Observador para ver cambios en `user.role`
watch(() => user.value.role, (newRole) => {
  if (newRole) {
    console.log("😎 Rol actualizado del usuario:", newRole);
  }
});

// Definir imágenes del carrusel
const images = ref([
  { src: '/img/background/ImagenPrincipal.jpeg', alt: 'Imagen Principal', title: 'Bienvenidos a MysticalCut' },
  { src: '/img/background/Productos.jpg', alt: 'Productos', title: 'Los mejores productos de Barbería', text: 'Ofrecemos los mejores productos a los mejores precios.' },
  { src: '/img/background/corte.jpeg', alt: 'Servicios', title: 'Nuestros servicios', text: 'Ofrecemos una gran variedad de servicios como: Cortes, barba, tintura.' }
]);

// Lista de servicios
const services = ref([
  { image: '/img/background/BarbaCortaCuadrada.jpg', title: 'Barba Corta Cuadrada', text: 'Barba recortada con precisión.' },
  { image: '/img/background/mullet.jpg', title: 'Mullet', text: 'Corte con dos extensiones diferenciadas.' },
  { image: '/img/background/cejasflat.jpg', title: 'Cejas Flat', text: 'Cejas rectas con una curva sutil.' },
  { image: '/img/background/tintebicolor.jpg', title: 'Tinte Bicolor', text: 'División de color en el cabello.' }
]);

// Lista de productos
const products = ref([
  { image: '/img/background/ceramate.jpg', title: 'Cera', text: 'Cera mate para estilizar tu cabello.' },
  { image: '/img/background/shampoocaida.jpg', title: 'Shampoo', text: 'Shampoo para prevenir la caída del cabello.' },
  { image: '/img/background/shaver.jpg', title: 'Shaver', text: 'Shaver bañada en oro para un afeitado perfecto.' },
  { image: '/img/background/cremabarba.jpg', title: 'Crema', text: 'Crema especial para cuidar tu barba.' }
]);
</script>

<script>
export default {
  data() {
    return {
      socialLinks: [
        { name: 'Facebook', url: 'https://facebook.com', image: 'logo_facebook.png' },
        { name: 'Instagram', url: 'https://instagram.com', image: 'instagram.png' },
        { name: 'TikTok', url: 'https://tiktok.com', image: 'tiktok.png' },
        { name: 'WhatsApp', url: 'https://wa.me/1234567890', image: 'whatsapp.jpg' }
      ]
    };
  },
  methods: {
    getImagePath(imageName) {
      return `/img/background/${imageName}`;
    }
  }
};
</script>


