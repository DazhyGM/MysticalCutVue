<template>
  <div class="container-scaled">
  <div class="container">
    <!-- HEADER -->
    <header class="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <router-link to="/Home">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
        </router-link>
      </div>
      <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li v-for="module in roleModules" :key="module.module_route" class="nav-item">
          <a class="nav-link" :href="`/${module.module_route}`">{{ module.role_module }}</a>
        </li>
      </ul>
      <div class="col-md-3 text-end">
        <div class="dropdown">
          <button class="btn dropdown-toggle" @click="toggleMenu">
            <img src="/img/background/Icono usuario.png" alt="Profile" class="icon me-2" />
            {{ user?.full_name || 'Usuario' }}
          </button>
          <ul v-if="isMenuOpen" class="dropdown-menu dropdown-menu-end show">
            <li><button class="dropdown-item" @click="goToProfile">Perfil</button></li>
            <li><hr class="dropdown-divider" /></li>
            <li><button class="dropdown-item" @click="logout">Cerrar Sesión</button></li>
          </ul>
        </div>
      </div>
    </header>

    <!-- NAV DE CATEGORÍAS -->
    <div class="category-nav">
      <ul class="nav justify-content-center">
        <li v-for="(services, category) in servicesByCategory" :key="category" class="nav-item">
          <a :href="'#' + getCategoryId(category)" class="nav-link">{{ category }}</a>
        </li>
      </ul>
    </div>

    <!-- BOTONES SUPERIORES (solo admin) -->
    <div class="d-flex justify-content-between align-items-center my-3" v-if="userRole === 'Admin'">
      <router-link to="/Create-Services" class="btn btn-agregar">
        <img src="https://cdn-icons-png.flaticon.com/512/992/992651.png" style="width: 20px; height: 20px; margin-right: 5px;" />
        Agregar
      </router-link>
      <router-link to="/Services-Inactivos" class="btn btn-secondary">Servicios Inactivos</router-link>
    </div>

    <!-- SERVICIOS -->
    <div class="d-flex flex-wrap justify-content-center gap-4 align-items-start">
      <div class="col-lg-8">
        <div v-for="(services, category) in servicesByCategory" :key="category" class="service-category">
          <h3 :id="getCategoryId(category)" class="text-center text-uppercase category-title">{{ category }}</h3>
          <div class="d-flex flex-column align-items-center">
            <div class="service-section w-100 mb-5" v-for="service in services" :key="service.id_services">
              <div class="card">
                <div class="card-body d-flex">
                  <div class="service-image">
                    <img :src="getServiceImage(service.image)" :alt="service.name_service" class="img-fluid" style="max-width: 150px; margin-right: 15px;" />

                  </div>
                  <div class="service-details">
                    <h5 class="card-title">{{ service.name_service }}</h5>
                    <p class="card-description">{{ service.description }}</p>
                    <div class="card-actions mt-2">
                      <router-link :to="`/View-Service/${service.id_services}`" class="btn btn-view me-2">Ver</router-link>
                      <button v-if="userRole === 'Client'" class="btn btn-select me-2" @click="selectService(service)">Seleccionar</button>
                      <router-link v-if="userRole === 'Admin'" :to="`/Editar-Services/${service.id_services}`" class="btn btn-edit me-2">Editar</router-link>
                      <button v-if="userRole === 'Admin'" class="btn btn-danger" @click="confirmDelete(service.id_services)">Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SERVICIOS SELECCIONADOS + RESUMEN DE USUARIO -->
      <div v-if="userRole === 'Client' && selectedServices.length" class="selected-service-box card text-white bg-dark p-4">
        <h4 class="mb-3">Servicios Seleccionados</h4>
        <ul class="list-unstyled">
          <li v-for="service in selectedServices" :key="service.id_services" class="mb-3">
            <strong>{{ service.name_service }}</strong><br />
            <span>Duración: {{ service.estimated_time }}</span><br />
          </li>
        </ul>
        <p class="mt-3"><strong>Total:</strong> ${{ totalPrice }}</p>

        <hr />
        

        <div class="d-flex justify-content-between mt-3">
          <button class="btn btn-danger" @click="clearAllSelected">Eliminar selección</button>
          <button class="btn btn-success" @click="goToSelectBarbero">Continuar</button>
        </div>
      </div>
    </div>

    <!-- BOTÓN REGRESAR -->
    <div class="btn-regresar mt-3 text-center">
      <button class="btn btn-secondary" @click="goBack">Regresar</button>
    </div>

    <footer class="py-3 my-4">
      <p class="text-center text-white">© 2024 www.mysticalcut.com, Inc</p>
    </footer>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllServices, deleteService } from '@/services/servicesApi';
