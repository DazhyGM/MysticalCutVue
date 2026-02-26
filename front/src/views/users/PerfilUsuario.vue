<template>
  <div class="container">

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
      <router-link :to="`/EditPerfil/${user.id}`" class="btn btn-icon-edit">
        <img src="/img/background/editar_perfil_2.png"> Editar
      </router-link>
      <button v-if="['Cliente', 'Empleado'].includes(user.role)" class="btn botonav-citas" @click="goMisCitas">Mis
        citas</button>
      <button class="btn btn-delete" @click="confirmDelete"> Eliminar cuenta </button>
    </div>
    <button v-if="['Administrador', 'Cliente', 'Empleado'].includes(user.role)" class="btn back-button"
      @click="goBack">Regresar</button>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from "vue-router";
import { getUserData, deleteAccount } from "@/services/api";

const router = useRouter();
const isMenuOpen = ref(false);
const user = ref({});

const roleMapping = {
  "Admin": "Administrador",
  "Employee": "Empleado",
  "Client": "Cliente"
};

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No hay token en localStorage, redirigiendo al login.");
      router.push('/login');
      return;
    }

    const response = await getUserData(token);

    user.value = {
      id: response.user_id,
      full_name: response.full_name,
      user_email: response.user_email,
      document_number: response.document_number,
      type_document: response.type_document,
      address: response.address,
      phone: response.phone,
      role: roleMapping[response.role] || "Desconocido"
    };
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    router.push('/login');
  }
};

const closeMenu = (event) => {
  if (!event.target.closest(".dropdown")) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeMenu);
  fetchUserData();
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});

const confirmDelete = async () => {
  const confirmed = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");
    await deleteAccount(user.value.id, token);
    alert("Cuenta eliminada exitosamente. ¡Hasta pronto!");
    localStorage.removeItem("token");
    router.push("/");
  } catch (error) {
    console.error("❌ Error al eliminar la cuenta:", error);
    alert("Hubo un problema al intentar eliminar tu cuenta.");
  }
};

const goBack = () => {
  router.push('/Home');
};

const goMisCitas = () => {
  router.push('/Citas');
};
</script>

<style scoped>
@import '@/assets/css/users/perfilUsuario.css';
</style>
