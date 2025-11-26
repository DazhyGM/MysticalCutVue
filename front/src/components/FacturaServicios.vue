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
            <span class="valor">{{ servicioSeleccionado.name || servicioSeleccionado.name_service || 'No disponible' }}</span>
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
        
        // Obtener el primer servicio (asumiendo que solo hay uno)
        this.servicioSeleccionado = this.servicios[0] || {};

        // Obtener email del usuario
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
        // Limpiar datos de factura después de usarlos
        localStorage.removeItem('facturaData');
        this.$router.push('/citas');
      });
    }
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
  margin: 0;
}

.factura-container {
  background-color: #000;
  color: #fff;
  font-family: 'Amasis_MT_Std_Black', serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Centrar verticalmente el contenido */
  padding: 20px; /* Añadir padding general para evitar que el contenido toque los bordes */
  box-sizing: border-box; /* Incluir padding en el ancho y alto total */
}

.factura-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.factura-wrapper {
  background-color: #111;
  padding: 50px;
  border-radius: 20px;
  border: 1px solid #555;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
  width: 95%; /* Asegura que no sea más grande que el 95% del contenedor */
  max-width: 650px;
  box-sizing: border-box; /* Incluir padding en el ancho y alto total */
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
  display: flex; /* Usar flexbox para organizar los elementos */
  flex-direction: column; /* Apilarlos verticalmente */
  justify-content: space-between; /* Distribuir el espacio entre los elementos */
  box-sizing: border-box; /* Incluir padding en el ancho y alto total */
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
  align-items: baseline; /* Alinea el texto en la línea base */
  margin: 15px 0; /* Ajusta el margen vertical */
  font-size: 20px;
  line-height: 1.5; /* Reduce el interlineado */
  flex-wrap: wrap; /* Permite que los elementos se envuelvan en pantallas pequeñas */
}

.etiqueta {
  color: #bbb;
  font-weight: 600;
  flex-shrink: 0; /* Evita que la etiqueta se encoja */
  margin-right: 10px; /* Espacio entre etiqueta y valor */
}

.valor {
  color: #fff;
  font-weight: normal;
  text-align: right; /* Alinea el valor a la derecha */
  flex-grow: 1; /* Permite que el valor ocupe el espacio restante */
}

.total {
  margin-top: auto; /* Empuja el total hacia abajo si el contenido es menor */
  margin-bottom: 20px; /* Espacio antes del botón */
  font-size: 22px;
  font-weight: bold;
  color: #D4AF37;
}

.volver-btn {
  margin-top: 20px; /* Ajusta el margen superior */
  background-color: #D4AF37;
  color: #000;
  border: none;
  padding: 16px 26px;
  cursor: pointer;
  border-radius: 8px;
  font-weight: bold;
  width: 100%;
  font-size: 18px; /* Ajusta el tamaño de fuente del botón */
}

/* Media Queries para responsividad */

/* Pantallas muy pequeñas (móviles en orientación retrato, hasta 575.98px) */
@media (max-width: 575.98px) {
  .factura-container {
    padding: 10px;
  }

  .factura-wrapper {
    padding: 25px; /* Reduce el padding del contenedor principal */
    width: 100%; /* Ocupa todo el ancho disponible */
  }

  .mini-title {
    font-size: 14px;
  }

  .resumen-title {
    font-size: 28px;
    margin-bottom: 25px;
  }

  .factura-box {
    padding: 25px; /* Reduce el padding del recuadro de la orden */
    min-height: auto; /* Permite que la altura se ajuste al contenido */
  }

  .orden-title {
    font-size: 22px;
    margin-bottom: 25px;
  }

  .fila-dato {
    font-size: 16px; /* Reduce el tamaño de fuente de los datos */
    margin: 10px 0; /* Reduce el margen vertical */
    flex-direction: column; /* Apila etiqueta y valor en una nueva línea */
    align-items: flex-start; /* Alinea el texto a la izquierda */
  }

  .etiqueta {
    margin-bottom: 2px; /* Espacio entre etiqueta y valor apilados */
  }

  .valor {
    text-align: left; /* Alinea el valor a la izquierda cuando se apila */
  }

  .total {
    font-size: 18px;
    margin-top: 30px;
    margin-bottom: 15px;
  }

  .volver-btn {
    padding: 12px 20px;
    font-size: 16px;
  }
}

/* Pantallas pequeñas (móviles en orientación horizontal, tablets pequeñas, 576px - 767.98px) */
@media (min-width: 576px) and (max-width: 767.98px) {
  .factura-wrapper {
    padding: 35px;
  }

  .resumen-title {
    font-size: 32px;
  }

  .factura-box {
    padding: 30px;
  }

  .orden-title {
    font-size: 24px;
  }

  .fila-dato {
    font-size: 18px;
  }

  .total {
    font-size: 20px;
  }

  .volver-btn {
    padding: 14px 22px;
    font-size: 17px;
  }
}

/* Pantallas medianas (tablets y laptops pequeñas, 768px - 991.98px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .factura-wrapper {
    padding: 40px;
  }

  .resumen-title {
    font-size: 34px;
  }

  .factura-box {
    padding: 35px;
  }

  .orden-title {
    font-size: 25px;
  }

  .fila-dato {
    font-size: 19px;
  }

  .total {
    font-size: 21px;
  }
}
</style>