const Quote = require('../models/Quote');

// 🔹 Enviar correo con detalles de la cita
exports.sendQuoteEmail = async (req, res) => { 
  const { email, servicio, fecha, hora, total, barbero } = req.body;

  if (!email || !servicio || !fecha || !hora || !total || !barbero) {
    return res.status(400).json({ message: 'Faltan datos del correo' });
  }

  try {
    console.log('📤 Datos para enviar correo:', { email, servicio, fecha, hora, total, barbero });
    
    await Quote.sendConfirmationEmail(email, servicio, fecha, hora, total, barbero);
    
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
    const result = await Quote.create(user_id, barber_id, date_time, state_quotes, id_services);
    
    res.status(201).json({
      message: 'Cita creada correctamente',
      id: result.id,
      end_time: result.end_time,
    });
  } catch (error) {
    console.error('🔴 Error en createQuote:', error);
    
    if (error.message === 'El barbero ya tiene una cita en ese horario') {
      return res.status(409).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 🔹 Obtener citas por barbero, año y mes
exports.getQuotesByBarberAndMonth = async (req, res) => {
  const { barber_id, year, month } = req.query;

  if (!barber_id || !year || !month) {
    return res.status(400).json({ message: 'Faltan parámetros: barber_id, year o month' });
  }

  try {
    const citas = await Quote.getByBarberAndMonth(barber_id, year, month);
    res.status(200).json(citas);
  } catch (error) {
    console.error('🔴 Error al obtener citas:', error);
    res.status(500).json({ message: 'Error al obtener citas' });
  }
};

// 🔹 Obtener citas con detalle de servicio por usuario o barbero
exports.getQuotesWithServiceDetails = async (req, res) => {
  const { user_id, barber_id } = req.query;
  const userRole = req.user.role;

  try {
    const isAdmin = userRole === 'admin';
    const citas = await Quote.getWithServiceDetails(user_id, barber_id, isAdmin);
    res.status(200).json(citas);
  } catch (error) {
    console.error('🔴 Error al obtener citas con detalles:', error);
    res.status(500).json({ message: 'Error al obtener citas' });
  }
};

// 🔹 Función para cancelar una cita
exports.cancelQuote = async (req, res) => {
  const quoteId = req.params.id;

  try {
    const success = await Quote.updateStatus(quoteId, 'cancelada');
    
    if (!success) {
      return res.status(404).json({ message: 'Cita no encontrada.' });
    }
    
    res.status(200).json({ message: 'Cita cancelada con éxito.' });
  } catch (error) {
    console.error("Error al cancelar cita:", error);
    res.status(500).json({ message: 'Error al cancelar la cita.' });
  }
};

// 🔹 Función para finalizar una cita
exports.finishQuote = async (req, res) => {
  const quoteId = req.params.id;

  try {
    const success = await Quote.updateStatus(quoteId, 'finalizada');
    
    if (!success) {
      return res.status(404).json({ message: 'Cita no encontrada.' });
    }
    
    res.status(200).json({ message: 'Cita finalizada con éxito.' });
  } catch (error) {
    console.error("Error al finalizar la cita:", error);
    res.status(500).json({ message: 'Error al finalizar la cita.' });
  }
};

// 🔹 Obtener citas por barbero y fecha
exports.getQuotesByBarberAndDate = async (req, res) => {
  const { barber_id, date } = req.query;

  if (!barber_id || !date) {
    return res.status(400).json({ message: 'Faltan parámetros: barber_id o date' });
  }

  try {
    const citas = await Quote.getByBarberAndDate(barber_id, date);
    res.status(200).json(citas);
  } catch (error) {
    console.error('🔴 Error al obtener citas del día:', error);
    res.status(500).json({ message: 'Error al obtener citas del día' });
  }
};

// 🔹 Método modificado: Obtener citas para reportes por rango de fechas
exports.getReportQuotes = async (req, res) => {
  const { startDate, endDate } = req.query; // Recibimos las fechas como parámetros de consulta
  

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Faltan parámetros: startDate o endDate' });
  }

  try {
    const citas = await Quote.getQuotesForReports(startDate, endDate);
    res.status(200).json(citas);
  } catch (error) {
    console.error('🔴 Error al obtener citas para reportes:', error);
    res.status(500).json({ message: 'Error al obtener citas para reportes' });
  }
};


