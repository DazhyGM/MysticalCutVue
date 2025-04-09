const db = require('../config/db');

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
  const { name_service, description, estimated_time, price, id_category_services, id_status, image } = req.body;
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
  const { name_service, description, estimated_time, price, id_category_services, id_status, image } = req.body;
  const query = `
    UPDATE services 
    SET name_service = ?, description = ?, estimated_time = ?, price = ?, 
        id_category_services = ?, id_status = ?, image = ?
    WHERE id_services = ?
  `;
  db.query(query, [name_service, description, estimated_time, price, id_category_services, id_status, image, id], (err) => {
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
