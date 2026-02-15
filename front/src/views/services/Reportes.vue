<template>
  <div class="container text-white">
    <div class="mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-3">
          <label for="reportType" class="form-label">Tipo de Reporte:</label>
          <select id="reportType" class="form-select bg-dark text-white" v-model="selectedReportType" @change="updateDatesForReportType">
            <option value="custom">Todas las Citas</option> <option value="daily">Hoy</option>
            <option value="weekly">Esta Semana</option>
            <option value="monthly">Este Mes</option>
            </select>
        </div>
        <div class="col-md-3" v-if="selectedReportType === 'custom'">
          <label for="startDate" class="form-label">Fecha de Inicio:</label>
          <input type="date" id="startDate" class="form-control bg-dark text-white" v-model="startDate">
        </div>
        <div class="col-md-3" v-if="selectedReportType === 'custom'">
          <label for="endDate" class="form-label">Fecha de Fin:</label>
          <input type="date" id="endDate" class="form-control bg-dark text-white" v-model="endDate">
        </div>
        
        <div class="col-md-3">
          <label for="searchText" class="form-label">Buscar por texto:</label>
          <input type="text" id="searchText" class="form-control bg-dark text-white" v-model="searchText" placeholder="Barbero, Cliente, Servicio..." @input="applyFilters">
        </div>

        <div class="col-md-6 offset-md-3 d-flex justify-content-center mt-3">
          <button class="btn btn-primary w-50 me-2" @click="loadReport" :disabled="selectedReportType !== 'custom' && !searchText">Generar Reporte / Aplicar Filtro</button>
          <button class="btn btn-primary w-50" @click="resetFilters">Reiniciar Filtros</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center my-4">
      <p>Cargando citas...</p>
    </div>
    <div v-else-if="filteredCitas.length === 0" class="alert alert-info text-center">
      No hay citas registradas para los criterios seleccionados.
    </div>
    <div v-else class="table-responsive">
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cita, index) in filteredCitas" :key="cita.id_quotes">
            <td>{{ index + 1 }}</td>
            <td>{{ formatDate(cita.date_time) }}</td>
            <td>{{ formatTime(cita.date_time) }}</td>
            <td>{{ cita.client_name || 'N/A' }}</td>
            <td>{{ cita.barber_name || 'N/A' }}</td>
            <td>{{ cita.name_service || 'No disponible' }}</td>
            <td>${{ cita.price ? cita.price.toLocaleString('es-CO') : 'N/A' }}</td>
            <td>{{ cita.state_quotes }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-center my-4">
      <button class="btn back-button" @click="$router.push('/Home')">Regresar</button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { getReportQuotes } from '@/services/quotesApi';
import '@/assets/css/style.css'; 

export default {
  name: 'CitasReportes',
  data() {
    return {
      citas: [], 
      selectedReportType: 'custom', 
      startDate: null,
      endDate: null,
      loading: false,
      userRole: null, 
      user: null, 
      isMenuOpen: false, 
      searchText: '', 
    };
  },
  computed: {
    filteredCitas() {
      if (!this.searchText) {
        return this.citas; 
      }

      const normalizeText = (text) => {
        if (!text) return '';
        return String(text)
          .normalize("NFD") 
          .replace(/[\u0300-\u036f]/g, "") 
          .toLowerCase(); 
      };

      const searchNormalized = normalizeText(this.searchText);

      return this.citas.filter(cita => {
        const clientNameNormalized = normalizeText(cita.client_name);
        const barberNameNormalized = normalizeText(cita.barber_name);
        const serviceNameNormalized = normalizeText(cita.name_service);
        
        const clientMatch = clientNameNormalized.includes(searchNormalized);
        const barberMatch = barberNameNormalized.includes(searchNormalized);
        const serviceMatch = serviceNameNormalized.includes(searchNormalized);
        
        return clientMatch || barberMatch || serviceMatch;
      });
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
    goToProfile() {
      this.$router.push("/perfil");
      this.isMenuOpen = false;
    },
    async checkUserRole() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert("No se ha iniciado sesión.");
          this.$router.push('/');
          return false;
        }

        const { data: userData } = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.userRole = userData.role;
        this.user = {
          full_name: userData.full_name || 'Usuario', 
          user_id: userData.user_id,
          user_email: userData.user_email || '',
          role: userData.role
        };
        return true; 
      } catch (error) {
        console.error('Error al verificar el rol del usuario:', error);
        alert("Error al verificar la sesión. Por favor, inicie sesión de nuevo.");
        this.$router.push('/');
        return false;
      }
    },
    async loadReport() {
      if (!this.startDate || !this.endDate) {
          if (this.selectedReportType === 'custom') {
            alert("Por favor, selecciona las fechas de inicio y fin para el reporte personalizado.");
          }
          return; 
      }

      this.loading = true;
      try {
        const reportes = await getReportQuotes(this.startDate, this.endDate);
        this.citas = reportes;
      } catch (error) {
        console.error('❌ Error al cargar el reporte de citas:', error);
        if (error.response && error.response.status === 403) {
          alert("No tienes permisos para ver este reporte. Debes iniciar sesión.");
          this.$router.push('/'); 
        } else {
          alert("No se pudo cargar el reporte de citas.");
        }
        this.citas = [];
      } finally {
        this.loading = false;
      }
    },
    applyFilters() {
      // La propiedad computada `filteredCitas` se actualizará automáticamente.
    },
    resetFilters() {
      this.selectedReportType = 'custom'; 
      this.searchText = ''; 
      this.startDate = '2000-01-01'; 
      this.endDate = '2099-12-31';
      this.loadReport(); 
    },
    getTodayDates() {
      const today = new Date();
      const start = new Date(today.setHours(0, 0, 0, 0));
      const end = new Date(today.setHours(23, 59, 59, 999));
      return { start, end };
    },
    getWeekDates() {
      const today = new Date();
      const dayOfWeek = today.getDay(); 
      const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); 
      
      const startOfWeek = new Date(today.setDate(diff));
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); 
      endOfWeek.setHours(23, 59, 59, 999);
      
      return { start: startOfWeek, end: endOfWeek };
    },
    getMonthDates() {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); 
      endOfMonth.setHours(23, 59, 59, 999);
      
      return { start: startOfMonth, end: endOfMonth };
    },
    formatDateForInput(date) {
      if (!date) return null;
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    },
    updateDatesForReportType() {
      let dates;
      switch (this.selectedReportType) {
        case 'daily':
          dates = this.getTodayDates();
          break;
        case 'weekly':
          dates = this.getWeekDates();
          break;
        case 'monthly':
          dates = this.getMonthDates();
          break;
        case 'custom':
          this.startDate = '2000-01-01'; 
          this.endDate = '2099-12-31';
          this.loadReport(); 
          return;
        default:
          return;
      }
      this.startDate = this.formatDateForInput(dates.start);
      this.endDate = this.formatDateForInput(dates.end);
      this.loadReport(); 
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
  },
  async mounted() {
    const hasAccess = await this.checkUserRole();
    if (hasAccess) {
      this.selectedReportType = 'custom';
      this.startDate = '2000-01-01'; 
      this.endDate = '2099-12-31'; 
      await this.loadReport();
    }
  }
};
</script>

