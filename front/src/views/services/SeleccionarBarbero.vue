<template>

  <div class="container-select-barber">
    <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
      </div>
      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Selecciona el barbero</h1>
      </ul>
    </header>
    <div class="row">
      <div class="col-md-8 col-12 order-2 order-md-1">
        <h2>Barbero</h2>
        <div class="row">
          <div class="col-6 col-sm-4 col-md-4 mb-3" v-for="barber in barbers" :key="barber.id">
            <div class="barber-card" :class="{ selected: selectedBarber && selectedBarber.id === barber.id }"
              @click="selectBarber(barber)">
              <img :src="getImageUrl(barber.image)" :alt="barber.full_name" class="barber-img"
                @error="onImageError($event)" />
              <h4>{{ barber.full_name }}</h4>
              <button class="select-barber" title="Seleccionar barbero">+</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 col-12 order-1 order-md-2 mb-4 mb-md-0">
        <div class="custom-card-resumen p-4 bg-dark text-white rounded summary-fixed-bottom">
          <h3>Resumen de selección</h3>
          <div v-if="selectedBarber">
            <p><strong>Barbero Seleccionado:</strong></p>
            <p>{{ selectedBarber.full_name }}</p>
          </div>
          <div v-else class="text-muted">Selecciona un barbero</div>

          <hr />

          <div v-if="selectedServices.length">
            <p><strong>Servicios Seleccionados:</strong></p>
            <div class="mb-2" v-for="service in selectedServices" :key="service.id_services">
              <p><strong></strong> {{ service.name_service }}</p>
              <p><strong>Precio:</strong> ${{ service.price }}</p>
              <p><span>Duración: {{ service.estimated_time }}</span></p>
              <hr />
            </div>
          </div>
          <div v-else class="text-muted">No hay servicios seleccionados.</div>

          <div class="mt-3 d-grid gap-2">
            <button class="btn btn-delete-select-barber" @click="clearSelection">Eliminar selección</button>
            <button class="btn btn-continuar-barber" @click="goToCalendar"
              :disabled="!selectedBarber">Continuar</button>
            <button class="btn back-button-barber mt-2" @click="goBack">Regresar</button>
          </div>
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
      userName: '',
      userEmail: '',
      userId: ''
    };
  },

  mounted() {
    this.fetchBarbers();
    this.loadLocalData();
  },

  methods: {
    async fetchBarbers() {
      try {
        this.barbers = await getBarbers();
      } catch (error) {
        console.error('❌ Error al obtener barberos:', error);
        alert('No se pudieron cargar los barberos.');
      }
    },

    getImageUrl(image) {
      return image ? `/background/${image}` : '/img/background/BarberoPredeterminado.png';
    },

    onImageError(event) {
      if (!event.target.src.includes('default-barber.png')) {
        event.target.src = '/img/background/default-barber.png';
      }
    },

    selectBarber(barber) {
      this.selectedBarber = barber;
    },


    loadLocalData() {
      const storedService = localStorage.getItem('selectedService');
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      const storedId = localStorage.getItem('userId');

      this.selectedServices = storedService ? JSON.parse(storedService) : [];
      this.userName = storedName || '';
      this.userEmail = storedEmail || '';
      this.userId = storedId || '';
    },

    clearSelection() {
      this.selectedBarber = null;
    },

    goToCalendar() {
      if (!this.selectedBarber) {
        return alert('Por favor selecciona un barbero antes de continuar.');
      }

      localStorage.setItem('barberId', this.selectedBarber.user_id);
      localStorage.setItem('barberName', this.selectedBarber.full_name);
      localStorage.setItem('userName', this.userName);
      localStorage.setItem('userEmail', this.userEmail);
      localStorage.setItem('userId', this.userId);

      const simplifiedServices = this.selectedServices.map(service => ({
        id: service.id_services,
        name: service.name_service,
        description: service.description,
        price: service.price,
        duration: service.estimated_time
      }));
      localStorage.setItem('selectedServices', JSON.stringify(simplifiedServices));

      // Navega al calendario
      this.$router.push('/Calendario');
    },

    goBack() {
      this.$router.go(-1);
    },

    formatDuration(minutes) {
      const validMinutes = parseInt(minutes, 10);

      if (isNaN(validMinutes) || validMinutes <= 0) {
        return 'Duración no disponible';
      }

      const hrs = Math.floor(validMinutes / 60);
      const mins = validMinutes % 60;

      if (hrs && mins) return `${hrs} hora${hrs > 1 ? 's' : ''} ${mins} minuto${mins > 1 ? 's' : ''}`;
      if (hrs) return `${hrs} hora${hrs > 1 ? 's' : ''}`;
      return `${mins} minuto${mins > 1 ? 's' : ''}`;
    }
  }
};
</script>

<style scoped>
@import '@/assets/css/services/selectBarber.css';
</style>