<template>
  <div class="container">
    <!-- Encabezado -->
    <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
      </div>
      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Editar Perfil</h1>
      </ul>
    </header>
  </div>

  <div class="recover-container">
    <form class="recover-form" @submit.prevent="confirmEdit">
      <div class="row">
        <div class="col-md-6">
          <h3>Tipo de documento de identificación</h3>
          <label>
            <input type="radio" v-model="form.docType" value="1" :disabled="form.role !== 1" class="disabled-field" /> Cédula
            de Ciudadanía
          </label>
          <label>
            <input type="radio" v-model="form.docType" value="2" :disabled="form.role !== 1" class="disabled-field" /> Tarjeta
            de Identidad
          </label>
          <label>
            <input type="radio" v-model="form.docType" value="3" :disabled="form.role !== 1" class="disabled-field" /> Cédula
            de Extranjería
          </label>
          <label for="full-name">Nombres y Apellidos</label>
          <input type="text" id="full-name" v-model="form.fullName" required />
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="form.email" required />
          <label for="phone">Teléfono</label>
          <input type="text" id="phone" v-model="form.phone" required />
        </div>
        <div class="col-md-6">
          <label for="id-number">Número de Identificación</label>
          <input type="text" id="id-number" v-model="form.idNumber" required :disabled="form.role !== 1"
            class="disabled-field" />
          <label for="address">Dirección</label>
          <input type="text" id="address" v-model="form.address" required />
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="form.password" />
          <label for="confirm-password">Confirmar Contraseña</label>
          <input type="password" id="confirm-password" v-model="form.confirmPassword" />
          <!-- Selector de Rol -->
        <label for="role">Rol del Usuario</label>
        <select id="role" class="select-field" v-model="form.role" required :disabled="form.role !== 1">
          <option value="" disabled>Seleccione un rol</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
        </div>
        
      </div>

      <button type="submit" class="btn button-registrar">Guardar Cambios</button>
    </form>
    <button class="back-button" @click="goBack">Regresar</button>
  </div>
  <footer class="py-3 my-4">
      <ul class="nav justify-content-center border-bottom pb-3 mb-3"></ul>
    </footer>
</template>

<script>
import { reactive, ref, onMounted, computed } from 'vue';
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
      phone: '',
      password: '',
      confirmPassword: '',
      role: ''
    });

    const route = useRoute();
    const router = useRouter();
    const userId = route.params.id;

    // Lista de roles
    const roles = ref([
      { id: 1, name: 'Administrador' },
      { id: 2, name: 'Empleado' },
      { id: 3, name: 'Cliente' }
    ]);

    // Computed para saber si el usuario es cliente
    const isClient = computed(() => form.role === 3);

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
        form.phone = user.phone;
        form.role = user.role_fk;
        form.docType = user.type_document_id;
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
        alert('No se pudo cargar la información del usuario.');
      }
    });

    const confirmEdit = async () => {
      if (form.password.trim() !== form.confirmPassword.trim()) {
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
          phone: form.phone,
        };

        // Solo enviar contraseña si el usuario la cambia
        if (form.password.trim()) {
          updateData.user_password = form.password.trim();
        }

        const response = await axios.put(
          `http://localhost:5000/api/users/users/${userId}`,
          updateData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert(response.data.message);
        router.push('/Perfil');
      } catch (error) {
        console.error('Error al editar el usuario:', error);
        alert('Hubo un error al editar el usuario.');
      }
    };

    const goBack = () => {
      router.push('/Perfil');
    };

    return { form, roles, confirmEdit, goBack, isClient };
  }
};
</script>

<style scoped>
/* 🔹 Estilos para campos deshabilitados */
.disabled-field {
  background-color: #f0f0f000 !important;
  /* Color más claro */
  color: #888 !important;
  cursor: not-allowed;
  border: 1px solid #ccc;
}

/* 🔹 Estilos para inputs y selects */
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

/* 🔹 Efecto cuando el input está deshabilitado */
input:disabled,
select:disabled {
  cursor: not-allowed;
}
</style>
