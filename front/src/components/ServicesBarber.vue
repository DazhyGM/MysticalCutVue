<template>
  <div class="container">
    <HeaderComponent />

    <div>
      <router-link to="/services/create" class="btn btn-agregar">
        <img src="/assets/img/logos/person-plus-fill.svg" style="width: 20px; height: 20px; margin-right: 5px;">Agregar
      </router-link>
    </div>

    <!-- Servicios -->
    <div class="row justify-content-center">
      <div class="col-md-8">
        <section id="cortes" class="section">
          <div class="d-flex flex-column align-items-center">
            <div class="service-section w-75 mb-5" v-for="service in services" :key="service.id_services">
              <h3 class="text-center text-uppercase category-title">{{ getCustomTitle(service.id_services) }}</h3>

              <div class="card">
                <div class="card-body d-flex">
                  <!--Imagen del servicio -->
                  <div class="service-image">
                    <img :src="getServiceImage(service.image)" :alt="service.name_service" class="img-fluid"
                      style="max-width: 150px; margin-right: 15px;">
                  </div>
                  <!--Detalle del servicio -->
                  <div class="service-details">
                    <h5 class="card-title">{{ service.name_service }}</h5>
                    <p class="card-description">{{ service.description }}</p>

                    <div class="card-actions mt-2">
                      <router-link :to="`/services/view/${service.id_services}`"
                        class="btn btn-icon btn-view">Ver</router-link>
                      <button class="btn btn-icon btn-select" @click="selectService(service)">Seleccionar</button>
                      <router-link :to="`/services/edit/${service.id_services}`"
                        class="btn btn-icon btn-edit">Editar</router-link>
                      <button class="btn btn-icon btn-delete"
                        @click="confirmDelete(service.id_services)">Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Botón Regresar -->
    <div class="btn-regresar mt-3">
      <button class="back-button btn btn-secondary" @click="goBack">Regresar</button>
    </div>

    <!-- Footer -->
    <footer class="py-3 my-4">
      <ul class="nav justify-content-center border-bottom pb-3 mb-3"></ul>
      <p class="text-center text-white"></p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAllServices, deleteService } from '@/services/servicesApi';
import HeaderComponent from '@/components/HeaderComponent.vue';
import '@/assets/css/style.css';
import '@/assets/css/services.css';
import { useRouter } from 'vue-router';

const router = useRouter();
const services = ref([]);

const customTitles = {
  1: "Cortes de Cabello",
  2: "Afeitado y Barba",
  3: "Coloración y Tintes",
  4: "Tratamientos Capilares",
  5: "Servicios para Niños"
};

const fetchServices = async () => {
  try {
    services.value = await getAllServices();
  } catch (error) {
    console.error("Error al cargar servicios:", error);
    alert("Hubo un problema al obtener los servicios.");
  }
};

const getCustomTitle = (id) => customTitles[id] || "Sin título";

const getServiceImage = (image) => {
  return image ? `/background/${image}` : '/img/background/combo01.png';
};

const confirmDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este servicio?')) {
    try {
      await deleteService(id);
      fetchServices();
    } catch (err) {
      alert('Error al eliminar el servicio');
    }
  }
};

const goBack = () => router.push('/Home');

onMounted(() => {
  fetchServices();
});
</script>