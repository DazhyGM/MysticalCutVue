<template>
  <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <router-link to="/Home">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125"
            class="d-inline-block align-text-top" />
        </router-link>
      </div>
      <div class="col-md-6 text-center">
        <h2 class="text-uppercase m-0" style="color: white;">Seleccionar Fecha y Hora</h2>
      </div>
      <div class="col-md-3"></div>
    </header>

    <div v-if="!userId || !barberId" class="alert alert-warning text-center" style="color: #f5c30f;">
      ⚠️ Faltan datos del usuario o del barbero. La cita no podrá confirmarse.
    </div>

    <div class="main-content">
      <div class="left-column">
        <div class="profile">
          <div class="profile-pic"></div>
          <span class="barber-name">Barbero: {{ barberName }}</span>
        </div>

        <div class="calendar">
          <div class="calendar-header">
            <button @click="prevMonth">←</button>
            <span>{{ monthNames[currentMonth] }} {{ currentYear }}</span>
            <button @click="nextMonth">→</button>
          </div>

          <div class="calendar-grid">
            <div class="day-label" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
            <div class="calendar-day" v-for="calendarDate in calendarDays" :key="formatDate(calendarDate)" :class="{
              selected: selectedDate === formatDate(calendarDate),
              empty: calendarDate === null,
              disabled: isPastDate(calendarDate)
            }" @click="calendarDate && !isPastDate(calendarDate) && selectDate(calendarDate)">
              {{ calendarDate ? new Date(calendarDate).getDate() : '' }}
            </div>
          </div>
        </div>

        <div class="time-list">
          <div class="time-scroll">
            <button v-for="time in availableTimes" :key="time" @click="selectTime(time)"
              :class="['time-button', { selected: selectedTime === formatTimeTo24H(time) }]">
              {{ time }}
            </button>
          </div>
        </div>
      </div>

      <div class="right-column">
        <div class="service-summary">
          <h3>MysticalCut</h3>
            <h4>Resumen de Datos</h4>
          <p v-if="selectedDate">Fecha: {{ selectedDate }}</p>
          <p v-if="selectedTime">Hora: {{ selectedTime }}</p>
          <section class="barber-info">
            
            <p><strong>Nombre:</strong> {{ barberName }}</p>
          </section>          
        </div>
        
        <div v-if="userId && barberId" class="summary-box">
          <div v-if="userName && userEmail && userId">
          </div>
          <div v-else class="text-muted">No se encontró información del usuario.</div>
          <hr />
          <div v-for="service in selectedServices" :key="service.id">
            <p>{{ service.name }}</p>
            <p>Precio: ${{ service.price }}</p>
            <p>Duración: {{ service.duration }}</p>
            <button v-if="selectedDate && selectedTime" class="confirm-button" :disabled="!userId || !barberId"
            @click="confirmQuote">
            Confirmar Cita
          </button>
            <button class="back-button1" @click="regresar">Regresar</button>
          </div>
        </div>
      </div>
    </div>

    <footer>
      <p>© 2024 www.mysticalcut.com, Inc</p>
    </footer>
  </div>
</template>

<script>
import { createQuote } from '@/services/quotesApi';

