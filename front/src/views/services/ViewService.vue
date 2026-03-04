<template>
  <div class="row mb-2">
    <ul class="nav col-12 justify-content-center mx-auto">
      <h1>Detalles del Servicio</h1>
    </ul>
  </div>

  <div class="container-service mt-5 text-white">
    <div class="card p-4 bg-dark text-white">
      <h2 class="text-center mb-4">{{ service.name_service }}</h2>

      <div class="d-flex flex-column align-items-center">
        <div class="image-container mb-4 text-center">
          <img :src="getImage(service.image)" :alt="service.name_service" class="img-fluid rounded"
            style="max-width: 300px;" />
        </div>

        <div class="details text-center">
          <p><strong>Descripción:</strong> {{ service.description }}</p>
          <p><strong>Tiempo estimado:</strong> {{ service.estimated_time }}</p>
          <p><strong>Precio:</strong> ${{ service.price }}</p>
        </div>
      </div>

      <!-- Botón volver -->
      <div class="text-center mt-4">
        <router-link to="/Services" class="btn btn-volver">Volver a Servicios</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getServiceById } from '@/services/servicesApi';

const route = useRoute();
const router = useRouter();
const service = ref({});

// Obtener datos del servicio
const fetchService = async () => {
  try {
    const id = route.params.id;
    if (!id) throw new Error("ID no proporcionado");
    service.value = await getServiceById(id);
  } catch (error) {
    console.error("Error al obtener el servicio:", error);
    alert("No se pudo cargar el servicio.");
    router.push('/Services');
  }
};

const getImage = (image) => {
  return image ? `/img/background/${image}` : '/img/background/combo01.png';
};

onMounted(fetchService);
</script>

<style scoped>
 @import '@/assets/css/services/viewService.css';
</style>
