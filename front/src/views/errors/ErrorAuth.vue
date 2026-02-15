<template>
  <div class="error-container">
    <h1 class="error-code">404</h1>
    <h2 class="error-message">⚠️ Acceso denegado</h2>
    <p class="error-description">
      Pagina no disponible en este momento. Por favor inicia seion.  
    </p>
    <router-link to="/" class="home-link">Volver al inicio</router-link>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Ocupa toda la pantalla */
  text-align: center;
  background-color: #000; /* Fondo negro */
  color: #fff; /* Texto blanco para contraste */
  font-family: 'Amasis_MT_Std_Black'; /* Usa la fuente de otros componentes */
}

.error-code {
  font-size: 6rem;
  font-weight: bold;
  color: #ff3b3b; /* Rojo para destacar el error */
  margin-bottom: 10px;
}

.error-message {
  font-size: 2rem;
  font-weight: bold;
}

.error-description {
  font-size: 1.2rem;
  margin: 10px 20px;
}

.home-link {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1.1rem;
  background-color: #daa520; /* Dorado */
  color: black;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s ease, transform 0.2s ease;
  font-weight: bold;
}

.home-link:hover {
  background-color: #970606; /* Un dorado más claro */
  transform: scale(1.05); /* Efecto de agrandamiento */
}
</style>

