<template>
  <div class="container">
    <ul class="nav col-12 justify-content-center mx-auto">
      <h1 class="titulo-header">Agregar Usuario</h1>
    </ul>
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
</template>

<script>
import { reactive, ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const form = reactive({
      docType: '',
      fullName: '',
      email: '',
      idNumber: '',
      address: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: ''
    });

    const roles = ref([
      { id: 1, name: 'Administrador' },
      { id: 2, name: 'Empleado' },
      { id: 3, name: 'Cliente' }
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
          role_fk: form.role
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
@import '@/assets/css/users/agregarUser.css';
</style>