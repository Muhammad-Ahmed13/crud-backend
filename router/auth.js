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



// authRouter.get(`${GetUser}/:email`, async (req, res) => {
//   try {
//     const { email } = req.params;

//     const user = await User.findOne({ email: email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });


authRouter.get(`${GetUser}/:id`, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id); // Use User.findById to query by ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


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


// authRouter.patch(`${EditUser}/:id`, async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const updatedUserData = req.body;

//     const existingUser = await User.findById(userId);

//     if (!existingUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

   
//     Object.assign(existingUser, updatedUserData);

    
//     await existingUser.save();

//     res.status(200).json(existingUser);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

authRouter.post(`${EditUser}/:id`, async (req, res) => {
  try {
    const { _id, ...updates } = req.body;
    const newUser = await User.findById(_id);

    if (!newUser) {
      return res.status(400).json({ msg: "User not found!" });
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        newUser[key] = value;
      }
    });

    await newUser.save();
    res.json({ ...newUser._doc });
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
