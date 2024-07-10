const express = require("express");
const con = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var moment = require("moment");

const router = express.Router();

router.post("/register", async (req, res) => {
  const alreadyUser = "SELECT * FROM users WHERE username = ?";

  con.query(alreadyUser, [req.body.username], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    if (data.length) return res.status(409).json("User already exists!");

    // CREATE A NEW USER
    // Hash the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const newUser =
      "INSERT INTO users (`email`,`username`,`password`,`firstName`,`lastName`,`address`,`country`,`dob`,`mobile`, `createdOn`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
      req.body.email,
      req.body.username,
      hashedPassword,
      req.body.firstName,
      req.body.lastName,
      req.body.address,
      req.body.country,
      req.body.dob,
      req.body.mobile,
      moment().format("YYYY-MM-DD HH:mm:ss"),
    ];

    con.query(newUser, values, (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(200).json("User has been created.");
    });
  });
})
router.post("/login", async (req, res) => {

  const userLogin = "SELECT * FROM users WHERE username = ?";
  con.query(userLogin, [req.body.username], (err, data) => {
    console.log(data, "datas");

    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");
    let user = data[0]
    // below command is hashing the password
    const checkPassword = bcrypt.compareSync(req.body.password, user.password);

    // const checkPassword = (req.body.password, user.password);
    if (!checkPassword) return res.status(400).json("Wrong password or username!");

    delete user.password;
    const token = jwt.sign({ id: user.id, username: user.username }, "secretkey", { expiresIn: "1200s" });
    res.status(200).json({ token: token });
  });
});





module.exports = router;