import axios from 'axios';

const router = useRouter();
const services = ref([]);
const selectedServices = ref([]);
const isMenuOpen = ref(false);
const user = ref({ full_name: '', user_id: null, user_email: '' });
const roleModules = ref([]);
const userRole = ref('');

// Funciones menú y navegación
const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;
const closeMenu = (event) => { if (!event.target.closest('.dropdown')) isMenuOpen.value = false; };
const logout = () => { localStorage.removeItem('token'); router.push('/'); };
const goToProfile = () => router.push('/perfil');
const goBack = () => router.push('/Home');

// Obtener usuario y servicios
onMounted(() => {
  fetchServices();
  fetchUserData();
  document.addEventListener('click', closeMenu);
});
onUnmounted(() => document.removeEventListener('click', closeMenu));

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    user.value = {
      full_name: data.full_name || 'Usuario',
      user_id: data.user_id,
      user_email: data.user_email || '',
      modules: data.modules || []
    };
    roleModules.value = user.value.modules;
    userRole.value = data.role || '';
  } catch (err) {
    console.error("❌ Error al obtener el usuario:", err);
    alert("No se pudo obtener la información del usuario.");
  }
};

const fetchServices = async () => {
  try {
    services.value = await getAllServices();
  } catch (error) {
    console.error("Error al cargar servicios:", error);
    alert("Hubo un problema al obtener los servicios.");
  }
};

const servicesByCategory = computed(() => {
  const categorized = {};
  services.value.forEach(service => {
    const category = service.category_name || "Otros";
    if (!categorized[category]) categorized[category] = [];
    categorized[category].push(service);
  });
  return categorized;
});

const getCategoryId = (category) => category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

// ✅ Esta función ahora busca en el backend si existe imagen, si no, pone una por defecto
const getServiceImage = (image) =>
  image ? `http://localhost:5000/uploads/${image}` : '/img/background/combo01.png';

const selectService = (service) => {
  console.log("Servicio seleccionado:", service);
  selectedServices.value = [service];
};
const clearAllSelected = () => selectedServices.value = [];
const totalPrice = computed(() => selectedServices.value.reduce((sum, s) => sum + parseFloat(s.price || 0), 0).toFixed(2));

// Eliminar servicio
const confirmDelete = async (id) => {
  if (!id) return alert("ID de servicio inválido.");
  if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
  try {
    await deleteService(id);
    alert("✅ Servicio eliminado correctamente.");
    await fetchServices();
  } catch (error) {
    console.error("❌ Error al eliminar el servicio:", error);
    alert("❌ No se pudo eliminar el servicio.");
  }
};

// Guardar servicio + usuario en localStorage
const goToSelectBarbero = () => {
  if (!user.value.user_id) return alert("No se ha podido obtener el ID del usuario.");

  localStorage.setItem('selectedService', JSON.stringify(selectedServices.value));
  localStorage.setItem('userName', user.value.full_name);
  localStorage.setItem('userId', user.value.user_id);
  localStorage.setItem('userEmail', user.value.user_email);

  router.push('/Select-Barbero');
};
</script>


<style scoped>

.category-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #000000;
  padding: 10px 0;
  border-bottom: 1px solid #444;
}

.col-md-3.text-end .dropdown {
  z-index: 200;
}

.category-nav .nav-link {
  font-size: 1.1rem;
  font-weight: bold;
  color: #CCAF54;
  text-transform: uppercase;
}

.category-nav .nav-link:hover {
  color: #FFD700;
  text-decoration: underline;
}

.category-title {
  margin-top: 50px;
  padding-top: 20px;
  color: #CCAF54;
  font-size: 1.8rem;
}

.selected-service-box {
  position: sticky;
  top: 120px;
  max-width: 350px;
  min-width: 280px;
  border: 2px solid #444;
  border-radius: 12px;
  background-color: #111;
  box-shadow: 0 0 10px rgba(204, 175, 84, 0.3);
  align-self: flex-start;
  z-index: 999;
}

.btn-regresar button {
  font-size: 1rem;
  padding: 10px 20px;
}

.service-image img {
  border-radius: 10px;
}

.service-details .card-description {
  font-size: 0.9rem;
  color: #bbb;
}

.card-actions button {
  font-size: 0.9rem;
  padding: 5px 10px;
}

.btn-view,
.btn-select,
.btn-edit {
  background-color: #CCAF54;
  color: #000;
  border: none;
  font-weight: bold;
}

.btn-view:hover,
.btn-select:hover,
.btn-edit:hover {
  background-color: #FFD700;
  color: #fff;
}
</style>
