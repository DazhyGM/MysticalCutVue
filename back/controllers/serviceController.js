const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🔥 Definir JWT_SECRET directamente en este archivo
const JWT_SECRET = 'W9mX7Pq2fG8kY6NvB3rH4tL5zA1J0CDE';

// 🔹 Obtener todos los servicios (activos)
exports.getAllServices = (req, res) => {
  const query = `
      SELECT 
          s.id_services, 
          s.name_service, 
          s.description, 
          s.estimated_time, 
          s.price, 
          s.id_category_services, 
          cs.name AS category_name,
          s.id_status,
          ss.name_status
      FROM services s
      INNER JOIN category_services cs ON s.id_category_services = cs.id_category_services
      INNER JOIN service_status ss ON s.id_status = ss.id_status
      WHERE s.id_status = 1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los servicios:', err);
      return res.status(500).json({ error: 'Error al obtener los servicios' });
    }
    res.json(results);
  });
};

// 🔹 Obtener un servicio por ID
exports.getServiceById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM services WHERE id_services = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al obtener el servicio:', err);
      return res.status(500).json({ message: 'Error al obtener el servicio' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json(result[0]);
  });
};

// 🔹 Crear un nuevo servicio
exports.createService = (req, res) => {
  const { name_service, description, estimated_time, price, id_category_services, id_status } = req.body;
  const image = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO services 
    (name_service, description, estimated_time, price, id_category_services, id_status, image) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [name_service, description, estimated_time, price, id_category_services, id_status, image], (err) => {
    if (err) {
      console.error('Error al crear el servicio:', err);
      return res.status(500).json({ message: 'Error al crear el servicio' });
    }
    res.status(201).json({ message: 'Servicio creado correctamente' });
  });
};


// 🔹 Actualizar un servicio
exports.updateService = (req, res) => {
  const { id } = req.params;
  const { name_service, description, estimated_time, price, id_category_services, id_status } = req.body;
  const image = req.file ? req.file.filename : null;

  // 🔹 Armar la query dinámicamente
  let query = `
    UPDATE services 
    SET name_service = ?, description = ?, estimated_time = ?, price = ?, 
        id_category_services = ?, id_status = ?
  `;
  const params = [name_service, description, estimated_time, price, id_category_services, id_status];

  // 🔸 Solo añadir el campo 'image' si fue enviado
  if (image) {
    query += `, image = ?`;
    params.push(image);
  }

  query += ` WHERE id_services = ?`;
  params.push(id);

  db.query(query, params, (err) => {
    if (err) {
      console.error('Error al actualizar el servicio:', err);
      return res.status(500).json({ message: 'Error al actualizar el servicio' });
    }
    res.json({ message: 'Servicio actualizado correctamente' });
  });
};



// 🔹 Eliminar un servicio (cambiar estado a inactivo)
exports.deleteService = (req, res) => {
  const { id } = req.params;
  db.query('UPDATE services SET id_status = 2 WHERE id_services = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el servicio:', err);
      return res.status(500).json({ message: 'Error al eliminar el servicio' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json({ message: 'Servicio eliminado (estado cambiado a inactivo)' });
  });
};

// 🔹 Obtener servicios inactivos
exports.getInactiveServices = (req, res) => {
  const query = `
      SELECT 
          s.id_services, 
          s.name_service, 
          s.description, 
          s.estimated_time, 
          s.price, 
          s.id_category_services, 
          cs.name AS category_name,
          s.id_status,
          ss.name_status
      FROM services s
      INNER JOIN category_services cs ON s.id_category_services = cs.id_category_services
      INNER JOIN service_status ss ON s.id_status = ss.id_status
      WHERE s.id_status = 2
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los servicios inactivos:', err);
      return res.status(500).json({ error: 'Error al obtener los servicios inactivos' });
    }

    console.log('🧪 Servicios inactivos encontrados:', results); // 👈 Agregado para debug
    res.json(results);
  });
};


// 🔹 Reactivar un servicio
exports.activateService = (req, res) => {
  const { id } = req.params;
  db.query('UPDATE services SET id_status = 1 WHERE id_services = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al activar el servicio:', err);
      return res.status(500).json({ message: 'Error al activar el servicio' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json({ message: 'Servicio activado correctamente' });
  });
};
