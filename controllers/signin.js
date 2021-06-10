const handleLogin = (bcrypt, db) => (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json("Invalid form submission!");
  }

  db.select("hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      if (bcrypt.compareSync(req.body.password, data[0].hash)) {
        db.select("id", "name", "entries")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => res.json(user[0]))
          .catch((err) => res.status(400).json("Unable to retrieve user"));
      } else {
        res.status(400).json("No user with these credentials");
      }
    })
    .catch((err) => res.status(400).json("No user with these credentials"));
};

module.exports = { handleLogin };
