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
            <span class="valor">{{ servicioSeleccionado.name_service || 'No disponible' }}</span>
          </div>

          <div class="fila-dato">
            <span class="etiqueta">Barbero:</span>
            <span class="valor">{{ barberName || 'No disponible' }}</span>
          </div>

          <div class="fila-dato">
            <span class="etiqueta">Fecha:</span>
            <span class="valor">{{ date || 'No disponible' }}</span>
          </div>

          <div class="fila-dato">
            <span class="etiqueta">Hora:</span>
            <span class="valor">{{ time || 'No disponible' }}</span>
          </div>

          <div class="fila-dato">
            <span class="etiqueta">Correo del Cliente:</span>
            <span class="valor">{{ userEmail || 'No disponible' }}</span>
          </div>

          <div class="fila-dato total">
            <span class="etiqueta"><strong>Total:</strong></span>
            <span class="valor"><strong>${{ totalServicios }}</strong></span>
          </div>

          <button class="volver-btn" @click="verCitas">Ver Citas</button>
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
    };
  },
  computed: {
    totalServicios() {
      return this.servicioSeleccionado.price || 0;
    }
  },
  mounted() {
    const query = this.$route.query;
    this.userId = parseInt(query.user_id);
    this.barberId = parseInt(query.barber_id);
    this.barberName = query.barber_name || '';
    this.date = query.date || '';
    this.time = query.time || '';

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userEmail = user.email || '';
    }

    if (query.servicios) {
      try {
        const servicios = JSON.parse(decodeURIComponent(query.servicios));
        this.servicioSeleccionado = servicios[0] || {};
      } catch (e) {
        console.error('Error al parsear servicios:', e);
      }
    }
  },
  methods: {
    async enviarCorreo() {
      try {
        if (!this.userEmail) {
          console.warn('No se puede enviar correo: email no definido');
          return;
        }

        console.log('📤 Enviando correo a:', this.userEmail);
        const response = await sendQuoteEmail({
          email: this.userEmail,
          servicio: this.servicioSeleccionado.name_service,
          fecha: this.date,
          hora: this.time,
          barbero: this.barberName,
          total: this.totalServicios
        });

        if (response.message === 'Correo enviado exitosamente') {
          console.log('✅ Correo enviado correctamente');
          alert('Correo de confirmación enviado.');
        } else {
          alert('Error al enviar el correo.');
        }
      } catch (error) {
        console.error('❌ Error al enviar correo:', error);
        alert('Ocurrió un error al enviar el correo. Intenta nuevamente.');
      }
    },
    verCitas() {
      this.enviarCorreo().then(() => {
        this.$router.push('/citas');
      });
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

.factura-container {
  background-color: #000;
  color: #fff;
  font-family: 'Amasis_MT_Std_Black', serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.factura-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  width: 100%;
}

.factura-wrapper {
  background-color: #111;
  padding: 50px;
  border-radius: 20px;
  border: 1px solid #555;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
  width: 95%;
  max-width: 650px;
}

.mini-title {
  color: #fff;
  font-size: 16px;
  text-align: center;
  margin-bottom: 5px;
  letter-spacing: 1px;
  font-weight: bold;
  opacity: 0.9;
}

.resumen-title {
  color: #fff;
  font-size: 36px;
  margin-bottom: 35px;
  text-align: center;
  font-weight: bold;
}

.factura-box {
  background-color: #1a1a1a;
  padding: 40px;
  border-radius: 16px;
  border: 1px solid #ccc;
  min-height: 600px;
}

.orden-title {
  text-align: center;
  font-size: 26px;
  color: #D4AF37;
  margin-bottom: 40px;
}

.fila-dato {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  font-size: 20px;
  line-height: 1.8;
}

.etiqueta {
  color: #bbb;
  font-weight: 600;
}

.valor {
  color: #fff;
  font-weight: normal;
}

.total {
  margin-top: 50px;
  font-size: 22px;
  font-weight: bold;
  color: #D4AF37;
}

.volver-btn {
  margin-top: 40px;
  background-color: #D4AF37;
  color: #000;
  border: none;
  padding: 16px 26px;
  cursor: pointer;
  border-radius: 8px;
  font-weight: bold;
  width: 100%;
}

.correo-btn {
  margin-top: 30px;
  background-color: #444;
  color: #fff;
  border: none;
  padding: 12px 22px;
  cursor: pointer;
  border-radius: 8px;
  font-weight: bold;
  width: 100%;
  transition: background-color 0.2s;
}

.correo-btn:hover {
  background-color: #666;
}
</style>