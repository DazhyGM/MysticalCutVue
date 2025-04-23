<template>
    <div class="container">
        <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
          <div class="col-md-3 mb-2 mb-md-0">
  <router-link to="/Home">
    <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
  </router-link>
</div>

          <ul class="nav col-12 justify-content-center mx-auto">
              <h1>Recuperar Contraseña</h1>
          </ul>
      </header>

      <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
      <form @submit.prevent="sendRecoveryEmail">
        <input v-model="email" type="email" placeholder="Escribe aqui tu correo electrónico" required />
        <button class="btn botonav" type="submit">Enviar</button>
      </form>
      
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
import { requestPasswordReset } from '../services/api';

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
    }
  }
};
</script>

  
  <style scoped>
  .container {
    max-width: 800px;
    margin: auto;
    text-align: center;
  }

  :placeholder-shown{
  background-color: rgb(29, 27, 27);
  border-radius: 10px;
  text-align: center;
}

  input, button {
    width: 100%;
    margin: 10px 0;
    padding: 10px;
  }
  </style>
  