// controllers/quotesController.js
const db = require('../config/db');
const nodemailer = require('nodemailer');

// 🔹 Enviar correo con detalles de la cita
exports.sendQuoteEmail = async (req, res) => { 
  const { email, servicio, fecha, hora, total, barbero } = req.body;

  if (!email || !servicio || !fecha || !hora || !total || !barbero) {
    return res.status(400).json({ message: 'Faltan datos del correo' });
  }

  try {
    console.log('📤 Datos para enviar correo:', { email, servicio, fecha, hora, total, barbero });

    // Configuración del transporte
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mysticalcut@gmail.com',  
        pass: 'wwgn lfus tlik utax', 
      },
    });

    // Contenido del correo
    const mailOptions = {
      from: 'mysticalcut@gmail.com',
      to: email,
      subject: 'Confirmación de tu cita - MysticalCut',
      html: `
        <h2>💥💈Gracias por confiar en MysticalCut💈💥</h2>
        <h2>💈Aquí tienes el resumen de tu cita 😉💈</h2>
        <p><strong>Servicio:</strong> ${servicio}</p>
        <p><strong>Barbero:</strong> ${barbero}</p> <!-- Se muestra el nombre del barbero -->
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Hora:</strong> ${hora}</p>
        <p><strong>Total:</strong> $${total}</p>
        <br>
        <p>💈Te brindamos estilo y confianza en cada corte💈</p>
      `,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    console.log('✅ Correo enviado exitosamente a:', email);

    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('🔴 Error al enviar correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
};






// 🔹 Crear una nueva cita
exports.createQuote = async (req, res) => {
  const { user_id, barber_id, date_time, state_quotes, id_services } = req.body;

  if (!user_id || !barber_id || !date_time || !state_quotes || !id_services) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    // Obtener duración estimada del servicio
    const [durationResult] = await new Promise((resolve, reject) => {
      db.query('SELECT estimated_time FROM services WHERE id_services = ?', [id_services], (err, results) => {
        if (err || results.length === 0) return reject(err || 'No se encontró el servicio');
        resolve(results);
      });
    });

    const estimatedTime = durationResult.estimated_time; // tiempo estimado en formato 'hh:mm:ss'
    const [hours, minutes] = estimatedTime.split(':').map(Number);
    const estimatedMinutes = (hours * 60) + minutes; // Convertimos a minutos

    const startTime = new Date(date_time);
    const endTime = new Date(startTime.getTime() + estimatedMinutes * 60000); // Calculamos la hora de finalización

    // Verificar disponibilidad del barbero
    const disponible = await verificarDisponibilidad(barber_id, startTime, endTime);
    if (!disponible) {
      return res.status(409).json({ message: 'El barbero ya tiene una cita en ese horario' });
    }

    // Insertar la nueva cita
    db.query(
      `INSERT INTO quotes (user_id, barber_id, date_time, end_time, state_quotes, id_services)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, barber_id, startTime, endTime, state_quotes, id_services],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error al guardar la cita' });

        res.status(201).json({
          message: 'Cita creada correctamente',
          id: result.insertId,
          end_time: endTime,
        });
      }
    );
  } catch (error) {
    console.error('🔴 Error en createQuote:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 🔹 Obtener citas por barbero, año y mes
exports.getQuotesByBarberAndMonth = (req, res) => {
  const { barber_id, year, month } = req.query;

  if (!barber_id || !year || !month) {
    return res.status(400).json({ message: 'Faltan parámetros: barber_id, year o month' });
  }

  const query = `
    SELECT id_quotes, date_time, end_time
    FROM quotes
    WHERE barber_id = ? 
      AND YEAR(date_time) = ? 
      AND MONTH(date_time) = ?
  `;

  db.query(query, [barber_id, year, month], (err, results) => {
    if (err) {
      console.error('🔴 Error al obtener citas:', err);
      return res.status(500).json({ message: 'Error al obtener citas' });
    }

    const citas = results.map(cita => ({
      id: cita.id_quotes,
      date_time: cita.date_time,
      end_time: cita.end_time,
      duration: (new Date(cita.end_time) - new Date(cita.date_time)) / 60000 // minutos
    }));

    res.status(200).json(citas);
  });
};

// 🔹 Obtener citas con detalle de servicio por usuario o barbero
exports.getQuotesWithServiceDetails = (req, res) => {
  const { user_id, barber_id } = req.query;
  const userRole = req.user.role; // Suponiendo que tienes el rol en la sesión del usuario (esto depende de tu implementación de autenticación)

  // Si el rol es admin, no filtramos por user_id ni barber_id
  if (userRole === 'admin') {
    const query = `
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
      ORDER BY q.date_time DESC
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('🔴 Error al obtener citas con detalles:', err);
        return res.status(500).json({ message: 'Error al obtener citas' });
      }

      res.status(200).json(results);
    });

  } else if (user_id || barber_id) {
    // Lógica actual para otros usuarios (barbero o cliente)
    const query = `
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
      WHERE (q.user_id = ? OR q.barber_id = ?)
      ORDER BY q.date_time DESC
    `;

    db.query(query, [user_id || barber_id, barber_id || user_id], (err, results) => {
      if (err) {
        console.error('🔴 Error al obtener citas con detalles:', err);
        return res.status(500).json({ message: 'Error al obtener citas' });
      }

      res.status(200).json(results);
    });
  } else {
    return res.status(400).json({ message: 'Falta el parámetro user_id o barber_id' });
  }
};


// Función para cancelar una cita
exports.cancelQuote = (req, res) => {
  const quoteId = req.params.id;

  const query = 'UPDATE quotes SET state_quotes = ? WHERE id_quotes = ?';

  db.query(query, ['cancelada', quoteId], (err, result) => {
    if (err) {
      console.error("Error al cancelar cita:", err);
      return res.status(500).json({ message: 'Error al cancelar la cita.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cita no encontrada.' });
    }
    res.status(200).json({ message: 'Cita cancelada con éxito.' });
  });
};

// Función para finalizar una cita
exports.finishQuote = (req, res) => {
  const quoteId = req.params.id;

  const query = 'UPDATE quotes SET state_quotes = ? WHERE id_quotes = ?';

  db.query(query, ['finalizada', quoteId], (err, result) => {
    if (err) {
      console.error("Error al finalizar la cita:", err);
      return res.status(500).json({ message: 'Error al finalizar la cita.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cita no encontrada.' });
    }
    res.status(200).json({ message: 'Cita finalizada con éxito.' });
  });
};

// Función para verificar la disponibilidad del barbero
async function verificarDisponibilidad(barberId, startTime, endTime) {
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

  return result.length === 0; // Si no hay citas en este rango, el barbero está disponible
}




exports.getQuotesByBarberAndDate = (req, res) => {
  const { barber_id, date } = req.query;

  if (!barber_id || !date) {
    return res.status(400).json({ message: 'Faltan parámetros: barber_id o date' });
  }

  const startOfDay = `${date} 00:00:00`;
  const endOfDay = `${date} 23:59:59`;

  const query = `
    SELECT id_quotes, date_time, end_time
    FROM quotes
    WHERE barber_id = ?
      AND date_time BETWEEN ? AND ?
  `;

  db.query(query, [barber_id, startOfDay, endOfDay], (err, results) => {
    if (err) {
      console.error('🔴 Error al obtener citas del día:', err);
      return res.status(500).json({ message: 'Error al obtener citas del día' });
    }

    res.status(200).json(results);
  });
};
