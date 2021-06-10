// modules
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

// connecting to the database
// const db = knex({
//   client: "pg",
//   connection: {
//     host: "127.0.0.1",
//     user: "smartbrain_server",
//     password: "qwerty",
//     database: "smartbrain",
//   },
// }); -- >> localhost

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

// setting up the server
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

// controllers
const root = require("./controllers/root.js");
const signin = require("./controllers/signin.js");
const register = require("./controllers/register.js");
const image = require("./controllers/image.js");
const profile = require("./controllers/profile.js");

// routes
app.get("/", root.handleRoot());
app.post("/signin", signin.handleLogin(bcrypt, db));
app.post("/register", register.handleRegister(bcrypt, db));
app.put("/image", image.handleImage(db));
app.get("/profile/:id", profile.handleProfile(db));
