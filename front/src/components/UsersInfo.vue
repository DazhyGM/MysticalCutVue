<template>
  <div class="container">
    <HeaderComponent />

    <div class="d-flex align-items-center justify-content-between w-100 mb-3">
      <a :href="addUserUrl" class="btn btn-agregar">
        <img src="/img/logos/person-plus-fill.svg" style="width: 20px; height: 20px; margin-right: 5px;">Agregar
      </a>
      
      <div class="input-group" style="max-width: 300px;">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Buscar usuario...">
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"></button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="#">A......Z</a></li>
          <li><a class="dropdown-item" href="#">Z......A</a></li>
          <li><a class="dropdown-item" href="#">Fecha de registro</a></li>
          <li><a class="dropdown-item" href="#">Último pedido</a></li>
        </ul>
      </div>
    </div>

    <div class="pedido-container" style="height: 400px; overflow: auto">
      <div v-for="user in filteredUsers" :key="user.user_id" class="pedido-box">
        <div class="icon-usuario-container">
          <img src="/img/logos/person-circle.svg" class="btn icon-usuario">
        </div>
        <h5>{{ user.full_name }}</h5>
        <div class="icon-container">
          <a :href="editUserUrl(user.user_id)" class="btn btn-icon">
            <img src="/img/logos/pencil.svg" alt="Icono lapiz">
          </a>
          <a :href="viewUserUrl(user.user_id)" class="btn btn-icon">
            <img src="/img/logos/eye.svg" alt="Icono Ojo">
          </a>
          <a :href="deleteUserUrl(user.user_id)" class="btn btn-icon" @click.prevent="confirmDelete(user.user_id)">
            <img src="/img/logos/x-circle.svg">
          </a>
        </div>
      </div>
    </div>
    
    <div class="btn-regresar mt-3">
      <button class="back-button btn btn-secondary" @click="goBack">Regresar</button>
    </div>
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from "vue-router";
import '@/assets/css/style.css';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const router = useRouter();
const isMenuOpen = ref(false);

const goBack = () => {
  router.push('/Home'); // Redirigir al home
};

// 🔹 Función para cerrar el menú si se hace clic fuera
const closeMenu = (event) => {
  if (!event.target.closest(".dropdown")) {
    isMenuOpen.value = false;
  }
};
// 🔹 Agregar evento al montar el componente
onMounted(() => {
  document.addEventListener("click", closeMenu);
});

// 🔹 Eliminar evento al desmontar el componente
onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});


// Definir user con un objeto vacío
const user = ref({ full_name: '' });

// Recuperar el usuario guardado en `localStorage` al montar el componente
onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error al parsear usuario de localStorage", error);
    }
  }
});



</script>