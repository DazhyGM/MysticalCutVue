<!-- src/components/HeaderComponent.vue -->
<template>
    <header class="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
      <router-link to="/Home">
  <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
</router-link>

  
      <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li v-for="module in roleModules" :key="module.module_route" class="nav-item">
          <a class="nav-link" :href="`/${module.module_route}`">{{ module.role_module }}</a>
        </li>
      </ul>
  
      <div class="col-md-3 text-end">
        <div class="dropdown">
          <button class="btn dropdown-toggle" @click="toggleMenu">
            <img src="/img/background/Icono usuario.png" alt="Profile" class="icon me-2" />
            {{ user.full_name || 'Usuario' }}
          </button>
          <ul v-if="isMenuOpen" class="dropdown-menu dropdown-menu-end show">
            <li>
              <button class="dropdown-item" @click="goToProfile">Perfil</button>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <button class="dropdown-item" @click="logout">Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const isMenuOpen = ref(false);
  
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
  
  const closeMenu = (event) => {
    if (!event.target.closest('.dropdown')) {
      isMenuOpen.value = false;
    }
  };
  
  onMounted(() => {
    document.addEventListener('click', closeMenu);
  });
  
  onUnmounted(() => {
    document.removeEventListener('click', closeMenu);
  });
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };
  
  const goToProfile = () => {
    router.push('/perfil');
  };
  
  const user = ref({ full_name: '' });
  
  onMounted(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (error) {
        console.error('Error al parsear usuario de localStorage', error);
      }
    }
  });
  </script>
  