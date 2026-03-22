<template>
  <div>
    <div class="row mb-2">
      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Editar producto</h1>
      </ul>
    </div>

    <div class="row edit-product-container">
      <div class="col-md-5 text-center">
        <div class="mb-3">
          <label class="form-label">Imagen actual:</label>
          <div class="image-placeholder mx-auto mb-3">
            <img v-if="product.image" :src="getImageUrl(product.image)" alt="Producto Actual" class="preview-image" />
            <img v-else src="/img/background/signointerrogacion.jpg" alt="Sin imagen" class="preview-image" />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Previsualización de nueva imagen:</label>
          <div class="image-placeholder mx-auto mb-3">
            <img :src="newImagePreview || '/img/background/signointerrogacion.jpg'" alt="Nueva imagen"
              class="preview-image" />
          </div>
          <label class="form-label">Nueva imagen (opcional):</label>
          <input type="file" @change="onImageSelected" class="form-select custom-input" />
        </div>

        <div class="mb-3">
          <label class="block mb-1 form-label">Precio</label>
          <input v-model.number="product.price" type="number" min="1000" step="500" required
            class="form-select custom-input" placeholder="Precio" />
        </div>

      </div>

      <div class="col-md-5 offset-md-1">
        <form @submit.prevent="update" class="edit-form">
          <div class="mb-3">
            <label class="block mb-1 form-label">Cantidad</label>
            <input v-model.number="product.amount" type="number" min="1" required class="form-select custom-input"
              placeholder="Cantidad" />
          </div>
          <div class="mb-3">
            <label class="block mb-1 form-label">Nombre</label>
            <input v-model="product.name" type="text" required class="form-select custom-input"
              placeholder="Nombre del producto" />
          </div>

          <div class="mb-3">
            <label class="block mb-1 form-label">Descripción</label>
            <textarea v-model="product.description" required rows="3" class="form-select custom-input"
              placeholder="Descripción del producto"></textarea>
          </div>

          <div class="mb-3">
            <label class="block mb-1 form-label">Categoría</label>
            <select v-model.number="product.id_category" required class="form-select custom-input">
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
          <div class="contenedor-botones">
            <button type="submit" class="btn btn-guardar flex-grow-1 me-2">
              Guardar cambios
            </button>
            <button type="button" @click="goBack" class="btn btn-cancelar flex-grow-1">
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
import { getProductById, updateProduct } from "@/services/productsApi";

const route = useRoute();
const router = useRouter();

const product = ref({
  name: "",
  price: 1000,
  description: "",
  amount: 1,
  id_category: null,
  id_status: 1,
  image: "",
});
const newImage = ref(null);
const newImagePreview = ref(null);

const message = ref('');
const error = ref('');

const categories = ref([
  { id: 1, name: "Cabello" },
  { id: 2, name: "Belleza" },
  { id: 3, name: "Tintes y Coloración" },
  { id: 4, name: "Tratamientos Capilares" },
  { id: 5, name: "Productos de Estilo" },
]);

const getImageUrl = (imageName) => {
  return `http://localhost:5000/uploads/products/${imageName}`;
};

const loadProduct = async () => {
  try {
    const id = route.params.id;
    const data = await getProductById(id);

    if (data) {
      product.value = {
        ...data,
        price: data.price != null ? Number(data.price) : 1000,
        amount: data.amount != null ? Number(data.amount) : 1,
        id_category: data.id_category != null ? Number(data.id_category) : null,
        id_status: data.id_status != null ? Number(data.id_status) : 1,
      };
      newImage.value = null;
      newImagePreview.value = null;
    } else {
      error.value = 'Producto no encontrado.';
    }
  } catch (err) {
    console.error("Error al cargar el producto:", err);
    error.value = 'Error al cargar el producto. Intente de nuevo.';
  }
};

const onImageSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    newImage.value = file;
    newImagePreview.value = URL.createObjectURL(file);
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

    setTimeout(() => {
      router.push("/Products");
    }, 1500);

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
 @import "@/assets/css/products/editProduct.css";
</style>