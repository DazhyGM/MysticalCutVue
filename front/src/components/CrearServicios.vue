<template>
  <div class="container">
    <!-- Header -->
    <header class="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
  <router-link to="/Home">
    <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
  </router-link>
</div>

<ul class="nav col-12 justify-content-center mx-auto">
          <h1>Agregar Servicio</h1>
        </ul>
    </header>

    <!-- Main Content -->
    <div class="row edit-container">
      <!-- Imagen y Precio -->
      <div class="col-md-5 text-center">
        <div class="image-placeholder mx-auto mb-3">
          <img :src="imagePreview || '/img/background/signointerrogacion.jpg'" alt="Preview" class="preview-image" />
        </div>
        <div class="mb-3">
          <label class="form-label">Imagen</label>
          <input type="file" @change="handleImageUpload" class="form-control custom-input" />
        </div>
        <div class="mb-3">
          <label class="form-label">Precio</label>
          <input v-model="form.price" type="number" class="form-control custom-input" placeholder="Precio" required />
        </div>
      </div>

      <!-- Formulario -->
      <div class="col-md-5 offset-md-1">
        <form @submit.prevent="handleSubmit" class="edit-form">
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input v-model="form.name_service" type="text" class="form-control custom-input" placeholder="Nombre del servicio" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <input v-model="form.description" type="text" class="form-control custom-input" placeholder="Descripción" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Tiempo estimado</label>
            <input v-model="form.estimated_time" type="text" class="form-control custom-input" placeholder="00:30:00" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Categoría</label>
            <select v-model="form.id_category_services" class="form-select custom-input" required>
              <option disabled value="">Seleccionar</option>
              <option value="1">Corte</option>
              <option value="2">Barba</option>
              <option value="3">Cejas</option>
              <option value="4">Tintes</option>
              <option value="5">Combos</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Estado</label>
            <select v-model="form.id_status" class="form-select custom-input">
              <option value="1">Activo</option>
              <option value="2">Inactivo</option>
            </select>
          </div>

          <button type="submit" class="btn w-100 btn-add">
            Agregar
          </button>
        </form>
      </div>
    </div>

    <!-- Botón Regresar -->
    <div class="text-center mt-3">
      <router-link to="/Services" class="btn btn-secondary btn-regresar">
        Regresar
      </router-link>
    </div>

    <!-- Mensajes -->
    <div class="text-center mt-3">
      <p v-if="message" class="text-success">{{ message }}</p>
      <p v-if="error" class="text-danger">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createService } from '@/services/servicesApi';

export default {
  setup() {
    const router = useRouter();
    const imagePreview = ref(null);
    const selectedImageFile = ref(null); // Archivo real

    const form = ref({
      name_service: '',
      description: '',
      estimated_time: '',
      price: '',
      id_category_services: '',
      id_status: 1,
      image: ''
    });

    const message = ref('');
    const error = ref('');

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        selectedImageFile.value = file;
        form.value.image = file.name; // Opcional: nombre del archivo
        imagePreview.value = URL.createObjectURL(file);
      }
    };

    const handleSubmit = async () => {
      message.value = '';
      error.value = '';

      // Validación
      if (
        !form.value.name_service.trim() ||
        !form.value.description.trim() ||
        !form.value.estimated_time.trim() ||
        !form.value.price ||
        !form.value.id_category_services ||
        !selectedImageFile.value
      ) {
        error.value = 'Por favor, complete todos los campos antes de continuar.';
        return;
      }

      try {
        const formData = new FormData();
        formData.append('name_service', form.value.name_service);
        formData.append('description', form.value.description);
        formData.append('estimated_time', form.value.estimated_time);
        formData.append('price', form.value.price);
        formData.append('id_category_services', form.value.id_category_services);
        formData.append('id_status', form.value.id_status);
        formData.append('image', selectedImageFile.value); // El archivo real

        await createService(formData); // Asegúrate de usar fetch o axios que soporte FormData
        message.value = 'Servicio creado correctamente.';

        // Reset
        form.value = {
          name_service: '',
          description: '',
          estimated_time: '',
          price: '',
          id_category_services: '',
          id_status: 1,
          image: ''
        };
        selectedImageFile.value = null;
        imagePreview.value = null;

      } catch (err) {
        console.error(err);
        error.value = 'Error al crear el servicio.';
      }
    };

    const regresar = () => {
      router.push('/editarServiciosADM');
    };

    return {
      form,
      imagePreview,
      handleSubmit,
      handleImageUpload,
      regresar,
      message,
      error
    };
  }
};
</script>


<style scoped>



.container {
  padding: 10px; /* Aún más compacto */
  font-size: 13px; /* Letra un poco más pequeña */
}

.image-placeholder {
  width: 100%;
  max-height: 170px; /* Imagen más pequeña */
  border: 2px solid #ccaf54;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.custom-input {
  background-color: #333;
  color: #fff;
  border: 1px solid #ccaf54;
  font-size: 13px;
  padding: 6px 10px; /* Input más delgado */
}

.custom-input::placeholder {
  color: #ccc;
}

.form-label {
  color: #ccaf54;
  font-size: 13px;
}

.title {
  color: #ccaf54;
  text-align: center;
  font-size: 24px; /* Título más compacto */
  font-weight: bold;
  margin-top: 10px;
}

.btn-add {
  background-color: #ccaf54;
  color: black;
  border: none;
  padding: 8px 0; /* Botón más pequeño */
  font-size: 13px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn-add:hover {
  background-color: #b3953f;
}

.btn-regresar {
  margin-top: 12px;
  background-color: #6c757d;
  color: white;
  padding: 6px 14px; /* Botón más pequeño */
  font-size: 13px;
}

.btn-regresar:hover {
  background-color: #5a6268;
}
</style>

