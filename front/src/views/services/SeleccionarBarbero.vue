<template>
  <div class="container">

    <div class="row">
      <div class="col-md-8 col-12 order-2 order-md-1">
        <h2>Barbero</h2>
        <div class="row">
          <div class="col-6 col-sm-4 col-md-4 mb-3" v-for="barber in barbers" :key="barber.id">
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

      <div class="col-md-4 col-12 order-1 order-md-2 mb-4 mb-md-0">
        <div class="custom-card p-4 bg-dark text-white rounded summary-fixed-bottom">
          <h3>Resumen de selección</h3>
          <div v-if="selectedBarber">
            <p><strong>Barbero Seleccionado:</strong></p>
            <p>{{ selectedBarber.full_name }}</p>
          </div>
          <div v-else class="text-muted">Selecciona un barbero</div>

          <hr />

          <div v-if="selectedServices.length">
            <p><strong>Servicios Seleccionados:</strong></p>
            <div
              class="mb-2"
              v-for="service in selectedServices"
              :key="service.id_services">
              <p><strong></strong> {{ service.name_service }}</p>
              <p><strong>Precio:</strong> ${{ service.price }}</p>
              <p><span>Duración: {{ service.estimated_time }}</span></p>
              <hr />
            </div>
          </div>
          <div v-else class="text-muted">No hay servicios seleccionados.</div>

          <div class="mt-3 d-grid gap-2">
            <button class="btn btn-delete-select-barber" @click="clearSelection">Eliminar selección</button>
            <button class="btn btn-continuar-barber" @click="goToCalendar" :disabled="!selectedBarber">Continuar</button>
            <button class="btn back-button-barber mt-2" @click="goBack">Regresar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBarbers } from '@/services/api'; // Importa la función que obtiene la lista de barberos desde la API

export default {
  name: 'SeleccionarBarbero', // Nombre del componente

  data() {
    // Datos reactivos del componente
    return {
      barbers: [],          // Lista de barberos obtenida de la API
      selectedBarber: null,   // Barbero actualmente seleccionado
      selectedServices: [],   // Servicios seleccionados previamente
      userName: '',         // Nombre del usuario (obtenido del localStorage)
      userEmail: '',        // Email del usuario
      userId: ''            // ID del usuario
    };
  },

  mounted() {
    // Se ejecuta cuando el componente es montado en el DOM
    this.fetchBarbers();      // Llama a la función para obtener barberos desde la API
    this.loadLocalData();     // Carga los datos del usuario y servicios desde localStorage
  },

  methods: {
    // Método asíncrono para obtener la lista de barberos desde la API
    async fetchBarbers() {
      try {
        this.barbers = await getBarbers(); // Asigna la respuesta a la lista local
      } catch (error) {
        console.error('❌ Error al obtener barberos:', error); // Muestra error en consola
        alert('No se pudieron cargar los barberos.');          // Alerta para el usuario
      }
    },

    // Devuelve la URL completa de la imagen del barbero o una imagen predeterminada si no existe
    getImageUrl(image) {
      return image ? `/background/${image}` : '/img/background/BarberoPredeterminado.png';
    },

    // Maneja el error de carga de imagen y muestra una imagen por defecto
    onImageError(event) {
      if (!event.target.src.includes('default-barber.png')) {
        event.target.src = '/img/background/default-barber.png';
      }
    },

    // Asigna el barbero seleccionado al estado local
    selectBarber(barber) {
      this.selectedBarber = barber;
    },

    // Carga datos desde localStorage: servicios seleccionados, nombre, email e ID del usuario
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

    // Limpia SOLO la selección del barbero
    clearSelection() {
      this.selectedBarber = null; // Deselecciona el barbero
    },

    // Navega a la vista del calendario si hay un barbero seleccionado
    goToCalendar() {
      if (!this.selectedBarber) {
        return alert('Por favor selecciona un barbero antes de continuar.');
      }

      // Guarda los datos del barbero
      localStorage.setItem('barberId', this.selectedBarber.user_id);
      localStorage.setItem('barberName', this.selectedBarber.full_name);

      // Guarda los datos del usuario autenticado
      localStorage.setItem('userName', this.userName);
      localStorage.setItem('userEmail', this.userEmail);
      localStorage.setItem('userId', this.userId);

      // Guarda los servicios seleccionados con el formato solicitado
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

    // Regresa a la vista anterior en el historial de navegación
    goBack() {
      this.$router.go(-1); // Esto te devuelve a la vista anterior en el historial
    },

    // Da formato a la duración en minutos (por ejemplo: 1 hora 30 minutos)
    formatDuration(minutes) {
      const validMinutes = parseInt(minutes, 10); // Convierte a número

      if (isNaN(validMinutes) || validMinutes <= 0) {
        return 'Duración no disponible'; // Si no es válido, muestra mensaje predeterminado
      }

      const hrs = Math.floor(validMinutes / 60); // Calcula horas
      const mins = validMinutes % 60;            // Calcula minutos restantes

      // Devuelve el string con formato según las horas y minutos
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