<template>
  <div class="container">

    <div class="row edit-container">
      <div class="col-md-5 text-center">
        <label class="form-label">Imagen</label>
        <div class="image-placeholder mx-auto mb-3">
          <img :src="imagePreview || '/img/background/signointerrogacion.jpg'" alt="Preview" class="preview-image" />
        </div>
        <div class="mb-3">
          <input type="file" @change="handleFileChange" accept="image/*" class="form-select custom-input" />
        </div>
        <div class="mb-3">
          <label class="block mb-1 form-label">Precio</label>
          <input v-model.number="form.price" type="number" min="1000" step="500" required
            class="form-select custom-input" placeholder="Precio" />
        </div>
        <div class="mb-3">
          <label class="block mb-1 form-label">Cantidad</label>
          <input v-model.number="form.amount" type="number" min="1" required class="form-select custom-input"
            placeholder="Cantidad" />
        </div>
      </div>

      <div class="col-md-5 offset-md-1">
        <form @submit.prevent="handleSubmit" class="edit-form">
          <div class="mb-3">
            <label class="block mb-1 form-label">Nombre</label>
            <input v-model="form.name" type="text" required class="form-select custom-input"
              placeholder="Nombre del producto" />
          </div>

          <div class="mb-3">
            <label class="block mb-1 form-label">Descripción</label>
            <textarea v-model="form.description" required rows="3" class="form-select custom-input"
              placeholder="Descripción del producto"></textarea>
          </div>

          <div class="mb-3">
            <label class="block mb-1 form-label">Categoría</label>
            <select v-model="form.id_category" required class="form-select custom-input">
              <option disabled value="">Seleccione una categoría</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
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
            Registrar Producto
          </button>
        </form>
      </div>

    </div>
    <div class="btn-regresar mt-3">
      <button class="btn back-button" @click="goBack">Regresar</button>
    </div>

    <div class="text-center mt-3">
      <p v-if="message" class="text-success">{{ message }}</p>
      <p v-if="error" class="text-danger">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createProduct } from '@/services/productsApi';

const goBack = () => router.push("/Products"); 

const router = useRouter();

const form = ref({
  name: '',
  price: 1000,
  description: '',
  amount: 1,
  id_category: '',
  image: null,
  id_status: 1,
});

const categories = ref([
  { id: 1, name: 'Cabello' },
  { id: 2, name: 'Belleza' },
  { id: 3, name: 'Tintes y Coloración' },
  { id: 4, name: 'Tratamientos Capilares' },
  { id: 5, name: 'Productos de Estilo' },
]);

const imagePreview = ref(null);
const message = ref('');
const error = ref('');

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    form.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
  } else {
    form.value.image = null;
    imagePreview.value = null;
  }
};

const handleSubmit = async () => {
  message.value = '';
  error.value = '';

  if (
    !form.value.name.trim() ||
    !form.value.price ||
    !form.value.description.trim() ||
    !form.value.amount ||
    !form.value.id_category ||
    !form.value.image
  ) {
    error.value = 'Por favor, complete todos los campos y seleccione una imagen antes de continuar.';
    return;
  }

  if (form.value.price <= 0) {
    error.value = 'El precio debe ser un valor positivo.';
    return;
  }
  if (form.value.amount <= 0) {
    error.value = 'La cantidad debe ser al menos 1.';
    return;
  }

  try {
    await createProduct(form.value);
    message.value = 'Producto creado con éxito.';

    setTimeout(() => {
      router.push("/Products");
    }, 1500);

  } catch (err) {
    console.error('Error al crear producto:', err);
    error.value = 'Error al crear producto. Intente de nuevo.';
    if (err.response && err.response.data && err.response.data.message) {
      error.value += ` (${err.response.data.message})`;
    }
  }
};
</script>

<style scoped>
@import '@/assets/css/crearProducto.css';
</style>
