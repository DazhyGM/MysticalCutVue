<template>
  <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <router-link to="/Home">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
        </router-link>
      </div>

      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Crear Producto</h1>
      </ul>
    </header>

    <div class="row edit-container">
      <div class="col-md-5 text-center">
        <div class="image-placeholder mx-auto mb-3">
          <img :src="imagePreview || '/img/background/signointerrogacion.jpg'" alt="Preview" class="preview-image" />
        </div>
        <div class="mb-3">
          <label class="form-label">Imagen</label>
          <input type="file" @change="handleFileChange" accept="image/*" class="form-control custom-input" />
        </div>
        <div class="mb-3">
          <label class="block mb-1 form-label">Precio</label>
          <input
            v-model.number="form.price"
            type="number"
            min="1000"
            step="500"
            required
            class="form-control custom-input"
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
            class="form-control custom-input"
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
              class="form-control custom-input"
              placeholder="Nombre del producto"
            />
          </div>

          <div class="mb-3">
            <label class="block mb-1 form-label">Descripción</label>
            <textarea
              v-model="form.description"
              required
              rows="3"
              class="form-control custom-input"
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

    <div class="text-center mt-3">
      <router-link to="/Products" class="btn btn-secondary btn-regresar">
        Regresar
      </router-link>
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

const router = useRouter(); // Inicializar el router para la redirección

const form = ref({
  name: '',
  price: 1000,
  description: '',
  amount: 1,
  id_category: '',
  image: null, // Este campo recibirá el objeto File
  id_status: 1, // Se añade el estado por defecto
});

const categories = ref([
  { id: 1, name: 'Cabello' },
  { id: 2, name: 'Belleza' },
  { id: 3, name: 'Tintes y Coloración' },
  { id: 4, name: 'Tratamientos Capilares' },
  { id: 5, name: 'Productos de Estilo' },
]);

const imagePreview = ref(null); // Para la URL de la vista previa de la imagen
const message = ref(''); // Para mensajes de éxito
const error = ref(''); // Para mensajes de error

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

    // **MODIFICACIÓN AQUÍ:** Redirigir a la vista anterior después de un breve retraso
    setTimeout(() => {
      router.push("/Products"); // Redirige a la ruta de tus productos
    }, 1500); // Espera 1.5 segundos para que el usuario vea el mensaje

    // Las siguientes líneas se pueden quitar si siempre rediriges
    // form.value = {
    //   name: '',
    //   price: 1000,
    //   description: '',
    //   amount: 1,
    //   id_category: '',
    //   image: null,
    //   id_status: 1,
    // };
    // imagePreview.value = null;

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
/* Colores de tu estilo base */
.container {
  background-color: #000; /* Fondo oscuro similar */
  color: #fff; /* Texto blanco */
  min-height: 100vh;
  padding: 1rem;
  font-size: 13px; /* Consistencia en tamaño de fuente */
}

/* Estilos para el Header */
header {
  border-bottom: 1px solid #333; /* Borde inferior sutil */
}

header h1 {
  color: #ccaf54; /* Título dorado */
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}

/* Contenedor principal del formulario */
.edit-container {
  padding: 20px;
  background-color: #1c1c1c; /* Fondo de la tarjeta central, un poco más claro que el body */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
  max-width: 900px; /* Un ancho máximo para centrarlo */
  align-items: flex-start; /* Alinea los elementos al inicio (arriba) */
}

/* Estilos de imagen */
.image-placeholder {
  width: 100%;
  max-height: 170px;
  border: 2px solid #ccaf54;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  display: flex; /* Para centrar la imagen */
  justify-content: center;
  align-items: center;
  background-color: #222; /* Fondo para el placeholder vacío */
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Para que la imagen cubra el espacio */
}

/* Estilos de inputs y labels */
.form-label {
  color: #ccaf54;
  font-size: 13px;
  margin-bottom: 0.2rem; /* Espacio más compacto */
}

.custom-input {
  background-color: #333;
  color: #fff;
  border: 1px solid #ccaf54;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 5px; /* Bordes ligeramente redondeados */
}

.custom-input::placeholder {
  color: #ccc;
}

/* Estilo para el textarea */
textarea.custom-input {
  resize: vertical; /* Permitir redimensionar solo verticalmente */
  min-height: 80px; /* Altura mínima para la descripción */
}

/* Botón de "Agregar" (Registrar) */
.btn-add {
  background-color: #ccaf54;
  color: black;
  border: none;
  padding: 8px 0;
  font-size: 13px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  border-radius: 5px; /* Bordes redondeados */
}

.btn-add:hover {
  background-color: #b3953f;
}

/* Botón de "Regresar" */
.btn-regresar {
  margin-top: 12px;
  background-color: #6c757d;
  color: white;
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 5px; /* Bordes redondeados */
  border: none; /* Eliminar borde de Bootstrap si lo tuviera */
  transition: background-color 0.3s ease;
}

.btn-regresar:hover {
  background-color: #5a6268;
}

/* Mensajes de éxito/error */
.text-success {
  color: #4CAF50; /* Verde más estándar */
}

.text-danger {
  color: #d9534f; /* Rojo más estándar */
}

/* Pequeño ajuste para centrar el formulario dentro de su columna si es necesario */
.edit-form {
  margin-top: 0; /* Asegurarse de que no haya margen superior indeseado */
}
</style>