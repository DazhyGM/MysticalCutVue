const db = require('../config/db');

const ServiceModel = {
  getAllActiveServices: (callback) => {
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
    db.query(query, callback);
  },

  getServiceById: (id, callback) => {
    db.query('SELECT * FROM services WHERE id_services = ?', [id], callback);
  },

  createService: (data, callback) => {
    const query = `
      INSERT INTO services 
      (name_service, description, estimated_time, price, id_category_services, id_status, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, data, callback);
  },

  updateService: (query, params, callback) => {
    db.query(query, params, callback);
  },

  deleteService: (id, callback) => {
    db.query('UPDATE services SET id_status = 2 WHERE id_services = ?', [id], callback);
  },

  getInactiveServices: (callback) => {
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
    db.query(query, callback);
  },

  activateService: (id, callback) => {
    db.query('UPDATE services SET id_status = 1 WHERE id_services = ?', [id], callback);
  }
};

module.exports = ServiceModel;
