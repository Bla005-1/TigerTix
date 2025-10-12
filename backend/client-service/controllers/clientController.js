const { getEvents, purchaseOneTicket } = require('../models/clientModel'); 
 
const listEvents = async (req, res, next) => {
  try {
    const events = await getEvents(); 
    res.json(events);
  } catch(err) {
    next(err);
  }
};

const purchaseTicket = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      const error = new Error('Invalid event id.');
      error.statusCode = 400;
      throw error;
    }

    const result = await purchaseOneTicket(id);

    if (result === 'NOT_FOUND') {
        const error = new Error('Event not found.');
        error.statusCode = 404;
        throw error;
    }

    if (result === 'SOLD_OUT') {
        const error = new Error('No tickets available for this event.');
        error.statusCode = 409;
        throw error;
    }

    res.status(200).json({ success: true, message: 'Ticket purchased successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listEvents, purchaseTicket }; 
