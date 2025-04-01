<template>
    <div class="container">
      <!-- Encabezado igual que en el registro -->
      <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div class="col-md-3 mb-2 mb-md-0">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
        </div>
        <ul class="nav col-12 justify-content-center mx-auto">
          <h1>Editar Usuario</h1>
        </ul>
      </header>
    </div>
  
    <div class="recover-container">
      <form class="recover-form" @submit.prevent="confirmEdit">
        <div class="row">
          <div class="col-md-6">
            <h3>Tipo de documento de identificación</h3>
            <!-- Igual que en el registro -->
            <label>
              <input type="radio" v-model="form.docType" value="1" disabled /> Cédula de Ciudadanía
            </label>
            <label>
              <input type="radio" v-model="form.docType" value="2" disabled /> Tarjeta de Identidad
            </label>
            <label>
              <input type="radio" v-model="form.docType" value="3" disabled /> Cédula de Extranjería
            </label>
            <label for="full-name">Nombres y Apellidos</label>
            <input type="text" id="full-name" v-model="form.fullName" required />
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" v-model="form.email" required /> <!-- Desactivado para que no se edite -->
          </div>
          <div class="col-md-6">
            <label for="id-number">Número de Identificación</label>
            <input type="text" id="id-number" v-model="form.idNumber" required disabled /> <!-- Desactivado para que no se edite -->
            <label for="address">Dirección</label>
            <input type="text" id="address" v-model="form.address" required />
            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="form.password" />
            <label for="confirm-password">Confirmar Contraseña</label>
            <input type="password" id="confirm-password" v-model="form.confirmPassword" />
            
          </div>
          <!-- 🔹 Selector de Rol con Estilos -->
          <label for="role">Rol del Usuario</label>
          <select id="role" class="select-field" v-model="form.role" required>
            <option value="" disabled>Seleccione un rol</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
  
        <button type="submit" class="btn button-registrar">Guardar Cambios</button>
      </form>
      <button class="back-button" @click="goBack">Regresar</button>
    </div>
    <FooterComponent />
  </template>
  
  <script>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import '@/assets/css/style.css';
import '@/assets/css/footer.css';

export default {
  setup() {
    const form = reactive({
      docType: '',
      fullName: '',
      email: '',
      idNumber: '',
      address: '',
      password: '',
      confirmPassword: '',
      role: ''
    });

    const route = useRoute();
    const router = useRouter();
    const userId = route.params.id;

    // 🔹 Definir lista de roles
    const roles = ref([
      { id: 1, name: 'Administrador' },
      { id: 2, name: 'Empleado' },
      { id: 3, name: 'Cliente' }
    ]);

    // Cargar datos del usuario
    onMounted(async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No tienes autorización. Inicia sesión de nuevo.');
          router.push('/Login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/users/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = response.data;
        form.fullName = user.full_name;
        form.email = user.user_email;
        form.idNumber = user.document_number;
        form.address = user.address;
        form.role = user.role_fk; // 🔹 Se carga el rol actual
        form.docType = user.type_document_id;
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
        alert('No se pudo cargar la información del usuario.');
      }
    });

    const confirmEdit = async () => {
      const trimmedPassword = form.password.trim();
      const trimmedConfirmPassword = form.confirmPassword.trim();

      if (trimmedPassword !== trimmedConfirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No tienes autorización. Inicia sesión de nuevo.');
          router.push('/Login');
          return;
        }

        const updateData = {
          full_name: form.fullName,
          address: form.address,
          role_fk: form.role
        };

        // 🔹 Solo enviar contraseña si el usuario la cambia
        if (trimmedPassword) {
          updateData.user_password = trimmedPassword;
        }

        const response = await axios.put(
          `http://localhost:5000/api/users/users/${userId}`,
          updateData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert(response.data.message);
        router.push('/Users'); 
      } catch (error) {
        console.error('Error al editar el usuario:', error);
        alert('Hubo un error al editar el usuario.');
      }
    };

    const goBack = () => {
      router.push('/Users');
    };

    return { form, roles, confirmEdit, goBack };
  }
};
</script>

<style scoped>
/* Cambiar el color de los radio buttons seleccionados */
input[type="radio"]:checked {
  background-color: #af4c4c; /* Color de fondo cuando está seleccionado */
  border-color: #4CAF50; /* Cambiar el borde */
}

/* Cambiar el color de la etiqueta cuando el radio está seleccionado */
input[type="radio"]:checked + label {
  color: #d30b0b; /* Color de la etiqueta */
}
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

    