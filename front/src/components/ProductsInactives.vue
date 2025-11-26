<template>
  <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <router-link to="/Home">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
        </router-link>
      </div>
      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Productos Inactivos</h1>
      </ul>
    </header>

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

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getInactiveProducts, updateProductStatus } from '@/services/productsApi';
import FooterComponent from '@/components/FooterComponent.vue';
import '@/assets/css/style.css';
import '@/assets/css/usersInfo.css';

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
    await updateProductStatus(product.id_product, 1); // 1 = estado ACTIVO
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
.activate-btn {
  position: absolute;
  bottom: 1rem; 
  left: 50%;
  transform: translateX(-50%);
  /* estilos del botón */
  background-color: #c2aa59;
  border: none;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 3px;
}
.activate-btn:hover {
  background-color: #8a7432;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 250px);
  justify-content: center;
  gap: 1rem;
  margin: 1rem auto;
  padding: 1rem;
  height: 800px;
  overflow-y: auto;
  border-radius: 6px;
  background-color: #00000095;
}

.pedido-box {
  position: relative;
  background-color: #3a3a3a;
  border: 1px solid #ccaf54;
  border-radius: 6px;
  padding: 1rem;
  height: 530px;
  box-sizing: border-box;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.product-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.info-row {
  margin-bottom: 1rem;
  width: 100%;
}

.info-title {
  font-weight: 700;
  color: #ccaf54;
  min-height: 1.4rem; 
  margin-bottom: 0.3rem;
  text-align: center;
}


.info-text {
  font-weight: normal;
  color: #fff;
  word-wrap: break-word;
  font-size: 0.9rem;
  min-height: 1.4rem; 
}

.activate-btn {
  margin-top: auto; 
  background-color: #ccaf54;
  border: none;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 3px;
  width: 100px;
  align-self: center;
}


.service-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.back-button {
  background-color: #444;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}
.back-button:hover {
  background-color: #666;
}
.product-img {
  width: 100%;
  height: 160px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}
</style>
