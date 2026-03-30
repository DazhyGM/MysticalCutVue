<template>
  <div class="factura-container">
    <div class="factura-content">
      <div class="factura-wrapper">
        <p class="mini-title">MysticalCut</p>
        <h1 class="resumen-title">Resumen Servicio</h1>
        <div class="factura-box">
          <h2 class="orden-title">Orden de Servicio</h2>

          <div class="fila-dato">
            <span class="etiqueta">Servicio Seleccionado:</span>
            <span class="valor">{{ servicioSeleccionado.name || servicioSeleccionado.name_service || 'No disponible'
            }}</span>
          </div>

          <div class="fila-dato">
            <span class="etiqueta">Barbero:</span>
            <span class="valor">{{ barberName || 'No disponible' }}</span>
          </div>

          <div class="fila-dato">
            <span class="etiqueta">Fecha:</span>
            <span class="valor">{{ formattedDate || 'No disponible' }}</span>
          </div>

          <div class="fila-dato">
            <span class="etiqueta">Hora:</span>
            <span class="valor">{{ formattedTime || 'No disponible' }}</span>
          </div>

          <div class="fila-dato">
            <span class="etiqueta">Correo del Cliente:</span>
            <span class="valor">{{ userEmail || 'No disponible' }}</span>
          </div>

          <div class="fila-dato total">
            <span><strong>Total:</strong></span>
            <span class="valor"><strong>${{ totalServicios }}</strong></span>
          </div>

          <button class="confirmar-btn" @click="confirmarCita">
            Confirmar Cita
          </button>

          <button class="volver-btn" @click="volver">
            Volver / Editar Cita
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendQuoteEmail } from '@/services/quotesApi';

export default {
  name: 'FacturaServicios',
  data() {
    return {
      userId: null,
      barberId: null,
      barberName: '',
      date: '',
      time: '',
      servicioSeleccionado: {},
      userEmail: '',
      servicios: []
    };
  },
  computed: {
    totalServicios() {
      return this.servicioSeleccionado.price || 0;
    },
    formattedDate() {
      if (!this.date) return '';
      const [year, month, day] = this.date.split('-');
      return `${day}/${month}/${year}`;
    },
    formattedTime() {
      if (!this.time) return '';
      return this.time.replace(/(\d{2}):(\d{2})/, (match, hh, mm) => {
        const hours = parseInt(hh);
        const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${mm} ${ampm}`;
      });
    }
  },
  mounted() {
    this.loadFacturaData();
  },
  methods: {
    loadFacturaData() {
      const facturaData = localStorage.getItem('facturaData');

      if (!facturaData) {
        console.error('No se encontraron datos de factura en localStorage');
        this.$router.push('/error-factura');
        return;
      }

      try {
        const data = JSON.parse(facturaData);
        console.log('Datos de factura cargados:', data);

        this.userId = data.user_id;
        this.barberId = data.barber_id;
        this.barberName = data.barber_name;
        this.date = data.date;
        this.time = data.time;
        this.servicios = data.servicios || [];

        this.servicioSeleccionado = this.servicios[0] || {};

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          this.userEmail = user.email || '';
        }

      } catch (error) {
        console.error('Error al procesar datos de factura:', error);
        this.$router.push('/error-factura');
      }
    },
    async enviarCorreo() {
      try {
        if (!this.userEmail) {
          console.warn('No se puede enviar correo: email no definido');
          return;
        }

        console.log('📤 Enviando correo a:', this.userEmail);
        const response = await sendQuoteEmail({
          email: this.userEmail,
          servicio: this.servicioSeleccionado.name || this.servicioSeleccionado.name_service,
          fecha: this.formattedDate,
          hora: this.formattedTime,
          barbero: this.barberName,
          total: this.totalServicios
        });

        console.log('📩 Respuesta del backend:', response);

        if (response && (response.message || response.msg)) {
          return true;
        }

        return false;

      } catch (error) {
        console.error('❌ Error al enviar correo:', error);
        return false;
      }
    },
    async confirmarCita() {
      const enviado = await this.enviarCorreo();

      if (enviado) {
        alert('Cita confirmada correctamente ✅');
      } else {
        alert('Cita confirmada, pero hubo un problema con el correo ⚠️');
      }

      localStorage.removeItem('facturaData');
      this.$router.push('/citas');
    },
    volver() {
      this.$router.back();
    }
  },

};
</script>

<style scoped>
@import '@/assets/css/services/facturaService.css';
</style>