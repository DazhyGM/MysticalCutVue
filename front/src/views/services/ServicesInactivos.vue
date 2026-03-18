<template>
  <div class="row mb-2">
    <ul class="nav col-12 justify-content-center mx-auto">
      <h1>Servicios Inactivos</h1>
    </ul>
  </div>
  <div class="container-si">
    <div class="content">
      <div class="servi-container">
        <div v-for="service in inactiveServices" :key="service.id_services" class="servi-box">
          <div class="service-info">
            <div class="info-row">
              <h5 class="info-title">Servicio</h5>
              <p class="info-text">{{ service.name_service }}</p>
            </div>
            <div class="info-row">
              <h5 class="info-title">Descripción</h5>
              <p class="info-text">{{ service.description }}</p>
            </div>
            <div class="info-row">
              <h5 class="info-title">Precio</h5>
              <p class="info-text">${{ parseFloat(service.price).toFixed(2) }}</p>
            </div>
          </div>
          <button class="activate-btn" @click="activateServiceHandler(service)">Activar</button>
        </div>

      </div>
      <button class="btn back-buttonS" @click="goBack">Regresar</button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getInactiveServices, activateService } from '@/services/servicesApi';
import '@/assets/css/services/servicesInactives.css';

const router = useRouter();
const inactiveServices = ref([]);

const loadInactiveServices = async () => {
  try {
    inactiveServices.value = await getInactiveServices();
  } catch (error) {
    console.error("Error al obtener servicios inactivos:", error);
  }
};

const activateServiceHandler = async (service) => {
  try {
    await activateService(service.id_services);
    inactiveServices.value = inactiveServices.value.filter(s => s.id_services !== service.id_services);
  } catch (error) {
    console.error("Error al activar el servicio:", error);
  }
};

const goBack = () => {
  router.push('/Services');
};

onMounted(loadInactiveServices);
</script>

<style scoped>
@import '@/assets/css/services/servicesInactives.css';
</style>
