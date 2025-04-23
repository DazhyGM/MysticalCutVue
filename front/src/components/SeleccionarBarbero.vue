<template>
  <div class="container">
    <!-- Encabezado -->
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <router-link to="/Home">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
        </router-link>
      </div>

      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Elegir Barbero</h1>
      </ul>
    </header>

    <!-- Contenido principal -->
    <div class="row">
      <!-- Columna de barberos -->
      <div class="col-md-8">
        <h2>Barbero</h2>
        <div class="row">
          <div class="col-md-4 mb-3" v-for="barber in barbers" :key="barber.id">
            <div class="barber-card" :class="{ selected: selectedBarber && selectedBarber.id === barber.id }" @click="selectBarber(barber)">
              <img
                :src="getImageUrl(barber.image)"
                :alt="barber.full_name"
                class="barber-img"
                @error="onImageError($event)"
              />
              <h4>{{ barber.full_name }}</h4>
              <button class="select-barber" title="Seleccionar barbero">+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna lateral de resumen -->
      <div class="col-md-4">
        <div class="custom-card" id="service-details">
          <h3>Servicio Seleccionado</h3>
          <h5 v-if="selectedBarber" class="barber-name">{{ selectedBarber.full_name }}</h5>

          <h5 v-else class="text-muted custom-text-white">Selecciona un barbero</h5>

          <div v-if="selectedServices.length">
            <p><strong>Servicios:</strong></p>
            <ul>
              <li v-for="(servicio, index) in selectedServices" :key="index">
                {{ servicio.name_service }} - ${{ servicio.price }}
              </li>
            </ul>
          </div>
          <button class="btn btn-danger mt-2" @click="clearSelection">Eliminar selección</button>
          <button class="btn btn-success mt-2" @click="goToCalendar">Continuar</button>
          <br />
          <button class="btn btn-primary mt-3" @click="goBack">Regresar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBarbers } from '@/services/api';

export default {
  name: 'SeleccionarBarbero',
  data() {
    return {
      barbers: [],
      selectedBarber: null,
      selectedServices: [],
      currentUser: null,
    };
  },
  methods: {
    async fetchBarbers() {
      try {
        this.barbers = await getBarbers();
      } catch (error) {
        console.error('Error al obtener barberos:', error);
      }
    },
    getImageUrl(imageName) {
      if (!imageName) return '/img/background/BarberoPredeterminado.png';
      return `http://localhost:5000/uploads/${imageName}`;
    },
    onImageError(event) {
      event.target.src = '/img/background/BarberoPredeterminado.png';
    },
    selectBarber(barber) {
      this.selectedBarber = barber;
    },
    clearSelection() {
      this.selectedBarber = null;
    },
    goToCalendar() {
      if (!this.selectedBarber || !this.selectedServices.length || !this.currentUser?.id) {
        alert("Falta información para continuar.");
        return;
      }

      this.$router.push({
        path: '/Calendario',
        query: {
          barber_id: this.selectedBarber.user_id,
          barber_name: this.selectedBarber.full_name,
          servicios: JSON.stringify(this.selectedServices),
          user_id: this.currentUser.id,
          user_name: this.currentUser.name,
        },
      });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    const { user_id, user_name, servicios } = this.$route.query;

    if (user_id && user_name) {
      this.currentUser = {
        id: parseInt(user_id),
        name: user_name,
      };
    } else {
      alert("No se recibió la información del usuario correctamente.");
    }

    if (servicios) {
      try {
        this.selectedServices = JSON.parse(servicios);
      } catch (error) {
        console.error("Error al parsear los servicios:", error);
      }
    }

    this.fetchBarbers();
  },
};
</script>

<style scoped>
@font-face {
  font-family: 'Amasis_MT_Std_Black';
  src: url('@/assets/fonts/Amasis_MT_Std_Black/Amasis_MT_Std_Black.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

body {
  background-color: black;
  color: white;
  font-family: Amasis_MT_Std_Black;
}

.custom-text-white {
  color: white !important;
}

.barber-name {
  color: #CCAF54;
}

.custom-card {
  background-color: #111;
  border: 5px solid #333;
  color: #fff;
  padding: 50px;
  border-radius: 5px;
  margin-top: 20px;
}

.barber-card {
  background-color: #111;
  border: 2px solid #CCAF54;
  color: #fff;
  padding: 15px;
  border-radius: 5px;
  margin: 10px 0;
  transition: 0.3s ease-in-out;
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 🔸 centrado horizontal del contenido */
  justify-content: space-between;
  text-align: center;
}

.barber-card:hover {
  transform: scale(1.02);
  border-color: #CCAF54;
}

.barber-card img.barber-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto;
}

.barber-card h4 {
  margin-top: 10px;
  color: #CCAF54;
}

.barber-card .select-barber {
  margin-top: 10px;
  background-color: #CCAF54;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  color: black;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.barber-card .select-barber:hover {
  background-color: #D4AF37;
}

.selected {
  border: 3px solid #D4AF37;
  background-color: #1a1a1a;
}

.btn {
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 5px;
}

.btn-danger {
  background-color: #8B0000;
  border: none;
}

.btn-danger:hover {
  background-color: #a10000;
}

.btn-success {
  background-color: #CCAF54;
  color: black;
  border: none;
}

.btn-success:hover {
  background-color: #D4AF37;
  color: black;
}

.btn-primary {
  background-color: #333;
  border: none;
}

.btn-primary:hover {
  background-color: #444;
}
</style>
