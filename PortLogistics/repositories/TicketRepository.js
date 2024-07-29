const ShipModel = require('./ShipModel');
const userModel = require('./UserModel');
const TicketModel = require('./TicketModel');

class TicketRepository {
  constructor() {}



  async createTicket(ticketData) {
    try {
      const ticket = await TicketModel.create(ticketData);
      return ticket;
    } catch (error) {
      throw error;
    }
  }


  async getTicketsByUser(userId) {
    try {
      const tickets = await TicketModel.find({ user: userId }).populate('ship');
      return tickets;
    } catch (error) {
      throw error;
    }
  }


  async getAllTickets() {
    try {
        return await TicketModel.find();
    } catch (error) {
        throw error;
    }
}

async getTickets() {
  try {
      const tickets = await TicketModel.find();
      return tickets;
  } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
  }
}


}
module.exports = new TicketRepository();
