// modules
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

// connecting to the database
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "smartbrain_server",
    password: "qwerty",
    database: "smartbrain",
  },
});

// setting up the server
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// starting the server
app.listen(3000, () => {
  console.log("app is running on port 3000");
});

// controllers
const signin = require("./controllers/signin.js");
const register = require("./controllers/register.js");
const image = require("./controllers/image.js");
const profile = require("./controllers/profile.js");

// routes
app.post("/signin", signin.handleLogin(bcrypt, db));
app.post("/register", register.handleRegister(bcrypt, db));
app.put("/image", image.handleImage(db));
app.get("/profile/:id", profile.handleProfile(db));
