const db = require('../config/db');
const nodemailer = require('nodemailer');

class Quote {
  // 🔹 Verificar disponibilidad del barbero
  static async checkAvailability(barberId, startTime, endTime) {
    const query = `
      SELECT * FROM quotes
      WHERE barber_id = ? 
        AND (date_time BETWEEN ? AND ? OR end_time BETWEEN ? AND ?)
    `;

    const result = await new Promise((resolve, reject) => {
      db.query(query, [barberId, startTime, endTime, startTime, endTime], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    return result.length === 0;
  }

  // 🔹 Obtener duración estimada del servicio
  static async getServiceDuration(serviceId) {
    const [result] = await new Promise((resolve, reject) => {
      db.query('SELECT estimated_time FROM services WHERE id_services = ?', [serviceId], (err, results) => {
        if (err || results.length === 0) return reject(err || 'No se encontró el servicio');
        resolve(results);
      });
    });

    const [hours, minutes] = result.estimated_time.split(':').map(Number);
    return (hours * 60) + minutes;
  }

  // 🔹 Crear nueva cita
  static async create(userId, barberId, dateTime, stateQuotes, serviceId) {
    const estimatedMinutes = await this.getServiceDuration(serviceId);
    const startTime = new Date(dateTime);
    const endTime = new Date(startTime.getTime() + estimatedMinutes * 60000);

    const isAvailable = await this.checkAvailability(barberId, startTime, endTime);
    if (!isAvailable) {
      throw new Error('El barbero ya tiene una cita en ese horario');
    }

    const result = await new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO quotes (user_id, barber_id, date_time, end_time, state_quotes, id_services)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, barberId, startTime, endTime, stateQuotes, serviceId],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    return {
      id: result.insertId,
      end_time: endTime
    };
  }

  // 🔹 Obtener citas por barbero y mes
  static async getByBarberAndMonth(barberId, year, month) {
    const query = `
      SELECT id_quotes, date_time, end_time
      FROM quotes
      WHERE barber_id = ? 
        AND YEAR(date_time) = ? 
        AND MONTH(date_time) = ?
    `;

    const results = await new Promise((resolve, reject) => {
      db.query(query, [barberId, year, month], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    return results.map(cita => ({
      id: cita.id_quotes,
      date_time: cita.date_time,
      end_time: cita.end_time,
      duration: (new Date(cita.end_time) - new Date(cita.date_time)) / 60000
    }));
  }

  // 🔹 Obtener citas con detalles de servicio
  static async getWithServiceDetails(userId = null, barberId = null, isAdmin = false) {
    let query = `
      SELECT 
        q.id_quotes,
        q.date_time,
        q.state_quotes,
        q.id_services,
        s.name_service,
        s.price,
        s.estimated_time,
        q.barber_id,
        barberos.full_name AS barber_name,
        clientes.full_name AS client_name
      FROM quotes q
      JOIN services s ON q.id_services = s.id_services
      LEFT JOIN user barberos ON q.barber_id = barberos.user_id
      LEFT JOIN user clientes ON q.user_id = clientes.user_id
    `;

    const params = [];

    if (!isAdmin && (userId || barberId)) {
      query += ' WHERE (q.user_id = ? OR q.barber_id = ?)';
      params.push(userId || barberId, barberId || userId);
    }

    query += ' ORDER BY q.date_time DESC';

    const results = await new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    return results;
  }

  // 🔹 Obtener citas por barbero y fecha
  static async getByBarberAndDate(barberId, date) {
    const startOfDay = `${date} 00:00:00`;  // Asegúrate de que `date` es string
    const endOfDay = `${date} 23:59:59`;


    const query = `
      SELECT id_quotes, date_time, end_time
      FROM quotes
      WHERE barber_id = ?
        AND date_time BETWEEN ? AND ?
    `;

    const results = await new Promise((resolve, reject) => {
      db.query(query, [barberId, startOfDay, endOfDay], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    return results;cd
  }

  // 🔹 Actualizar estado de la cita
  static async updateStatus(quoteId, status) {
    const result = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE quotes SET state_quotes = ? WHERE id_quotes = ?',
        [status, quoteId],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    return result.affectedRows > 0;
  }

  // 🔹 Enviar correo de confirmación
  static async sendConfirmationEmail(email, servicio, fecha, hora, total, barbero) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mysticalcut@gmail.com',
        pass: 'wwgn lfus tlik utax',
      },
    });

    const mailOptions = {
      from: 'mysticalcut@gmail.com',
      to: email,
      subject: 'Confirmación de tu cita - MysticalCut',
      html: `
        <h2>💥💈Gracias por confiar en MysticalCut💈💥</h2>
        <h2>💈Aquí tienes el resumen de tu cita 😉💈</h2>
        <p><strong>Servicio:</strong> ${servicio}</p>
        <p><strong>Barbero:</strong> ${barbero}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Hora:</strong> ${hora}</p>
        <p><strong>Total:</strong> $${total}</p>
        <br>
        <p>💈Te brindamos estilo y confianza en cada corte💈</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

// 🔹 Nuevo método: Obtener citas con detalles filtradas por rango de fechas
  static async getQuotesForReports(startDate, endDate) {
    const query = `
      SELECT
        q.id_quotes,
        q.date_time,
        q.end_time,
        q.state_quotes,
        s.name_service,
        s.price,
        s.estimated_time,
        barberos.full_name AS barber_name,
        clientes.full_name AS client_name
      FROM quotes q
      JOIN services s ON q.id_services = s.id_services
      LEFT JOIN user barberos ON q.barber_id = barberos.user_id
      LEFT JOIN user clientes ON q.user_id = clientes.user_id
      WHERE q.date_time BETWEEN ? AND ?
      ORDER BY q.date_time ASC;
    `;

    const results = await new Promise((resolve, reject) => {
      db.query(query, [startDate, endDate], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
    return results;
  }


}

module.exports = Quote;