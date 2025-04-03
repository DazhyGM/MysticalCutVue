<template>
  <div class="container">
    <HeaderComponent />

    <div class="d-flex align-items-center justify-content-between w-100 mb-3">
      <router-link to="/AgregarUser" class="btn btn-agregar">
        <img src="/img/logos/person-plus-fill.svg" style="width: 20px; height: 20px; margin-right: 5px;">
        Agregar
      </router-link>
      <router-link to="/usersInactives" class="btn botonav">
        <button class="btn">Ver usuarios inactivos</button>
      </router-link>


      <div class="input-group" style="max-width: 300px;">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Buscar usuario...">
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"></button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="#" @click.prevent="sortUsers('asc')">A......Z</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="sortUsers('desc')">Z......A</a></li>
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
          <router-link :to="`/EditUser/${user.user_id}`" class="btn btn-icon">
            <img src="/img/logos/pencil.svg" alt="Icono lapiz">
          </router-link>
          <router-link :to="`/VerUser/${user.user_id}`" class="btn btn-icon">
            <img src="/img/logos/eye.svg" alt="Icono Ojo">
          </router-link>
          <button class="btn btn-icon" @click="confirmDelete(user.user_id)">
            <img src="/img/logos/x-circle.svg">
          </button>

          <div class="form-check form-switch d-flex justify-content-end">
            <input class="form-check-input" type="checkbox" :checked="user.userStatus_fk === 1"
              @change="toggleUserStatus(user)" :disabled="user.userStatus_fk === 3" :class="{
                'active-switch': user.userStatus_fk === 1,
                'blocked-switch': user.userStatus_fk === 2,
                'disabled-switch': user.userStatus_fk === 3,
              }" />
          </div>
        </div>
      </div>
    </div>

    <div class="btn-regresar mt-3">
      <button class="btn back-button" @click="goBack">Regresar</button>
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { getUsers, deleteUser, updateUserStatus } from '@/services/api';
import '@/assets/css/register.css';
import '@/assets/css/usersInfo.css';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const router = useRouter();
const users = ref([]);
const searchQuery = ref("");

// Cargar usuarios
const loadUsers = async () => {
  try {
    users.value = await getUsers();
    console.log("Usuarios cargados:", users.value);
    users.value.forEach(user => {
      console.log("Estado del usuario:", user.userStatus_fk);
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
};

// Filtrar usuarios, excluyendo solo a los inactivos (status === 3)
const filteredUsers = computed(() => {
  return users.value.filter(user => user.userStatus_fk !== 3 &&
    (user.full_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.document_number.toLowerCase().includes(searchQuery.value.toLowerCase())));
});

// Cambiar el estado del usuario entre Activo y Bloqueado
const toggleUserStatus = async (user) => {
  const newStatus = user.userStatus_fk === 1 ? 2 : 1;
  try {
    const response = await updateUserStatus(user.user_id, newStatus);
    if (response && response.message) {
      console.log(`Estado de ${user.full_name} cambiado a ${newStatus}`);
      user.userStatus_fk = newStatus;
    } else {
      console.error("Error: No se recibió confirmación del backend.");
      alert("Error al actualizar el estado del usuario.");
    }
  } catch (error) {
    console.error("Error al actualizar el estado del usuario:", error);
    alert("Hubo un error al cambiar el estado del usuario.");
  }
};

// Confirmar eliminación de un usuario
const confirmDelete = async (id) => {
  if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    try {
      await deleteUser(id);
      users.value = users.value.filter(user => user.user_id !== id);
      alert("Usuario eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Hubo un error al intentar eliminar el usuario.");
    }
  }
};

// Ordenar usuarios
const sortUsers = (order) => {
  users.value.sort((a, b) => order === "asc" ? a.full_name.localeCompare(b.full_name) : b.full_name.localeCompare(a.full_name));
};

// Navegar a la página de inicio
const goBack = () => {
  router.push('/Home');
};

onMounted(loadUsers);
</script>

<style scoped>
.pedido-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.icon-usuario-container {
  flex-shrink: 0;
}

.icon-container {
  display: flex;
  gap: 10px;
}

.form-check.form-switch {
  margin-left: 10px;
}

.form-check-input {
  width: 50px;
  height: 25px;
}

.form-check-input.active-switch {
  background-color: #28a745 !important;
  border-color: #28a745 !important;
}

.form-check-input.blocked-switch {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
}

.form-check-input.disabled-switch {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
}

.form-check-input:focus {
  outline: none;
  /* Elimina el borde de enfoque */
  box-shadow: none;
  /* Elimina el sombreado de enfoque */
}

.form-check-input:active {
  appearance: none;
  /* Elimina los estilos predeterminados del navegador */
  box-shadow: none;
  /* Elimina el sombreado azul al hacer clic */
}
</style>