export default {
  name: 'CalendarioCitas',
  data() {
    return {
      selectedDate: '',
      selectedTime: '',
      barberId: null,
      barberName: '',
      userId: null,
      userName: '',
      userEmail: '',
      selectedServices: [],
      availableTimes: ['8:00 a.m.', '9:00 a.m.', '10:00 a.m.', '11:00 a.m.', '12:00 p.m.', '1:00 p.m.', '2:00 p.m.', '3:00 p.m.', '4:00 p.m.', '5:00 p.m.', '6:00 p.m.', '7:00 p.m.', '8:00 p.m.'],
      daysOfWeek: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
    };
  },
  computed: {
    calendarDays() {
      const days = [];
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const totalDays = lastDay.getDate();
      const startWeekday = (firstDay.getDay() + 6) % 7;
      for (let i = 0; i < startWeekday; i++) days.push(null);
      for (let i = 1; i <= totalDays; i++) days.push(new Date(this.currentYear, this.currentMonth, i));
      return days;
    }
  },
  methods: {
    formatDate(date) {
      return date ? date.toISOString().split('T')[0] : '';
    },
    isPastDate(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date && date < today;
    },
    formatTimeTo24H(time12h) {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':');
      if (modifier === 'p.m.' && hours !== '12') hours = parseInt(hours) + 12;
      if (modifier === 'a.m.' && hours === '12') hours = '00';
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    },
    selectDate(date) {
      this.selectedDate = this.formatDate(date);
      console.log('Fecha seleccionada:', this.selectedDate);
    },
    selectTime(time) {
      this.selectedTime = this.formatTimeTo24H(time);
      console.log('Hora seleccionada (24h):', this.selectedTime);
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    prevMonth() {
      const now = new Date();
      if ((this.currentMonth === 0 && this.currentYear === now.getFullYear()) || new Date(this.currentYear, this.currentMonth - 1) < new Date(now.getFullYear(), now.getMonth())) return;
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    convertTimeToMinutes(time) {
      const [hours, minutes] = time.split(':').map(Number);
      return (hours * 60) + minutes;
    },
    async confirmQuote() {
      console.log('--- INICIO confirmQuote ---');
      console.log('Servicios disponibles:', this.selectedServices);

      // Validación del servicio seleccionado
      if (!this.selectedServices?.length || this.selectedServices.length !== 1) {
        console.error('Error en servicios:', this.selectedServices);
        return alert('Debes seleccionar exactamente un servicio');
      }

      const selectedService = this.selectedServices[0];
      const serviceId = selectedService.id_services || selectedService.id;

      if (!serviceId) {
        console.error('Servicio sin ID válido:', selectedService);
        return alert('El servicio seleccionado no tiene un ID válido');
      }

      if (!this.selectedDate || !this.selectedTime) {
        return alert('Selecciona fecha y hora');
      }

      if (!this.userId || !this.barberId) {
        return alert('Faltan datos de usuario o barbero');
      }

      // Preparación de fechas
      const dateTimeStr = `${this.selectedDate}T${this.selectedTime}:00`;
      const dateTimeUTC = new Date(dateTimeStr);
      const estimatedTime = selectedService.estimated_time || selectedService.duration || '00:30:00';
      const endTime = new Date(dateTimeUTC.getTime() + this.convertTimeToMinutes(estimatedTime) * 60000);

      // Datos para la API
      const quoteData = {
        user_id: this.userId,
        barber_id: this.barberId,
        date_time: dateTimeUTC.toISOString(),
        end_time: endTime.toISOString(),
        state_quotes: 'pendiente',
        id_services: serviceId
      };

      console.log('Datos finales para API:', JSON.stringify(quoteData, null, 2));

      try {
        const response = await createQuote(quoteData);
        console.log('Cita creada:', response);

        // Guardar datos para factura en localStorage
        const facturaData = {
          user_id: this.userId,
          barber_id: this.barberId,
          barber_name: this.barberName,
          date: this.selectedDate,
          time: this.selectedTime,
          servicios: this.selectedServices,
          id_services: serviceId,
          quote_id: response.data?.id || null // Asumiendo que la API devuelve un ID de cita
        };

        localStorage.setItem('facturaData', JSON.stringify(facturaData));

        // Redirección sin parámetros en la URL
        this.$router.push('/FacturaServicios');

      } catch (error) {
        console.error('Error al crear cita:', {
          message: error.message,
          response: error.response?.data,
          request: error.config,
          stack: error.stack
        });
        alert(`Error al crear cita: ${error.response?.data?.message || error.message}`);
      }
    },
    // MODIFICACIÓN: Ahora usa this.$router.go(-1) para ir a la vista anterior
    regresar() {
      this.$router.go(-1); 
    }
  },
  mounted() {
    console.log('--- INICIO mounted ---');
    
    // Cargar datos esenciales
    this.barberId = localStorage.getItem('barberId');
    this.barberName = localStorage.getItem('barberName');
    this.userId = localStorage.getItem('userId');
    this.userName = localStorage.getItem('userName');
    this.userEmail = localStorage.getItem('userEmail');

    // Cargar y validar servicios
    const storedServices = localStorage.getItem('selectedServices');
    try {
      this.selectedServices = storedServices ? JSON.parse(storedServices) : [];
      console.log('Servicios cargados:', this.selectedServices);
      
      if (!Array.isArray(this.selectedServices)) {
        console.warn('Formato inválido de servicios, reseteando...');
        this.selectedServices = [];
      }
    } catch (e) {
      console.error('Error al parsear servicios:', e);
      this.selectedServices = [];
    }

    console.log('Datos inicializados:', {
      barberId: this.barberId,
      userId: this.userId,
      servicesCount: this.selectedServices.length
    });

    if (!this.userId || !this.barberId) {
      console.warn('Faltan datos esenciales (userId o barberId)');
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

body,
.container {
  background-color: #000;
  color: #fff;
  font-family: 'Amasis_MT_Std_Black', serif;
}

header {
  background-color: #000;
  color: white;
}

h2 {
  font-size: 1.8rem;
  font-weight: bold;
}

.custom-header {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #666;
  padding: 10px 0;
  position: relative;
}

.logo {
  width: 90px;
  height: auto;
  position: absolute;
  left: 20px;
}

h1 {
  font-size: 28px;
  color: #fff;
}

.main-content {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
}

.left-column {
  flex: 2;
  margin-right: 20px;
  min-width: 300px;
}

.right-column {
  flex: 1;
  max-width: 350px;
  padding: 20px;
  background-color: #222;
  border: 1px solid #ccc;
  border-radius: 12px;
  align-self: flex-start;
}

/* Calendario mejorado */
.calendar {
  background-color: #111;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #333;
  margin-top: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #222;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: bold;
  color: #f5c30f;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.calendar-header button {
  background-color: #333;
  border: none;
  color: #f5c30f;
  font-size: 1.2rem;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.calendar-header button:hover {
  background-color: #444;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-label {
  text-align: center;
  font-weight: bold;
  color: #f5c30f;
  margin-bottom: 5px;
}

.calendar-day {
  background-color: #1e1e1e;
  color: #fff;
  padding: 12px 0;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  border: 1px solid transparent;
}

.calendar-day:hover {
  background-color: #333;
  transform: scale(1.05);
}

.calendar-day.selected {
  background-color: #f5c30f;
  color: #000;
}

.calendar-day.disabled {
  background-color: #444;
  color: #888;
  cursor: not-allowed;
}

.calendar-day.empty {
  background-color: transparent;
  border: none;
  pointer-events: none;
}

/* Lista de horas mejorada */
.time-list {
  margin-top: 30px;
  background-color: #111;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #333;
}

.time-scroll {
  max-height: 220px;
  /* Ajusta el tamaño según lo que necesites */
  overflow-y: auto;
}

.time-button {
  padding: 12px;
  background-color: #1e1e1e;
  border: 1px solid #333;
  margin: 8px 0;
  cursor: pointer;
  width: 100%;
  color: #fff;
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.time-button:hover {
  background-color: #333;
  transform: translateY(-2px);
}

.time-button.selected {
  background-color: #f5c30f;
  color: #000;
}

/* Botones de acción */
.confirm-button,
.back-button1 {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-family: 'Amasis_MT_Std_Black', serif;
}

.confirm-button {
  background-color: #f5c30f;
  color: #000;
}

.back-button1 {
  background-color: #908f8f;
  color: #000;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  display: block;
  margin: 20px auto 0;
  width: fit-content;
}

.barber-name {
  display: block;
  margin-top: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #f5c30f;
  font-family: 'Amasis_MT_Std_Black', serif;
  text-align: left;
  /* <-- Alineado a la izquierda */
  padding-left: 10px;
  /* Opcional: espacio desde el borde izquierdo */
}

footer {
  background-color: #000;
  color: #fff;
  padding: 20px 0;
  /* Espacio superior e inferior */
  text-align: center;
  /* Centra el texto */
  font-size: 1rem;
  /* Tamaño de fuente */
}

footer p {
  margin: 0;
  /* Elimina márgenes por defecto */
}
</style>