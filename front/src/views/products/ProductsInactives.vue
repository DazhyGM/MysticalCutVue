<template>
  <div class="container">
    <div class="row mb-2">
      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Productos Inactivos</h1>
      </ul>
    </div>
    <div class="content">
      <div class="product-grid">
        <div v-for="product in inactiveProducts" :key="product.id" class="pedido-box">
          <div class="service-info">
            <div class="info-row" v-if="product.image">
              <img :src="getImageUrl(product.image)" alt="Imagen del producto" class="product-img" />
            </div>
            <div class="info-row">
              <h5 class="info-title">Producto</h5>
              <p class="info-text">{{ product.name }}</p>
            </div>
            <div class="info-row">
              <h5 class="info-title">Descripción</h5>
              <p class="info-text">{{ product.description }}</p>
            </div>
            <div class="info-row">
              <h5 class="info-title">Precio</h5>
              <p class="info-text">${{ parseFloat(product.price).toFixed(2) }}</p>
            </div>
            <button class="activate-btn" @click="activateProductHandler(product)">Activar</button>
          </div>
        </div>
      </div>
      <div class="text-center mt-4">
        <button class="btn back-button" @click="goBack">Regresar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getInactiveProducts, updateProductStatus } from '@/services/productsApi';

const router = useRouter();
const inactiveProducts = ref([]);

const loadInactiveProducts = async () => {
  try {
    inactiveProducts.value = await getInactiveProducts();
  } catch (error) {
    console.error("Error al obtener productos inactivos:", error);
  }
};

const activateProductHandler = async (product) => {
  const confirmActivation = confirm(`¿Estás seguro de que deseas activar el producto "${product.name}"?`);
  if (!confirmActivation) return;

  try {
    await updateProductStatus(product.id_product, 1);
    inactiveProducts.value = inactiveProducts.value.filter(p => p.id_product !== product.id_product);
  } catch (error) {
    console.error("Error al activar el producto:", error);
  }
};

const getImageUrl = (imageName) => {
  return `http://localhost:5000/uploads/${imageName}`;
};

const goBack = () => {
  router.push('/Products');
};

onMounted(loadInactiveProducts);
</script>

<style scoped>
@import "@/assets/css/products/productsInactives.css";
</style>
