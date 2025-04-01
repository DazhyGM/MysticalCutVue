const jwt = require('jsonwebtoken');
const JWT_SECRET = 'W9mX7Pq2fG8kY6NvB3rH4tL5zA1J0CDE'; 

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Acceso no autorizado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // 🔥 Aquí se asigna el usuario con el `id`

        console.log("🔍 Usuario autenticado en middleware:", req.user);  // 👀 Verificar

        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado" });
    }
};
