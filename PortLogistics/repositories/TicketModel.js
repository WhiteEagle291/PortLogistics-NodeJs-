const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  shipName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }
  // Other ticket fields
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
