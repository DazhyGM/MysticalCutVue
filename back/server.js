const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Definir JWT_SECRET directamente en server.js
const JWT_SECRET = 'W9mX7Pq2fG8kY6NvB3rH4tL5zA1J0CDE';

// Rutas
app.use('/api/', userRoutes);

app.get('/api/', (req, res) => {
  res.send('API funcionando correctamente 🚀');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ✅ Exportar JWT_SECRET para que pueda usarse en otros archivos
module.exports = { JWT_SECRET };
