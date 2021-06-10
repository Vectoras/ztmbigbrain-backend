const handleProfile = (db) => (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length === 0) {
        res.status(400).json("Error getting the user");
      } else {
        res.json(user[0]);
      }
    })
    .catch((err) => res.status(400).json("Error getting the user"));
};

module.exports = { handleProfile };
