const mongoose = require('mongoose');

const shipSchema = new mongoose.Schema({
  ship_name:String,
  capacity:Number,
  start_dest:String,
  end_dest:String,
  crew:{
    type:[{
      username:String
    }]
  }
},{ versionKey: false });
const shipModel = mongoose.model("ship", shipSchema);

module.exports = shipModel;