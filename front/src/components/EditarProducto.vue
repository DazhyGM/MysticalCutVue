<template>
  <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <router-link to="/Home">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
        </router-link>
      </div>

      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Editar Producto</h1>
      </ul>
    </header>

    <div class="row edit-container">
      <div class="col-md-5 text-center">
        <div class="mb-3">
          <label class="form-label">Imagen actual:</label>
          <div class="image-placeholder mx-auto mb-3">
            <img
              v-if="product.image"
              :src="getImageUrl(product.image)"
              alt="Producto Actual"
              class="preview-image"
            />
            <img
              v-else
              src="/img/background/signointerrogacion.jpg"
              alt="Sin imagen"
              class="preview-image"
            />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Previsualización de nueva imagen:</label>
          <div class="image-placeholder mx-auto mb-3">
            <img
              :src="newImagePreview || '/img/background/signointerrogacion.jpg'"
              alt="Nueva imagen"
              class="preview-image"
            />
          </div>
          <label class="form-label">Nueva imagen (opcional):</label>
          <input type="file" @change="onImageSelected" class="form-control custom-input" />
        </div>

        <div class="mb-3">
          <label class="block mb-1 form-label">Precio</label>
          <input
            v-model.number="product.price"
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
            v-model.number="product.amount"
            type="number"
            min="1"
            required
            class="form-control custom-input"
            placeholder="Cantidad"
          />
        </div>
      </div>

      <div class="col-md-5 offset-md-1">
        <form @submit.prevent="update" class="edit-form">
          <div class="mb-3">
            <label class="block mb-1 form-label">Nombre</label>
            <input
              v-model="product.name"
              type="text"
              required
              class="form-control custom-input"
              placeholder="Nombre del producto"
            />
          </div>

          <div class="mb-3">
            <label class="block mb-1 form-label">Descripción</label>
            <textarea
              v-model="product.description"
              required
              rows="3"
              class="form-control custom-input"
              placeholder="Descripción del producto"
            ></textarea>
          </div>

          <div class="mb-3">
            <label class="block mb-1 form-label">Categoría</label>
            <select
              v-model.number="product.id_category"
              required
              class="form-select custom-input"
            >
              <option disabled value="">Seleccione una categoría</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Estado</label>
            <select v-model.number="product.id_status" class="form-select custom-input">
              <option :value="1">Activo</option>
              <option :value="2">Agotado</option>
              <option :value="3">Inactivo</option>
            </select>
          </div>

          <div class="d-flex justify-content-between mt-4">
            <button type="submit" class="btn btn-add flex-grow-1 me-2">
              Guardar cambios
            </button>
            <button type="button" @click="goBack" class="btn btn-secondary btn-regresar flex-grow-1">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="text-center mt-3">
      <p v-if="message" class="text-success">{{ message }}</p>
      <p v-if="error" class="text-danger">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProductById, updateProduct } from "../services/productsApi"; // Asegúrate de que la ruta sea correcta

const route = useRoute();
const router = useRouter();

const product = ref({
  name: "",
  price: 1000,
  description: "",
  amount: 1,
  id_category: null,
  id_status: 1,
  image: "", // Nombre de la imagen actual
});
const newImage = ref(null); // Archivo de la nueva imagen seleccionada
const newImagePreview = ref(null); // URL para la vista previa de la nueva imagen

const message = ref(''); // Para mensajes de éxito
const error = ref(''); // Para mensajes de error

const categories = ref([
  { id: 1, name: "Cabello" },
  { id: 2, name: "Belleza" },
  { id: 3, name: "Tintes y Coloración" },
  { id: 4, name: "Tratamientos Capilares" },
  { id: 5, name: "Productos de Estilo" },
]);

const getImageUrl = (imageName) => {
  // Asegúrate de que esta URL base sea correcta para tu servidor de imágenes
  return `http://localhost:5000/uploads/products/${imageName}`;
};

