const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name);
    let user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json("User already exists");
    }

    if (!name || !email || !password)
      return res.status(400).json("all fields are required");

    if (!validator.isEmail(email))
      return res.status(400).json("invalid email");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("password is weak");

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }

};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json("Invalid Credentials" );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json( "Invalid Credentials");
    }

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name:user.name, email, token });


  } catch (error) {
    console.log(error);
    res.status(500).json( "Server Error" );
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {

    const user = await userModel.findById(userId).select("-password");
    console.log(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
}

const getUsers= async (req, res) => {
  try {
    const users = await userModel.find()
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
}



module.exports = { registerUser, loginUser , findUser , getUsers};
