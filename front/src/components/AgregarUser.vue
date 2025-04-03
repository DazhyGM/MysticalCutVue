<template>
    <div class="container">
      <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div class="col-md-3 mb-2 mb-md-0">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
        </div>
        <ul class="nav col-12 justify-content-center mx-auto">
          <h1>Agregar Usuario</h1>
        </ul>
      </header>
    </div>
  
    <div class="recover-container">
      <form class="recover-form" @submit.prevent="confirmRegistro">
        <div class="row">
          <div class="col-md-6">
            <h3>Tipo de documento de identificación</h3>
            <label>
              <input type="radio" v-model="form.docType" value="1" required /> Cédula de Ciudadanía
            </label>
            <label>
              <input type="radio" v-model="form.docType" value="2" required /> Tarjeta de Identidad
            </label>
            <label>
              <input type="radio" v-model="form.docType" value="3" required /> Cédula de Extranjería
            </label>
  
            <label for="full-name">Nombres y Apellidos</label>
            <input type="text" id="full-name" v-model="form.fullName" required />
  
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" v-model="form.email" required />

            <label for="phone">Telefono</label>
            <input type="text" id="phone" v-model="form.phone" required />
  
  
          </div>
  
          <div class="col-md-6">
            <label for="id-number">Número de Identificación</label>
            <input type="text" id="id-number" v-model="form.idNumber" required />
            <label for="address">Dirección</label>
            <input type="text" id="address" v-model="form.address" required />
            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="form.password" required />
            <label for="confirm-password">Confirmar Contraseña</label>
            <input type="password" id="confirm-password" v-model="form.confirmPassword" required />
            <!-- 🔹 Selector de Rol con Estilos -->
          <label for="role">Rol del Usuario</label>
          <select id="role" class="select-field" v-model="form.role" required>
            <option value="" disabled>Seleccione un rol</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
          </div>
          
        </div>
  
        <button type="submit" class="btn button-registrar">Agregar Usuario</button>
      </form>
      <button class="back-button" @click="goBack">Regresar</button>
    </div>
    <footer class="py-3 my-4">
      <ul class="nav justify-content-center border-bottom pb-3 mb-3"></ul>
    </footer>
  </template>
  
  <script>
  import { reactive, ref } from 'vue';
  import axios from 'axios';
  import '@/assets/css/register.css';
  
  export default {
    setup() {
      const form = reactive({
        docType: '',
        fullName: '',
        email: '',
        idNumber: '',
        address: '',
        phone:'',
        password: '',
        confirmPassword: '',
        role: '' 
      });
  
      // 🔹 Lista de roles disponibles (podrías cargarlos desde la API si lo prefieres)
      const roles = ref([
        { id: 1, name: 'Administrador' },
        { id: 2, name: 'Empleado' },
        { id: 3, name: 'Cliente' } // Si el backend maneja el ID 3 como cliente
      ]);
  
      const confirmRegistro = async () => {
        if (form.password.trim() !== form.confirmPassword.trim()) {
          alert('Las contraseñas no coinciden');
          return;
        }
  
        try {
          const response = await axios.post('http://localhost:5000/api/users/users/register', {
            full_name: form.fullName,
            user_email: form.email,
            user_password: form.password.trim(),
            document_number: form.idNumber,
            type_document_id: form.docType,
            address: form.address,
            phone: form.phone,
            role_fk: form.role // 🔹 Se envía el rol seleccionado
          });
  
          alert(response.data.message);
          console.log(response.data);
          window.location.href = '/Users'; 
        } catch (error) {
          console.error(error);
          alert('Hubo un error al registrar el usuario');
        }
      };
  
      const goBack = () => {
        window.location.href = '/Users';
      };
  
      return { form, roles, confirmRegistro, goBack };
    }
  };
  </script>
  
  <style scoped>


/* 🔹 Inputs */
.input-field,
.select-field {
  width: 100%;
  padding: 10px;
  color: #ffffff;
  background-color: #333;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 5px;
  transition: 0.3s ease-in-out;
}

.input-field:focus,
.select-field:focus {
  border-color: #cccccc3d;
  box-shadow: 0px 0px 5px rgba(0, 123, 255, 0.3);
  outline: none;
}

/* 🔹 Radio Buttons */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #333;
}


</style>