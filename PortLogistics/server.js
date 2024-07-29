const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const moment = require("moment");
const socketIo = require('socket.io');
moment.locale('sr');
const UserRepository = require("./repositories/UserRepository.js");
const ShipRepository = require("./repositories/ShipRepository.js");
const TicketRepository = require("./repositories/TicketRepository.js");
const ShipModel = require("./repositories/ShipModel.js");
const TicketModel =require("./repositories/TicketModel.js");

const app = express();
const server = http.createServer(app);
const botName = "GeometrySolverBot";
const port = 3000;
const io = socketIo(server);

mongoose.connect("mongodb://localhost:27017/SWE_Baza");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/createTicket', async (req, res) => {
  try {
      const { shipName, date, time } = req.body;
      
    
      const ship = await ShipModel.findOne({ ship_name: shipName });
      
      if (!ship) {
          return res.status(404).json({ error: 'Ship not found' });
      }
      
   
      ship.capacity -= 1;  
      
      
      await ship.save();
      
    
      const ticketData = {
          shipName,
          date,
          time
          
      };
      
 
      const newTicket = await TicketModel.create(ticketData);
      
      res.status(201).json(newTicket);
  } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getTickets', async (req, res) => {
  try {
      const tickets = await TicketRepository.getAllTickets();
      res.status(200).json(tickets);
  } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get("/getShipByName", async (req, res) => {
  try {
    const ship_name = req.query.ship_name;
    console.log("Fetching ship by name:", ship_name);
    const ship = await ShipRepository.getShipByName(ship_name);
    res.json(ship);
  } catch (error) {
    console.error('Error getting ship:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getUserByUsername', async (req, res) => {
  try {
    const username = req.query.username;
    const user = await UserRepository.getUserByUsername(username); 
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getUserById/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserRepository.getUserById(userId);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getAllUsers', async (req, res) => {
  try {
    const users = await UserRepository.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/createUser', async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await UserRepository.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getCurrentUser', async (req, res) => {
  try {
    const user = await UserRepository.getCurrentUser(req.session);
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.delete('/deleteUserByUsername', async (req, res) => {
  try {
    const username = req.body.username;
    const result = await UserRepository.deleteUserByUsername(username);
    res.json(result);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/users/:username', async (req, res) => {
  try {
      const username = req.params.username;
      const updateData = req.body;
      const updatedUser = await UserRepository.updateUser(username, updateData);
      if (updatedUser) {
          res.json(updatedUser);
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Error updating user');
  }
});

app.put('/updateUserByUsername/:username', async (req, res) => {
  const username = req.params.username;
  const updateData = req.body;

  try {
    const updatedUser = await UserRepository.updateUserByUsername(username, updateData);

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/updateUserPassword/:username', async (req, res) => {
  try {
      const username = req.params.username;
      const newPassword = req.body.password; 

      const updatedUser = await UserRepository.updateUserPassword(username, newPassword);

      if (updatedUser) {
          res.json(updatedUser);
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      console.error('Error updating user password:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/getAllShips', async (req, res) => {
  try {
    const ships = await ShipRepository.getAllShips();
    res.json(ships);
  } catch (error) {
    console.error('Error fetching ships:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/createShip", async(req, res) => {
  try {

    const ship = await ShipRepository.createShip(req.body);
    res.json(ship);
  } catch (error) {
    console.error('Error creating ship:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/updateShipByName/:name', async (req, res) => {
  try {
      const shipName = req.params.name;
      const updateData = req.body;

    
      const updatedShip = await ShipRepository.updateShipByName(shipName, updateData);

      if (updatedShip) {
          res.json(updatedShip);
      } else {
          res.status(404).send('Ship not found');
      }
  } catch (error) {
      console.error('Error updating ship:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/deleteShipByName/:name', async (req, res) => {
  try {
    const shipName = req.params.name;
    
   
    const deletedShip = await ShipRepository.deleteShipByName(shipName);

    if (deletedShip) {
      res.json(deletedShip);
    } else {
      res.status(404).send('Ship not found');
    }
  } catch (error) {
    console.error('Error deleting ship:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put("/addCrew", async (req, res) => {
  try {
    const crew = {
      username: req.body.username, 
    };

    console.log("Adding crew to ship ID:", req.body.id);
    console.log("Crew Data:", crew);

    const cmt = await ShipRepository.addCrew(req.body.id, crew);
    res.json(cmt);
  } catch (error) {
    console.error('Error adding crew:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/ships/:name/addcrew', async (req, res) => {
  const shipName = req.params.name;
  const { crew } = req.body;

  if (!crew) {
    return res.status(400).json({ error: 'Crew information is required.' });
  }

  try {
    const addedCrew = await addCrewByName(shipName, crew);

    if (addedCrew) {
      res.status(200).json({ message: `${crew} added to crew of ${shipName} successfully.` });
    } else {
      res.status(404).json({ error: `Failed to add ${crew} to crew of ${shipName}.` });
    }
  } catch (error) {
    console.error('Error adding crew member:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


let users = []; 



io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('sendUserInfo', async (userInfo) => {
    console.log('User info received:', userInfo);
    const existingUser = await UserRepository.getUserByUsername(userInfo.username);
    if (!existingUser) {
      await UserRepository.createUser(userInfo);
      io.emit('broadcastUserInfo', userInfo);
    } else {
      console.log('User already exists');
    }
  });




 
  socket.on('getAllUsers', async () => {
    const allUsers = await UserRepository.getAllUsers();
    socket.emit('allUsers', allUsers);
  });

  socket.on('deleteUser', async (data) => {
    console.log(`User to delete: ${data.username}`);
    await UserRepository.deleteUserByUsername(data.username);
  
    io.emit('userDeleted', data.username);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

});



const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
