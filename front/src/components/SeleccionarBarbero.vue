<template>
  <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <router-link to="/Home">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
        </router-link>
      </div>
      <ul class="nav col-12 justify-content-center mx-auto text-center mt-3 mt-md-0">
        <h1>Elegir Barbero</h1>
      </ul>
    </header>

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
            <button class="btn btn-danger" @click="clearSelection">Eliminar selección</button>
            <button class="btn btn-success" @click="goToCalendar" :disabled="!selectedBarber">Continuar</button>
            <button class="btn btn-secondary mt-2" @click="goBack">Regresar</button>
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
  height: 320px; /* Altura fija para uniformidad, se puede ajustar con media queries si es necesario */
  display: flex;
  flex-direction: column;
  align-items: center;
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

.btn-secondary { /* Estilo para el botón regresar */
  background-color: #555;
  border: none;
  color: white;
}

.btn-secondary:hover {
  background-color: #666;
}

/* Media queries para responsividad */
@media (max-width: 767.98px) {
  /* Organización de 3 en 3 y recuadros más pequeños para barberos */
  .col-6.col-sm-4.col-md-4 { /* Apunta específicamente a la columna de los barberos */
    flex: 0 0 auto;
    width: 33.333333%; /* Tres columnas por fila */
    padding-right: 5px; /* Ajusta el padding para que quepan bien */
    padding-left: 5px;  /* Ajusta el padding para que quepan bien */
  }

  .barber-card {
    height: 200px; /* Reducido para hacer las tarjetas más pequeñas */
    padding: 8px; /* Ajusta el padding interno */
    margin: 5px 0; /* Reduce el margen entre tarjetas */
  }

  .barber-card img.barber-img {
    width: 70px; /* Imágenes más pequeñas */
    height: 70px;
  }

  .barber-card h4 {
    font-size: 0.8rem; /* Texto del nombre más pequeño */
    margin-top: 5px;
  }

  .barber-card .select-barber {
    width: 30px; /* Botón más pequeño */
    height: 30px;
    font-size: 14px;
    margin-top: 5px;
  }

  /*
    Reglas para el recuadro de resumen fijo en la parte inferior
  */
  .custom-card.summary-fixed-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 1030;
    border-radius: 0;
    padding: 10px 15px;
    margin-bottom: 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
  }

  /*
    ***AJUSTE CLAVE: Incremento del padding-bottom para más scroll***
  */
  body {
    padding-bottom: 300px; /* Aumentado para más espacio de scroll */
  }

  .container {
    padding-bottom: 300px; /* Asegúrate de que el contenedor principal también lo tenga */
  }

  /* Ajustes específicos para el contenido dentro del resumen en móviles para que quepa */
  .custom-card h3 {
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  .custom-card p {
    font-size: 0.75rem;
    margin-bottom: 2px;
  }

  .custom-card hr {
    margin: 5px 0;
  }

  .custom-card .btn {
    padding: 5px 10px;
    font-size: 0.7rem;
  }

  .custom-card .d-grid.gap-2 {
    gap: 5px !important;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .custom-card {
    padding: 30px; /* Ajusta el padding para tablets */
  }
}
</style>