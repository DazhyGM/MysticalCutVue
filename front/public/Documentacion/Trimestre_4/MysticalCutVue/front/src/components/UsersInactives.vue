<template>
  <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <router-link to="/Home">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
        </router-link>
      </div>

      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Usuarios Inactivos</h1>
      </ul>
    </header>

    <div class="search-filter-container">
      <div class="input-group" style="max-width: 300px;">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Buscar usuario...">
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"></button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="#" @click.prevent="sortUsers('asc')">A......Z</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="sortUsers('desc')">Z......A</a></li>
        </ul>
      </div>

      <!-- Filtro por rol -->
      <select v-model="selectedRole" class="form-select" style="max-width: 200px;">
        <option value="">Todos los roles</option>
        <option value="1">Administrador</option>
        <option value="2">Empleado</option>
        <option value="3">Cliente</option>
        <!-- Agrega más roles si tienes -->
      </select>
    </div>

    <div class="content">
      <div class="pedido-container">
        <div v-for="user in filteredInactiveUsers" :key="user.user_id" class="pedido-box">
          <div class="icon-usuario-container">
            <img src="/img/logos/person-circle.svg" class="btn icon-usuario">
          </div>
          <span class="user-name">{{ user.full_name }}</span>
          <button class="activate-btn" @click="activateUser(user)">Activar</button>
        </div>
        <button class="btn back-button" @click="goBack">Regresar</button>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getInactiveUsers, updateUserStatus } from '@/services/api';
import FooterComponent from '@/components/FooterComponent.vue';
import '@/assets/css/style.css';
import '@/assets/css/usersInfo.css';

const router = useRouter();
const inactiveUsers = ref([]);
const searchQuery = ref("");
const selectedRole = ref(""); // Nuevo filtro por rol

const loadInactiveUsers = async () => {
  try {
    inactiveUsers.value = await getInactiveUsers();
  } catch (error) {
    console.error("Error al obtener usuarios inactivos:", error);
  }
};

const activateUser = async (user) => {
  try {
    await updateUserStatus(user.user_id, 1);
    inactiveUsers.value = inactiveUsers.value.filter(u => u.user_id !== user.user_id);
  } catch (error) {
    console.error("Error al activar usuario:", error);
  }
};

// Computed para filtrar usuarios inactivos
const filteredInactiveUsers = computed(() => {
  return inactiveUsers.value.filter(user =>
    user.userStatus_fk === 3 &&
    (selectedRole.value === "" || user.role_fk === Number(selectedRole.value)) &&
    (
      user.full_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.document_number.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

const goBack = () => {
  router.push('/Users');
};

onMounted(loadInactiveUsers);
</script>

<style scoped>
.activate-btn {
  background-color: #CCAF54;
  color: rgb(0, 0, 0);
  padding: 5px 10px;
  border: 1px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: #6d550e;
}
.activate-btn:hover {
  background-color: #8a7432;
}
</style>
