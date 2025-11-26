const ServiceModel = require('../models/serviceModel');

// 🔹 Obtener todos los servicios activos
exports.getAllServices = (req, res) => {
  ServiceModel.getAllActiveServices((err, results) => {
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
  ServiceModel.getServiceById(id, (err, result) => {
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

// 🔹 Crear nuevo servicio
exports.createService = (req, res) => {
  const { name_service, description, estimated_time, price, id_category_services, id_status } = req.body;
  const image = req.file ? req.file.filename : null;

  const data = [name_service, description, estimated_time, price, id_category_services, id_status, image];

  ServiceModel.createService(data, (err) => {
    if (err) {
      console.error('Error al crear el servicio:', err);
      return res.status(500).json({ message: 'Error al crear el servicio' });
    }
    res.status(201).json({ message: 'Servicio creado correctamente' });
  });
};

// 🔹 Actualizar servicio
exports.updateService = (req, res) => {
  const { id } = req.params;
  const { name_service, description, estimated_time, price, id_category_services, id_status } = req.body;
  const image = req.file ? req.file.filename : null;

  let query = `
    UPDATE services 
    SET name_service = ?, description = ?, estimated_time = ?, price = ?, 
        id_category_services = ?, id_status = ?
  `;
  const params = [name_service, description, estimated_time, price, id_category_services, id_status];

  if (image) {
    query += `, image = ?`;
    params.push(image);
  }

  query += ` WHERE id_services = ?`;
  params.push(id);

  ServiceModel.updateService(query, params, (err) => {
    if (err) {
      console.error('Error al actualizar el servicio:', err);
      return res.status(500).json({ message: 'Error al actualizar el servicio' });
    }
    res.json({ message: 'Servicio actualizado correctamente' });
  });
};

// 🔹 Eliminar servicio (cambiar estado a inactivo)
exports.deleteService = (req, res) => {
  const { id } = req.params;
  ServiceModel.deleteService(id, (err, result) => {
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
  ServiceModel.getInactiveServices((err, results) => {
    if (err) {
      console.error('Error al obtener los servicios inactivos:', err);
      return res.status(500).json({ error: 'Error al obtener los servicios inactivos' });
    }
    res.json(results);
  });
};

// 🔹 Reactivar un servicio
exports.activateService = (req, res) => {
  const { id } = req.params;
  ServiceModel.activateService(id, (err, result) => {
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
