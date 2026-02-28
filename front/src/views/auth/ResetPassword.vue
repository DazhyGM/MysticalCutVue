<template>
  <div class="container">
    <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
  <router-link to="/Home">
    <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
  </router-link>
</div>

      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Restablecer Contraseña</h1>
      </ul>
    </header>
    <form @submit.prevent="resetPassword">
      <label for="password">Nueva Contraseña</label>
      <input v-model="newPassword" type="password" placeholder="Escribe aqui tu nueva contraseña" required />
      <label for="password">Confirmar Contraseña</label>
      <input v-model="confirmPassword" type="password" placeholder="Confirma la contraseña" required />
      <button class="btn btn-update" type="submit">Actualizar Contraseña</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { resetPassword } from '@/services/api.js';

export default {
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      message: ''
    };
  },
  methods: {
    async resetPassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.message = '❌ Las contraseñas no coinciden';
        return;
      }

      try {
        const token = this.$route.params.token;
        const response = await resetPassword(token, this.newPassword);
        this.message = response.message;

        alert("✅ Contraseña cambiada exitosamente.");
        this.$router.push("/login");

      } catch (error) {
        this.message = '❌ Ocurrió un error, intenta nuevamente';
        console.error("Error en resetPassword:", error);
      }
    }
  },
};
</script>

<style scoped>
/* .container {
  max-width: 600px;
  margin: auto;
  text-align: center;
}

:placeholder-shown{
  background-color: rgb(29, 27, 27);
  border-radius: 10px;
  text-align: center;
}

input,
button {
  width: 100%;
  margin: 10px 0;
  padding: 10px;
} */
 @import '@/assets/css/auth/resetPassword.css';
</style>