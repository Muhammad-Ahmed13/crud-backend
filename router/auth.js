const express = require("express");
const User = require("../schema/User");
const { AddUser, GetUser, GetUsers, EditUser, DeleteUser } = require("./consts");

const authRouter = express.Router();

authRouter.post(AddUser, async (req, res) => {
  try {
    // ? Client Error
    const { name, email, username, phone } = req.body;

    const exsisting = await User.findOne({ email: email });

    if (exsisting) {
      return res
        .status(400)
        .json({ message: "User already exists with the same email" });
    }

    const newUser = new User({
      name,
      email,
      username,
      phone,
    });

    await newUser.save();

    res.json("User added successfully");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



authRouter.get(`${GetUser}/:email`, async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



// authRouter.get(`${GetUsers}/:email`, async (req, res) => {
//   try {
//     const { email } = req.params;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
authRouter.get(GetUsers, async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


authRouter.put(`${EditUser}/:id`, async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    existingUser.set(updatedUserData);
    const updatedUser = await existingUser.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


authRouter.delete(`${DeleteUser}/:id`, async (req, res) => {
  try {
    const userId = req.params.id;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.deleteOne({ _id: userId });

    res.status(200).json("User deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





module.exports = authRouter;
