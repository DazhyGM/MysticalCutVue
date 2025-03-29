<template>
  <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
      </div>
      <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <h1>MysticalCut</h1>
      </ul>
      <div class="col-md-3 text-end">
        <router-link class="btn botonav" to="/login">
          <i class="fas fa-cog me-2"></i>Iniciar Sesión
        </router-link>
        <router-link class="btn botonav" to="/register">
          <i class="fas fa-cog me-2"></i>Registrar
        </router-link>
      </div>
    </header>
  </div>

  <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
    <div class="carousel-indicators">
      <button v-for="(item, index) in images" :key="index" type="button" :data-bs-target="'#carouselExampleCaptions'" :data-bs-slide-to="index" :class="{ active: index === 0 }" :aria-label="'Slide ' + (index + 1)"></button>
    </div>
    <div class="carousel-inner">
      <div v-for="(item, index) in images" :key="index" class="carousel-item" :class="{ active: index === 0 }">
        <img :src="item.src" class="d-block w-100" :alt="item.alt" />
        <div class="carousel-caption d-none d-md-block">
          <h2>{{ item.title }}</h2>
          <p v-if="item.text">{{ item.text }}</p>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>

  <footer class="py-3 my-4 bg-dark text-white">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h5>Barbería Mystical Cut</h5>
          <p>Dirección: Calle Ejemplo 123, Ciudad, País<br />Teléfono: (123) 456-7890<br />Email: contacto@mysticalcut.com</p>
        </div>
        <div class="col-md-6 text-center">
          <h5>Síguenos</h5>
          <ul class="nav justify-content-center">
            <li v-for="social in socials" :key="social.name" class="nav-item">
              <a class="nav-link" :href="social.link" target="_blank" :aria-label="social.name">
                <img :src="social.icon" :alt="social.name" class="social-icon" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p class="text-center mt-3 mb-0">© 2024 www.mysticalcut.com, Inc</p>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@/assets/css/style.css';
import { Carousel } from 'bootstrap';

// Imágenes del carrusel
const images = ref([
  { src: new URL('@/assets/img/background/ImagenPrincipal.jpeg', import.meta.url).href, alt: 'Imagen Principal', title: 'Bienvenidos a MysticalCut' },
  { src: new URL('@/assets/img/background/Productos.jpg', import.meta.url).href, alt: 'Productos', title: 'Los mejores productos de Barbería', text: 'Ofrecemos los mejores productos a los mejores precios.' },
  { src: new URL('@/assets/img/background/corte.jpeg', import.meta.url).href, alt: 'Servicios', title: 'Nuestros servicios', text: 'Ofrecemos una gran variedad de servicios como: Cortes, barba, tintura.' }
]);

// Inicializar el carrusel cuando el componente se monte
onMounted(() => {
  const carouselElement = document.querySelector('#carouselExampleCaptions');
  if (carouselElement) {
    new Carousel(carouselElement, {
      interval: 3000, // Tiempo entre diapositivas (3 segundos)
      ride: 'carousel' // Hace que el carrusel empiece automáticamente
    });
  }
});


</script>



<style scoped>
.social-icon {
  width: 40px;
  height: 40px;
}
</style>
