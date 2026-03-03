<template>
  <div class="container text-white">
    <div class="row mb-3">
      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Reportes</h1>
      </ul>
    </div>
    <div class="mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-3">
          <label for="reportType" class="form-label">Tipo de Reporte:</label>
          <select id="reportType" class="form-select bg-dark text-white" v-model="selectedReportType"
            @change="updateDatesForReportType">
            <option value="custom">Todas las Citas</option>
            <option value="daily">Hoy</option>
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
          <input type="text" id="searchText" class="form-control bg-dark text-white" v-model="searchText"
            placeholder="Barbero, Cliente, Servicio..." @input="applyFilters">
        </div>

        <div class="col-md-6 offset-md-3 d-flex justify-content-center mt-3">
          <button class="btn btn-primary w-50 me-2" @click="loadReport"
            :disabled="selectedReportType !== 'custom' && !searchText">Generar Reporte / Aplicar Filtro</button>
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
    
    <div class="pedido-container">
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
    </div>

    <div class="text-center my-4">
      <button class="btn back-button" @click="$router.push('/Home')">Regresar</button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { getReportQuotes } from '@/services/quotesApi';

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
@import '@/assets/css/services/reportes.css';
</style>