const ShipModel = require('./ShipModel');
const userModel = require('./UserModel');

class ShipRepository {
  constructor() {}

  async createShip(shipData) {
    try {
      const ship = await ShipModel.create(shipData);
      return ship;
    } catch (error) {
      throw error;
    }
  }

  async getShipByName(ship_name) {
    try {
      const ship = await ShipModel.findOne({ ship_name });
      return ship;
    } catch (error) {
      throw error;
    }
  }

  async getAllShips() {
    try {
      const ships = await ShipModel.find();
      return ships;
    } catch (error) {
      throw error;
    }
  }
  async updateShipByName(name, updateData) {
    try {
      const updatedShip = await ShipModel.findOneAndUpdate({ ship_name: name }, updateData, { new: true });
      return updatedShip;
    } catch (error) {
      throw error;
    }
  }

  async deleteShipByName(ship_name) {
    try {
      const deletedShip = await ShipModel.findOneAndDelete({ ship_name });
      return deletedShip;
    } catch (error) {
      throw error;
    }
  }

//   async addCrew(shipName, crew) {
//     try {
//       console.log(`Searching for ship with name: ${shipName}`);
//         // Find the ship by its name
//         const ship = await ShipModel.findOne({ ship_name: shipName });

//         if (!ship) {
//             throw new Error("Ship not found");
//         }

//         // Update the crew array of the found ship
//         ship.crew.push(crew);
//         const result = await ship.save();

//         if (result) {
//             return crew;
//         } else {
//             console.log("Nothing happened...");
//         }
//     } catch (error) {
//         throw error;
//     }
// }


async addCrew(id, crew) {
  try {
    const filter = { _id: id };
    const update = { $push: { crew: crew } };
    const result = await ShipModel.updateOne(filter, update);

    if (result.modifiedCount === 1) {
      return crew;
    } else {
      console.log("Nothing happened...");
      return null;
    }
  } catch (error) {
    throw error;
  }
}


async addCrewByName(shipName, crew) {
  try {
    const filter = { name: shipName };
    const update = { $push: { crew: crew } };
    const result = await ShipModel.updateOne(filter, update);

    if (result.modifiedCount === 1) {
      return crew;
    } else {
      console.log("Nothing happened...");
      return null;
    }
  } catch (error) {
    throw error;
  }
}


}
module.exports = new ShipRepository();