const Clarifai = require("clarifai");
const { response } = require("express");

// Clarifai
const app = new Clarifai.App({
  apiKey: "833cf82f5bb24fb99dcd15f6c1c1448d",
});

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  let serverResponse = {};

  // api request to Clarifai to analize the current received image
  app.models
    .predict("a403429f2ddf4b49b307e318f00e528b", req.body.imageSrc)
    // processing the Clarifai response and adding it to the final serverResponse
    .then((response) => {
      serverResponse.faceBoxesArray = response.outputs[0].data.regions.map((currentRegion) => {
        return currentRegion.region_info.bounding_box;
      });
    })
    .then(() => {
      // incrementing the entries for the user in the database
      db("users")
        .where({ id: id })
        .increment("entries", 1)
        .returning(["entries", "name"])
        .then((response) => {
          // adding user details to the final serverResponse
          if (response.length) {
            serverResponse.name = response[0].name;
            serverResponse.entries = response[0].entries;
          }
        })
        .then(() => {
          res.json(serverResponse);
        })
        .catch((err) => res.status(400).json("Error at updating the entries"));
    })
    .catch((err) => {
      res.status(400).json("Error at processing the image!");
    });
};

module.exports = { handleImage };
