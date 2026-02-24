<template>
  <div class="row mb-3">
    <ul class="nav col-12 justify-content-center mx-auto">
      <h1>Editar Usuario</h1>
    </ul>
  </div>

  <div class="recover-container">
    <form class="recover-form" @submit.prevent="confirmEdit">
      <div class="row">
        <div class="col-md-6">
          <h3>Tipo de documento de identificación</h3>
          <label>
            <input type="radio" v-model="form.docType" value="1" disabled class="readonly-field" /> Cédula de Ciudadanía
          </label>
          <label>
            <input type="radio" v-model="form.docType" value="2" disabled class="readonly-field" /> Tarjeta de Identidad
          </label>
          <label>
            <input type="radio" v-model="form.docType" value="3" disabled class="readonly-field" /> Cédula de
            Extranjería
          </label>

          <label for="full-name">Nombres y Apellidos</label>
          <input type="text" id="full-name" v-model="form.fullName" disabled class="readonly-field" />

          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="form.email" required class="editable-field" />

          <label for="phone">Teléfono</label>
          <input type="text" id="phone" v-model="form.phone" required class="editable-field" />
        </div>

        <div class="col-md-6">
          <label for="id-number">Número de Identificación</label>
          <input type="text" id="id-number" v-model="form.idNumber" disabled class="readonly-field" />

          <label for="address">Dirección</label>
          <input type="text" id="address" v-model="form.address" required class="editable-field" />

          <label for="password">Nueva Contraseña</label>
          <input type="password" id="password" v-model="form.password" class="editable-field" />

          <label for="confirm-password">Confirmar Contraseña</label>
          <input type="password" id="confirm-password" v-model="form.confirmPassword" class="editable-field" />
          <label for="role">Rol del Usuario</label>
          <select id="role" class="select-field" v-model="form.role" required>
            <option value="" disabled>Seleccione un rol</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>


      </div>

      <button type="submit" class="btn button-guardar">Guardar Cambios</button>
    </form>
    <button class="back-button" @click="goBack">Regresar</button>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

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

    const route = useRoute();
    const router = useRouter();
    const userId = route.params.id;

    const roles = ref([
      { id: 1, name: 'Administrador' },
      { id: 2, name: 'Empleado' },
      { id: 3, name: 'Cliente' }
    ]);

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
        form.phone = user.phone;
        form.role = user.role_fk;
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
          user_email: form.email,
          phone: form.phone,
          role_fk: form.role
        };

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
@import '@/assets/css/users/editUsers.css';
</style>
