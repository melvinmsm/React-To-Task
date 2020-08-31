const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

//User Model
const User = require("../../models/User");

//@route GET to api/auth
//@desc to auth user
//@access Public

router.post("/", (req, res) => {
  const { email, password } = req.body;

  //validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //check existing user
  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "User does not exists" });

    //validate password

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
      jwt.sign(
        { id: user.id },
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        },
      );
    });
  });
});

//@route POST to api/items
//@desc Create a Item
//@access Public

// router.post("/", (req, res) => {
//   const newItem = new Item({
//     name: req.body.name,
//   });

//   newItem.save().then((item) => res.json(item));
// });

//@route DELETE to api/items/:id
//@desc Create a Item
//@access Public

// router.delete("/:id", (req, res) => {
//   Item.findById(req.params.id) //id will be in url therefore to fetch id from the url
//     .then((item) => item.remove().then(() => res.json({ success: true })))
//     .catch((err) => res.status(404).json({ success: false }));
// });

module.exports = router;
