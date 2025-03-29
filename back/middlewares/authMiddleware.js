const jwt = require('jsonwebtoken');

const JWT_SECRET = "W9mX7Pq2fG8kY6NvB3rH4tL5zA1J0CDE";  // Asegúrate de que sea el mismo en loginUser

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado, token requerido' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;