const loadProduct = async () => {
  try {
    const id = route.params.id;
    const data = await getProductById(id);

    if (data) {
      product.value = {
        ...data,
        // Asegurarse de que los valores numéricos sean correctos, manejar nulos si es necesario
        price: data.price != null ? Number(data.price) : 1000,
        amount: data.amount != null ? Number(data.amount) : 1,
        id_category: data.id_category != null ? Number(data.id_category) : null,
        id_status: data.id_status != null ? Number(data.id_status) : 1,
      };
      // Limpiar la previsualización de la nueva imagen cada vez que se carga un producto
      newImage.value = null;
      newImagePreview.value = null;
    } else {
        error.value = 'Producto no encontrado.';
        // Opcional: Redirigir si el producto no se encuentra
        // router.push('/Products');
    }
  } catch (err) {
    console.error("Error al cargar el producto:", err);
    error.value = 'Error al cargar el producto. Intente de nuevo.';
  }
};

const onImageSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    newImage.value = file; // Almacena el archivo para el envío
    newImagePreview.value = URL.createObjectURL(file); // Genera URL para la vista previa
  } else {
    newImage.value = null;
    newImagePreview.value = null;
  }
};

const update = async () => {
  message.value = '';
  error.value = '';

  // Validación básica
  if (
    !product.value.name.trim() ||
    !product.value.price ||
    !product.value.description.trim() ||
    !product.value.amount ||
    !product.value.id_category
  ) {
    error.value = 'Por favor, complete todos los campos requeridos.';
    return;
  }

  // Validación específica para cantidad y precio
  if (product.value.price <= 0) {
    error.value = 'El precio debe ser un valor positivo.';
    return;
  }
  if (product.value.amount <= 0) {
    error.value = 'La cantidad debe ser al menos 1.';
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", product.value.name);
    formData.append("price", product.value.price);
    formData.append("description", product.value.description);
    formData.append("amount", product.value.amount);
    formData.append("id_category", product.value.id_category);
    formData.append("id_status", product.value.id_status);

    if (newImage.value) {
      formData.append("image", newImage.value);
    }

    await updateProduct(route.params.id, formData);
    message.value = "Producto actualizado correctamente.";
    
    // **Modificación aquí:** Redirigir a la vista anterior después de un breve retraso
    // Esto permite al usuario ver el mensaje de éxito antes de la redirección.
    setTimeout(() => {
      router.push("/Products"); // Asume que '/Products' es la vista anterior
    }, 1500); // Redirige después de 1.5 segundos

    // Recargar el producto para reflejar los cambios (especialmente si la imagen ha cambiado)
    // Esto ya no es estrictamente necesario si rediriges inmediatamente.
    // Si quitaras la redirección de arriba, entonces sí sería importante.
    // await loadProduct(); 
    // newImage.value = null; // Limpiar la nueva imagen seleccionada
    // newImagePreview.value = null; // Limpiar la vista previa de la nueva imagen

  } catch (err) {
    console.error("Error al actualizar producto:", err);
    error.value = "Error al actualizar el producto. Intente de nuevo.";
    if (err.response && err.response.data && err.response.data.message) {
      error.value += ` (${err.response.data.message})`;
    }
  }
};

const goBack = () => {
  router.push("/Products");
};

onMounted(loadProduct);
</script>

<style scoped>
/* Estilos generales del contenedor y tipografía */
.container {
  background-color: #000; /* Fondo oscuro */
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
  max-width: 900px; /* Ancho máximo para centrarlo */
  align-items: flex-start; /* Alinea los elementos al inicio (arriba) */
}

/* Estilos de imagen */
.image-placeholder {
  width: 100%;
  max-height: 170px; /* Altura máxima para la vista previa */
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

/* Botón de "Guardar cambios" (similar a btn-add) */
.btn-add {
  background-color: #ccaf54;
  color: black;
  border: none;
  padding: 8px 0; /* padding vertical y horizontal 0 para que flex-grow lo controle */
  font-size: 13px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.btn-add:hover {
  background-color: #b3953f;
}

/* Botón de "Cancelar" (similar a btn-regresar) */
.btn-regresar {
  background-color: #6c757d;
  color: white;
  padding: 8px 0; /* padding vertical y horizontal 0 para que flex-grow lo controle */
  font-size: 13px;
  border-radius: 5px;
  border: none;
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
</style>