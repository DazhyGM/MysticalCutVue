<template>
  <div class="container-login">
    <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <img src="/img/background/LOGO.png" alt="Logo" width="125" height="125" class="d-inline-block align-text-top" />
      </div>
      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Iniciar Sesión</h1>
      </ul>
    </header>

    <div class="login-cont">
      <form @submit.prevent="logIn" class="login-form">
        <h6 class="text-center text-danger">{{ message }}</h6>

        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" v-model="email" required placeholder="Ingresa tu correo electrónico" />

        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" required placeholder="Ingresa tu contraseña" />

        <button type="submit" class="btn btn-iniciar-sesion ">Iniciar Sesión</button>

        <div class="links text-center mt-3">
          <a href="/forgotPassword">Recuperar Contraseña</a>
          <a href="/register">¿No tienes Usuario? Regístrate aquí</a>
        </div>
      </form>
    </div>

    <footer class="py-3 my-4">
      <ul class="nav justify-content-center border-bottom pb-3 mb-3"></ul>
      <p class="text-center text-white"></p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/services/api";

const router = useRouter();

const email = ref("");
const password = ref("");
const message = ref("");
const loading = ref(false);

const logIn = async () => {
  if (!email.value || !password.value) {
    message.value = "⚠️ Todos los campos son obligatorios";
    return;
  }

  try {
    loading.value = true;
    console.log("📩 Enviando datos:", email.value, password.value);

    const data = await login(email.value, password.value);

    if (!data.token) {
      throw new Error("No se recibió un token");
    }

    message.value = "✅ Inicio de sesión exitoso";

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setTimeout(() => {
      router.push("/Home");
    }, 1000);

  } catch (error) {
    console.error("⚠️ Error en el login:", error);

    if (error.response) {
        if (error.response.status === 403) {
            if (error.response.data.error.includes("bloqueada")) {
                router.push("/errorUserBlock"); // Redirige si el usuario está bloqueado
            } else if (error.response.data.error.includes("eliminada")) {
                router.push("/errorUserDeleted"); // Redirige si el usuario está eliminado
            }
        } else if (error.response.status === 401) {
            message.value = error.response.data.error || "Credenciales incorrectas. Intenta nuevamente."; 
        } else {
            message.value = error.response.data.error || "Ocurrió un error inesperado.";
        }
    } else {
        message.value = "Error de conexión con el servidor.";
    }
  }
  finally {
    loading.value = false;
  }
};
</script>

<style scoped>
 @import '@/assets/css/auth/loginUser.css';
</style>