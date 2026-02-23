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
          <input
            v-model.number="form.price"
            type="number"
            min="1000"
            step="500"
            required
            class="form-select custom-input"
            placeholder="Precio"
          />
        </div>
        <div class="mb-3">
          <label class="block mb-1 form-label">Cantidad</label>
          <input
            v-model.number="form.amount"
            type="number"
            min="1"
            required
            class="form-select custom-input"
            placeholder="Cantidad"
          />
        </div>
      </div>

      <div class="col-md-5 offset-md-1">
        <form @submit.prevent="handleSubmit" class="edit-form">
          <div class="mb-3">
            <label class="block mb-1 form-label">Nombre</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="form-select custom-input"
              placeholder="Nombre del producto"
            />
          </div>

          <div class="mb-3">
            <label class="block mb-1 form-label">Descripción</label>
            <textarea
              v-model="form.description"
              required
              rows="3"
              class="form-select custom-input"
              placeholder="Descripción del producto"
            ></textarea>
          </div>

          <div class="mb-3">
            <label class="block mb-1 form-label">Categoría</label>
            <select
              v-model="form.id_category"
              required
              class="form-select custom-input"
            >
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

          <button
            type="submit"
            class="btn w-100 btn-add"
          >
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
import { useRouter } from 'vue-router'; // Importar useRouter para la redirección
import { createProduct } from '@/services/productsApi';

const goBack = () => router.push("/Products"); // Función para redirigir a la página de productos

const router = useRouter(); // Inicializar el router para la redirección

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

  // Validación de campos
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

<!-- <style scoped>
.container {
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  padding: 1rem;
  font-size: 13px; 
}

header {
  border-bottom: 1px solid #333;
}

header h1 {
  color: #ccaf54;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}

.edit-container {
  padding: 20px;
  background-color: #1c1c1c;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
  align-items: flex-start;
  justify-content: center;
}

.image-placeholder {
  width: 100%;
  max-height: 170px;
  border: 2px solid #ccaf54;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #222;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-label {
  color: #ccaf54;
  font-size: 13px;
  margin-bottom: 0.2rem;
}

.custom-input {
  background-color: #333;
  color: #fff;
  border: 1px solid #ccaf54;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 5px;
}

.custom-input::placeholder {
  color: #ccc;
}

textarea.custom-input {
  resize: vertical;
  min-height: 80px;
}

.btn-add {
  background-color: #ccaf54;
  color: black;
  border: 1px solid #D4AF37;
  padding: 8px 0;
  font-size: 13px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.btn-add:hover {
  background-color: #000000;
  border: 1px solid #D4AF37;
  color: #CCAF54;
}

.text-success {
  color: #4CAF50;
}

.text-danger {
  color: #d9534f;
}

.edit-form {
  margin-top: 0;
}
</style> -->