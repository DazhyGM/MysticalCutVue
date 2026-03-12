<template>
  <div class="container-calendario">
    <div v-if="!userId || !barberId" class="alert alert-warning text-center" style="color: #f5c30f;">
      ⚠️ Faltan datos del usuario o del barbero. La cita no podrá confirmarse.
    </div>
    <div class="main-content">
      <div class="left-column">
        <div>
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
        <div>
          <h3>MysticalCut</h3>
          <h4>Resumen de Datos</h4>
          <p v-if="selectedDate">Fecha: {{ selectedDate }}</p>
          <p v-if="selectedTime">Hora: {{ selectedTime }}</p>
          <section class="barber-info">
            <p><strong>Nombre:</strong> {{ barberName }}</p>
          </section>
        </div>

        <div v-if="userId && barberId">
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
            <button class="back-button-calendar" @click="regresar">Regresar</button>
          </div>
        </div>
      </div>
    </div>

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

      const dateTimeStr = `${this.selectedDate}T${this.selectedTime}:00`;
      const dateTimeUTC = new Date(dateTimeStr);
      const estimatedTime = selectedService.estimated_time || selectedService.duration || '00:30:00';
      const endTime = new Date(dateTimeUTC.getTime() + this.convertTimeToMinutes(estimatedTime) * 60000);

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

        const facturaData = {
          user_id: this.userId,
          barber_id: this.barberId,
          barber_name: this.barberName,
          date: this.selectedDate,
          time: this.selectedTime,
          servicios: this.selectedServices,
          id_services: serviceId,
          quote_id: response.data?.id || null
        };

        localStorage.setItem('facturaData', JSON.stringify(facturaData));

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

    regresar() {
      this.$router.go(-1);
    }
  },
  mounted() {
    console.log('--- INICIO mounted ---');

    this.barberId = localStorage.getItem('barberId');
    this.barberName = localStorage.getItem('barberName');
    this.userId = localStorage.getItem('userId');
    this.userName = localStorage.getItem('userName');
    this.userEmail = localStorage.getItem('userEmail');

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
@import '@/assets/css/services/calendarioCitas.css';
</style>