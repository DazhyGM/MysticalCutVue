require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const quoteRoutes = require('./routes/quotesRoutes');
const productRoutes = require('./routes/productRoutes');
const shoppingCartRoutes = require('./routes/shoppingCartRoutes');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// JWT_SECRET

const JWT_SECRET = process.env.JWT_SECRET;

// 🔌 Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Citas Barbería',
      version: '1.0.0',
      description: 'Documentación de la API para agendar citas, usuarios y servicios',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Asegúrate que tus rutas tienen comentarios JSDoc Swagger
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🧭 Tus rutas
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/products', productRoutes)
app.use('/api/cart', shoppingCartRoutes);

app.get('/api/', (req, res) => {
  res.send('API funcionando correctamente 🚀');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`📚 Swagger disponible en: http://localhost:${PORT}/api-docs`);
});

// Exportar JWT_SECRET
module.exports = { JWT_SECRET };