<style scoped>
/* Tus estilos generales */
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

/* --- Estilos para el perfil de usuario y dropdown --- */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  background-color: transparent;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
}

.dropdown-toggle:hover {
  background-color: #333;
}

.icon {
  width: 30px; 
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  top: 100%; 
  right: 0; 
  background-color: #212529; 
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
  padding: 0.5rem 0;
  z-index: 1000; 
  min-width: 160px; 
}

.dropdown-menu.show {
  display: block; 
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1rem;
  clear: both;
  font-weight: 400;
  color: #dee2e6; 
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.dropdown-item:hover,
.dropdown-item:focus {
  color: #fff;
  background-color: #495057; 
}

.dropdown-divider {
  height: 0;
  margin: 0.5rem 0;
  overflow: hidden;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  opacity: 0.25;
}
/* --- Fin Estilos de perfil y dropdown --- */


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

/* Estilos para los select y inputs */
.form-select, .form-control {
  border: 1px solid #444;
  color: #fff;
  background-color: #212529; 
}
.form-select option {
    color: #fff;
    background-color: #333;
}
.form-label {
  color: #fff;
  font-weight: bold;
}
.btn-primary {
  background-color: #ccaf54;
  border-color: #ccaf54;
  color: #000;
}
.btn-primary:hover {
  background-color: #e0c377;
  border-color: #e0c377;
}

button.back-button {
  background-color: #ccaf54;
  color: black;
  border: none;
}
button.back-button:hover {
  background-color: black;
  color: #ccaf54;
  border: 1px solid #ccaf54;
}

.alert-info {
  background-color: #17a2b8;
  color: #fff;
  border-color: #17a2b8;
}
</style>