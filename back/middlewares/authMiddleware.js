// Cargar variables de entorno desde el archivo .env
require('dotenv').config();

const jwt = require('jsonwebtoken');

// Usar la variable de entorno para la clave secreta
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Acceso no autorizado, token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        console.log("🔍 Usuario autenticado en middleware:", req.user);

        next();
    } catch (error) {
        
        return res.status(403).json({ error: "Token inválido o expirado. Por favor, inicie sesión nuevamente." });
    }
};
