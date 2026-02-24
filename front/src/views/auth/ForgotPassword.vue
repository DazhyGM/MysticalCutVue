<template>
  <div class="container">
    <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
      </div>
      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Recuperar Contraseña</h1>
      </ul>
    </header>

    <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
    <form @submit.prevent="sendRecoveryEmail">
      <input v-model="email" type="email" placeholder="Escribe aqui tu correo electrónico" required />
      <button class="btn button-enviar" type="submit">Enviar</button>

    </form>
    <button class="btn-regresar" @click="goBack">Regresar</button>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { requestPasswordReset } from '@/services/api';

export default {
  data() {
    return {
      email: '',
      message: ''
    };
  },
  methods: {
    async sendRecoveryEmail() {
      try {
        await requestPasswordReset(this.email);
        this.message = 'Si el correo está registrado, recibirás un enlace de recuperación.';
      } catch (error) {
        this.message = error.response?.data?.error || 'Error al enviar el correo';
      }
    },
    goBack() {
      this.$router.push('/Login');
    }
  }
};
</script>

<style scoped>
@import '@/assets/css/auth/forgotPassword.css';
</style>