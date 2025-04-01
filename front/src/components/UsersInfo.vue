<template>
  <div class="container">
    <HeaderComponent />

    <div class="d-flex align-items-center justify-content-between w-100 mb-3">
      <router-link to="/AgregarUser" class="btn btn-agregar">
        <img src="/img/logos/person-plus-fill.svg" style="width: 20px; height: 20px; margin-right: 5px;">
        Agregar
      </router-link>

      <div class="input-group" style="max-width: 300px;">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Buscar usuario...">
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"></button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="#" @click.prevent="sortUsers('asc')">A......Z</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="sortUsers('desc')">Z......A</a></li>
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
          <router-link :to="`/EditUser/${user.user_id}`" class="btn btn-icon">
            <img src="/img/logos/pencil.svg" alt="Icono lapiz">
          </router-link>
          <router-link :to="`/VerUser/${user.user_id}`" class="btn btn-icon">
            <img src="/img/logos/eye.svg" alt="Icono Ojo">
          </router-link>
          <button class="btn btn-icon" @click="confirmDelete(user.user_id)">
            <img src="/img/logos/x-circle.svg">
          </button>
        </div>
      </div>
    </div>

    <div class="btn-regresar mt-3">
      <button class="btn botonav" @click="goBack">Regresar</button>
    </div>
    
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from "vue-router";
import { getUsers, deleteUser } from '@/services/api';
import '@/assets/css/style.css';
import '@/assets/css/usersInfo.css';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const router = useRouter();
const users = ref([]);
const searchQuery = ref("");
const isMenuOpen = ref(false);

// 🔹 Cargar usuarios desde la API al montar el componente
const loadUsers = async () => {
  try {
    users.value = await getUsers();
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
};

// 🔹 Filtrar usuarios por nombre
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  return users.value.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 🔹 Confirmar eliminación del usuario
const confirmDelete = async (id) => {
  const confirmation = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
  if (confirmation) {
    try {
      // Realizar la eliminación del usuario
      await deleteUser(id);
      
      // Eliminar el usuario de la lista localmente
      users.value = users.value.filter(user => user.user_id !== id);
      
      // Puedes agregar una alerta para confirmar la eliminación
      alert("Usuario eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Hubo un error al intentar eliminar el usuario.");
    }
  }
};

// 🔹 Ordenar usuarios alfabéticamente
const sortUsers = (order) => {
  users.value.sort((a, b) => {
    if (order === "asc") return a.full_name.localeCompare(b.full_name);
    if (order === "desc") return b.full_name.localeCompare(a.full_name);
  });
};

// 🔹 Redirigir al home
const goBack = () => {
  router.push('/Home');
};

// 🔹 Cerrar menú al hacer clic fuera
const closeMenu = (event) => {
  if (!event.target.closest(".dropdown")) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeMenu);
  loadUsers();
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});
</script>
