<template>
  <div class="container text-white">
    <!-- Encabezado -->
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <router-link to="/Home">
          <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" />
        </router-link>
      </div>

      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Citas</h1>
      </ul>
    </header>

    <!-- Tabla de citas -->
    <div class="table-responsive">
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Cliente</th>
            <th>Barbero</th>
            <th>Servicio</th>
            <th>Valor</th>
            <th>Estado</th>
            <th v-if="userRole === 'Employee' || userRole === 'Client' || userRole === 'admin'">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cita, index) in citas" :key="cita.id_quotes">
            <td>{{ index + 1 }}</td>
            <td>{{ formatDate(cita.date_time) }}</td>
            <td>{{ formatTime(cita.date_time) }}</td>
            <td>{{ cita.client_name || 'N/A' }}</td>
            <td>{{ cita.barber_name || 'N/A' }}</td>
            <td>{{ cita.name_service || 'No disponible' }}</td>
            <td>${{ cita.price ? cita.price.toLocaleString('es-CO') : 'N/A' }}</td>
            <td>{{ cita.state_quotes }}</td>
            <td v-if="userRole === 'Employee' || userRole === 'Client' || userRole === 'admin'">
              <div class="d-flex gap-2">
                <button
                  v-if="cita.state_quotes === 'pendiente'"
                  class="btn btn-sm btn-danger"
                  @click="cancelarCita(cita.id_quotes)"
                >
                  Cancelar
                </button>
                <button
                  v-if="cita.state_quotes === 'pendiente' && userRole === 'Employee'"
                  class="btn btn-sm btn-success"
                  @click="finalizarCita(cita.id_quotes)"
                >
                  Finalizar
                </button>
                <span v-else-if="cita.state_quotes !== 'pendiente'" class="text-success fw-bold">✔ Terminado</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Botón regresar -->
    <div class="text-center my-4">
      <button class="btn back-button" @click="$router.push('/Home')">Regresar</button>
    </div>

    <!-- Footer -->
    <footer class="py-3 my-4">
      <p class="text-center text-white">© 2024 www.mysticalcut.com, Inc</p>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
import { getQuotesWithServiceDetails, cancelQuote, finishQuote } from '@/services/quotesApi';
import '@/assets/css/style.css';

export default {
  name: 'CitasPendientes',
  data() {
    return {
      citas: [],
      userId: null,
      userRole: null,
    };
  },
  methods: {
    async cargarCitas() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert("No se ha iniciado sesión.");
          this.$router.push('/');
          return;
        }

        const { data: userData } = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.userId = userData.user_id;
        this.userRole = userData.role;

        // Si el rol es admin, no pasamos user_id ni barber_id
        const citasData = await getQuotesWithServiceDetails(this.userRole === 'admin' ? null : this.userId);
        this.citas = citasData;
      } catch (error) {
        console.error('❌ Error al cargar citas:', error);
        alert("No se pudieron cargar las citas.");
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'Fecha no disponible';
      return new Date(dateString).toLocaleDateString('es-CO', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    },
    formatTime(dateString) {
      if (!dateString) return 'Hora no disponible';
      return new Date(dateString).toLocaleTimeString('es-CO', {
        hour: '2-digit', minute: '2-digit'
      });
    },
    async cancelarCita(id) {
      try {
        await cancelQuote(id);
        this.cargarCitas();
        alert('Cita cancelada con éxito');
      } catch (error) {
        console.error('❌ Error al cancelar cita:', error);
        alert('No se pudo cancelar la cita.');
      }
    },
    async finalizarCita(id) {
      try {
        await finishQuote(id);
        this.cargarCitas();
        alert('Cita finalizada con éxito');
      } catch (error) {
        console.error('❌ Error al finalizar cita:', error);
        alert('No se pudo finalizar la cita.');
      }
    }
  },
  mounted() {
    this.cargarCitas();
  }
};
</script>

<style scoped>
/* Estilos generales */
.container {
  max-width: 1200px;
  margin-top: 30px;
}

header {
  background-color: #000;
  padding: 20px 0;
  color: white;
}

header img {
  width: 125px;
  height: 125px;
}



footer {
  background-color: #000;
  padding: 20px 0;
  color: white;
  text-align: center;
  border-top: 1px solid #fff;
}

/* Tabla de citas */
.table {
  margin-top: 30px;
  border-collapse: collapse;
}

.table thead {
  background-color: #333;
  color: white;
}

.table th, .table td {
  padding: 15px;
  text-align: center;
}

.table td {
  font-size: 1rem;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #2b2b2b;
}

.table-striped tbody tr:nth-of-type(even) {
  background-color: #222;
}

.table-responsive {
  overflow-x: auto;
}

button {
  font-size: 1rem;
  padding: 8px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
  background-color: #ccaf54;
}

button:hover {
  background-color: black;
}

button.btn-danger {
  background-color: #e3342f;
}

button.btn-success {
  background-color: #38c172;
}

/* Estilo de la fila de acción */
button.btn-sm {
  padding: 5px 10px;
}

.text-center {
  text-align: center;
}

.text-success {
  color: #28a745;
}

.fw-bold {
  font-weight: bold;
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
