require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });

    req.user = decoded;

    const now = Math.floor(Date.now() / 1000); // en segundos
    const timeLeft = decoded.exp - now;

    // Si quedan menos de 15 min, renovar token
    if (timeLeft < 15 * 60) {
      const newToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.setHeader('x-new-token', newToken); // Enviamos token renovado en header
    }

    next();
  });
};

module.exports = authenticate;
