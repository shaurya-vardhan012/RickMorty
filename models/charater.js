const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  species: {
    type:String,
  },
  status: {
    type:String,
  },
  gender: {
    type:String,
  },
  location_name: {
    type: String,  
  },
  episode: {
    type: String,
  },
  image: {
    type : String,
  }
});
module.exports = mongoose.model("character", characterSchema);

