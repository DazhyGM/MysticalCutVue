<template>
    <div class="container">
        <HeaderComponent />
  
      <!-- Profile Section -->
      <div class="profile-container d-flex align-items-center justify-content-center">
        <div class="profile-image me-3">
          <img src="/img/background/Icono usuario.png" width="100px" alt="Usuario">
        </div>
        <div class="profile-info">
    <div class="profile-name">Nombre: {{ user.full_name }}</div>
    <div class="profile-name">Correo: {{ user.user_email }}</div>
    <div class="profile-name">Documento: {{ user.document_number }}</div>
    <div class="profile-name">Tipo de Documento: {{ user.type_document }}</div>
    <div class="profile-name">Dirección: {{ user.address }}</div>
    <div class="profile-name">Rol: {{ user.role }}</div>
  </div>
      </div>
  
      <div class="back-button-container">
    <button v-if="user.role === 'Admin'" class="btn btn-secondary" @click="goBack">Editar</button>
    <button v-if="['Admin', 'Client'].includes(user.role)" class="btn btn-secondary" @click="goBack">Regresar</button>
</div>

  
<FooterComponent />
    </div>
  </template>
  
  <script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from "vue-router";
import { getUserData } from "@/services/api"; // Asegúrate de tener este endpoint en tu API
import '@/assets/css/perfilUsuario.css';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const router = useRouter();
const isMenuOpen = ref(false);
const user = ref({ full_name: '', email: '', address: '', phone: '' });

const goBack = () => {
  router.push('/Home');
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
  fetchUserData(); // Llamar a la función que obtiene los datos del usuario
});

// 🔹 Eliminar evento al desmontar el componente
onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});



// 🔥 **Función para obtener los datos del usuario desde la API**
const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No hay token en localStorage, redirigiendo al login.");
      router.push('/login');
      return;
    }

    // Hacer petición a la API
    const response = await getUserData(token);
    user.value = response; // Actualizar datos del usuario
  } catch (error) {
    console.error("❌ Error al obtener datos del usuario:", error);
    router.push('/login'); // Si hay error, redirigir al login
  }
};
</script>
