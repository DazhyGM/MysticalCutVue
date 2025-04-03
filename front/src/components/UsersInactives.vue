<template>
    <div class="container">
        <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
      </div>
      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Usuarios Inactivos</h1>
      </ul>
    </header>
      <div class="content">
        <div class="pedido-container">
          <div v-for="user in inactiveUsers" :key="user.user_id" class="pedido-box">
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
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getInactiveUsers, updateUserStatus } from '@/services/api';
  import FooterComponent from '@/components/FooterComponent.vue';
  import '@/assets/css/style.css';
  import '@/assets/css/usersInfo.css';
  
  const router = useRouter();
  const inactiveUsers = ref([]);
  
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
  .activate-btn:hover{
    background-color: #8a7432;
  }
  
  </style>
  