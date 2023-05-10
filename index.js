const express = require("express");
const app = express();
const dotenv = require("dotenv");
const fs = require('fs');
const mongoose = require("mongoose");
const Character = require('./models/charater');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected with the Database !!! \n"))
    .catch((err) => console.log(err));

const characterHTML = fs.readFileSync('./templates/character.html','utf-8');

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/templates/index.html");
});


app.get('/character', async (req, res) => {
  try {
    var name, gender, status, species,urlEpisode,location_name,image;
    const characterResponse = await fetch('https://rickandmortyapi.com/api/character/');
    const characterData = await characterResponse.json();
    const filterObj = characterData.results.filter(
      (obj) => obj.name === req.query.name && obj.species === req.query.species
    );
    filterObj.forEach((obj) => {
      name = obj.name;
      gender = obj.gender;
      status = obj.status;
      species = obj.species;
      urlEpisode = obj.episode[0];
      location_name = obj.location.name;
      image = obj.image;
    });
    const episodeData = await fetch(`${urlEpisode}`);
    const episodeName = await episodeData.json();
    const episode = episodeName.name;
    var data = {
      name,
      gender,
      status,
      species,
      episode,
      location_name,
      image,
    };
    const charaterAdd = new Character(data);
    try {
      const saveCharacter = await charaterAdd.save();
      console.log("\n\nSuccessfully Inserted\n\n");
    } catch (error) {
      console.log(error);
    }
      let output = characterHTML.replace('{{%IMAGE%}}', data.image);
      output = output.replace('{{%NAME%}}', data.name);
      output = output.replace('{{%STATUS%}}', data.status);
      output = output.replace('{{%SPECIES%}}', data.species);
      output = output.replace('{{%GENDER%}}', data.gender);
      output = output.replace('{{%EPISODE%}}', data.episode);
      output = output.replace('{{%LOCATION%}}', data.location_name);
    console.log(data);
    // console.log(output);

    res.writeHead(200, {
      'Content-Type': "text/html",
    });
    res.end(output);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
})

app.listen(PORT, () => {
  console.log(`\nServer listening at http://localhost:${PORT}\n`);
});
