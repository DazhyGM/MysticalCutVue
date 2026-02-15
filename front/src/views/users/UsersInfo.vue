<template>
  <div class="container my-3">

    <!-- FILTROS Y BUSCADOR -->
    <div class="row mb-3 gy-2">
      <div class="col-12 col-md-3">
        <router-link to="/AgregarUser" class="btn btn-agregar w-100 d-flex align-items-center justify-content-center">
          <img src="/img/logos/person-plus-fill.svg" style="width: 20px; height: 20px; margin-right: 5px;">
          Agregar
        </router-link>
      </div>

      <div class="col-12 col-md-3">
        <router-link to="/usersInactives" class="btn botonav w-100">
          Ver usuarios inactivos
        </router-link>
      </div>

      <div class="col-12 col-md-3">
        <select v-model="selectedRole" @change="filtrarPorRol" class="form-select w-100">
          <option value="">Todos los roles</option>
          <option value="1">Administrador</option>
          <option value="2">Empleado</option>
          <option value="3">Cliente</option>
        </select>
      </div>

      <div class="col-12 col-md-3">
        <div class="input-group">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Buscar usuario...">
          <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"></button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#" @click.prevent="sortUsers('asc')">A......Z</a></li>
            <li><a class="dropdown-item" href="#" @click.prevent="sortUsers('desc')">Z......A</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- LISTADO DE USUARIOS -->
    <div class="pedido-container">
      <div v-for="user in filteredUsers" :key="user.user_id" class="pedido-box">
        <div class="icon-usuario-container">
          <img src="/img/logos/person-circle.svg" class="btn icon-usuario">
        </div>

        <h5 class="mb-2">{{ user.full_name }}</h5>

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

          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              :checked="user.userStatus_fk === 1"
              @change="toggleUserStatus(user)"
              :disabled="user.userStatus_fk === 3"
              :class="{
                'active-switch': user.userStatus_fk === 1,
                'blocked-switch': user.userStatus_fk === 2,
                'disabled-switch': user.userStatus_fk === 3,
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- BOTÓN REGRESAR -->
    <div class="btn-regresar mt-3">
      <button class="btn back-button" @click="goBack">Regresar</button>
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { getUsers, deleteUser, updateUserStatus, filterUsersByRole } from '@/services/api';
import '@/assets/css/register.css';
import '@/assets/css/usersInfo.css';


const router = useRouter();
const users = ref([]);
const searchQuery = ref("");
const selectedRole = ref("");

// Cargar usuarios
const loadUsers = async () => {
  try {
    users.value = await getUsers();
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
};

// Filtrado de usuarios activos y búsqueda
const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.userStatus_fk !== 3 &&
    (selectedRole.value === "" || user.role_fk === Number(selectedRole.value)) &&
    (user.full_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.document_number.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

// Filtro por rol
const filtrarPorRol = async () => {
  try {
    if (selectedRole.value === "") {
      await loadUsers();
    } else {
      const data = await filterUsersByRole(selectedRole.value);
      users.value = Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error("Error al filtrar por rol:", error);
  }
};

// Cambiar estado del usuario
const toggleUserStatus = async (user) => {
  const newStatus = user.userStatus_fk === 1 ? 2 : 1;
  try {
    const response = await updateUserStatus(user.user_id, newStatus);
    if (response && response.message) {
      user.userStatus_fk = newStatus;
    } else {
      alert("Error al actualizar el estado del usuario.");
    }
  } catch (error) {
    alert("Hubo un error al cambiar el estado del usuario.");
  }
};

// Confirmar eliminación
const confirmDelete = async (id) => {
  if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    try {
      await deleteUser(id);
      users.value = users.value.filter(user => user.user_id !== id);
      alert("✅ Usuario eliminado exitosamente.");
    } catch (error) {
      alert("Hubo un error al intentar eliminar el usuario.");
    }
  }
};

// Ordenar usuarios
const sortUsers = (order) => {
  users.value.sort((a, b) => order === "asc" ? a.full_name.localeCompare(b.full_name) : b.full_name.localeCompare(a.full_name));
};

// Regresar
const goBack = () => {
  router.push('/Home');
};

onMounted(loadUsers);
</script>

<style scoped>
.pedido-container {
  max-height: 70vh;
  overflow-y: auto;
}

.pedido-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.icon-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
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
  box-shadow: none;
}

.form-check-input:active {
  appearance: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .pedido-box {
    flex-direction: column;
    align-items: flex-start;
  }

  .icon-container {
    justify-content: flex-start;
  }

  .btn-regresar button {
    width: 100%;
  }
}
</style>
