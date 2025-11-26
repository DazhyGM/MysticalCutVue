<template>
    <div class="container">
      <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div class="col-md-3 mb-2 mb-md-0">
  <router-link to="/Home">
    <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
  </router-link>
</div>

        <ul class="nav col-12 justify-content-center mx-auto">
          <h1>Detalles del Usuario</h1>
        </ul>
      </header>
    </div>
  
    <div class="recover-container">
      <form class="recover-form">
        <div v-if="isFormReady" class="row">
          <div class="col-md-6">
            <label for="docType">Tipo de documento</label>
            <input type="text" id="docType" :value="docTypeName" disabled />
  
            <label for="full-name">Nombres y Apellidos</label>
            <input type="text" id="full-name" v-model="user.fullName" disabled />
  
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" v-model="user.email" disabled />

            <label for="phone">Telefono</label>
            <input type="text" id="phone" v-model="user.phone" disabled />
          </div>
  
          <div class="col-md-6">
            <label for="id-number">Número de Identificación</label>
            <input type="text" id="id-number" v-model="user.idNumber" disabled />
  
            <label for="address">Dirección</label>
            <input type="text" id="address" v-model="user.address" disabled />

            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="user.password" disabled />
  
            <label for="role">Rol</label>
            <input type="text" id="role" :value="roleName" disabled />
          </div>
        </div>
  
        <div v-else>
          <p>Cargando datos del usuario...</p>
        </div>
  
        <button type="button" class="btn back-button" @click="goBack">Regresar</button>
      </form>
    </div>
    <footer class="py-3 my-4">
      <ul class="nav justify-content-center border-bottom pb-3 mb-3"></ul>
    </footer>
  </template>
  
  <script>
  import { reactive, computed, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  
  export default {
    setup() {
      const user = reactive({
        fullName: '',
        email: '',
        idNumber: '',
        address: '',
        phone:'',
        role: '',
        password:'',
        docType: ''
      });
  
      const route = useRoute();
      const router = useRouter();
      const userId = route.params.id;
      const token = localStorage.getItem('token');
  
      const isLoading = reactive({ value: true });
  
      // Diccionarios para mapear IDs a nombres
      const rolesMap = {
        1: "Administrador",
        2: "Empleado",
        3: "Cliente"
      };
  
      const docTypesMap = {
        1: "Cédula de Ciudadanía",
        2: "Tarjeta de Identidad",
        3: "Cédula de Extranjería"
      };
  
      onMounted(async () => {
        try {
          if (!token) {
            alert('No tienes permiso para ver esta información.');
            router.push('/Login');
            return;
          }
  
          const response = await axios.get(`http://localhost:5000/api/users/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
  
          const userData = response.data;
          user.fullName = userData.full_name || '';
          user.email = userData.user_email || '';
          user.idNumber = userData.document_number || '';
          user.address = userData.address || '';
          user.phone = userData.phone || '';
          user.role = userData.role_fk || '';
          user.password = userData.user_password || '';
          user.docType = userData.type_document_id || '';
  
          isLoading.value = false;
        } catch (error) {
          console.error(error);
          alert('No se pudo cargar la información del usuario. Verifica tu sesión.');
          router.push('/Users');
        }
      });
  
      // Computed para obtener el nombre del rol
      const roleName = computed(() => {
        return rolesMap[user.role] || "Desconocido";
      });
  
      // Computed para obtener el nombre del tipo de documento
      const docTypeName = computed(() => {
        return docTypesMap[user.docType] || "Desconocido";
      });
  
      const goBack = () => {
        router.push('/Users');
      };
  
      const isFormReady = computed(() => !isLoading.value && user.docType !== '');
  
      return { user, goBack, isFormReady, roleName, docTypeName };
    }
  };
  </script>
  