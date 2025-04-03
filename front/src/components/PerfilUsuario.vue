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
        <div class="profile-name">Telefono: {{ user.phone }}</div>
        <div class="profile-name" id="role">Rol: {{ user.role }}</div>
      </div>
    </div>

    <div class="back-button-container">
      <router-link :to="`/EditPerfil/${user.id}`" class="btn btn-icon">
        <img src="/img/background/editar_perfil_2.png"> Editar
      </router-link>
      <button v-if="['Cliente', 'Empleado'].includes(user.role)" class="btn botonav" @click="goMisCitas">Mis citas</button>
      <button v-if="['Administrador', 'Cliente', 'Empleado'].includes(user.role)" class="btn botonav" @click="goBack">Regresar</button>
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from "vue-router";
import { getUserData } from "@/services/api"; 
import '@/assets/css/perfilUsuario.css';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const router = useRouter();
const isMenuOpen = ref(false);
const user = ref({}); 

// 🔥 Mapeo de roles en inglés a español
const roleMapping = {
  "Admin": "Administrador",
  "Employee": "Empleado",
  "Client": "Cliente"
};

// 🔥 Función para obtener los datos del usuario desde la API
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

    // Asignar los datos de la respuesta al objeto user
    user.value = {
      id: response.user_id,  
      full_name: response.full_name,
      user_email: response.user_email,
      document_number: response.document_number,
      type_document: response.type_document,
      address: response.address,
      phone: response.phone,
      role: roleMapping[response.role] || "Desconocido" // 🔥 Convertimos el rol aquí
    };
  } catch (error) {
    console.error("❌ Error al obtener los datos del usuario:", error);
    router.push('/login');  
  }
};

// 🔹 Evento para cerrar el menú si se hace clic fuera
const closeMenu = (event) => {
  if (!event.target.closest(".dropdown")) {
    isMenuOpen.value = false;
  }
};

// 🔹 Agregar evento al montar el componente
onMounted(() => {
  document.addEventListener("click", closeMenu);
  fetchUserData(); // 👈 Llamamos a la función para obtener los datos del usuario
});

// 🔹 Eliminar evento al desmontar el componente
onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});

// 🔹 Función para regresar a la página anterior
const goBack = () => {
  router.push('/Home');
};

const goMisCitas = () => {
  router.push('/Home');
};

</script>
