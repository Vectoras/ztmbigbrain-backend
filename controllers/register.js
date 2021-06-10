const handleRegister = (bcrypt, db) => (req, res) => {
  // checks
  if (!req.body.email || !req.body.password || !req.body) {
    return res.status(400).json("Invalid form submission!");
  }

  // encoding the password
  const hash = bcrypt.hashSync(req.body.password);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: req.body.email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx
          .insert({
            name: req.body.name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .into("users");
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
    .then(() => {
      db.select(["id", "name", "entries"])
        .from("users")
        .where({
          email: req.body.email,
        })
        .then((user) => {
          res.json(user[0]);
        })
        .catch((err) => {
          res.json("Error at retrieving the user after registration !!!");
        });
    })
    .catch((err) => {
      res.status(400).json("Unable to register");
    });
};

module.exports = { handleRegister };
